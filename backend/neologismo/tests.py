from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Neologismo

Usuario = get_user_model()


class NeologismoBaseTest(APITestCase):
    def setUp(self):
        self.autor = Usuario.objects.create_user(
            username="autor", password="senha123"
        )
        self.outro = Usuario.objects.create_user(
            username="outro", password="senha123"
        )
        self.neo = Neologismo.objects.create(
            titulo="Biscoitar",
            pronuncia="/bis.coi.tar/",
            classe_gramatical="Verbo",
            definicao="Buscar validação pública nas redes.",
            contexto_uso="Ela passou a tarde biscoitando.",
            tags=["Internetês"],
            status="aprovado",
            autor=self.autor,
        )


class PermissoesTest(NeologismoBaseTest):
    def test_listagem_e_publica(self):
        resp = self.client.get("/api/neologismos/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_criar_exige_autenticacao(self):
        resp = self.client.post("/api/neologismos/", {"titulo": "X"})
        self.assertIn(
            resp.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_like_exige_autenticacao(self):
        resp = self.client.post(f"/api/neologismos/{self.neo.id}/dar_like/")
        self.assertIn(
            resp.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )


class CriarNeologismoTest(NeologismoBaseTest):
    def test_cria_com_contextos_aninhados(self):
        self.client.force_authenticate(self.autor)
        payload = {
            "titulo": "Cringe",
            "pronuncia": "/crín.gi/",
            "classe_gramatical": "Adjetivo",
            "definicao": "Que provoca vergonha alheia.",
            "contexto_uso": "Foi cringe.",
            "tags": ["Anglicismo"],
            "contextos": [
                {"citacao": "Que cringe!", "fonte": "@alguem", "link": ""},
                {"citacao": "Muito cringe isso.", "fonte": "", "link": ""},
            ],
        }
        resp = self.client.post("/api/neologismos/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        # status é definido pelo servidor, não pelo cliente
        self.assertEqual(resp.data["status"], "pendente")
        # autor vem do usuário autenticado
        self.assertEqual(resp.data["autor"], self.autor.id)
        self.assertEqual(len(resp.data["contextos"]), 2)

    def test_cliente_nao_define_status(self):
        self.client.force_authenticate(self.autor)
        payload = {
            "titulo": "Hack",
            "pronuncia": "/hak/",
            "classe_gramatical": "Substantivo",
            "definicao": "Atalho.",
            "contexto_uso": "Um hack.",
            "tags": [],
            "status": "aprovado",
        }
        resp = self.client.post("/api/neologismos/", payload, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["status"], "pendente")


class LikeDeslikeTest(NeologismoBaseTest):
    def test_like_adiciona_e_remove(self):
        self.client.force_authenticate(self.outro)
        url = f"/api/neologismos/{self.neo.id}/dar_like/"

        resp = self.client.post(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["likes"], 1)
        self.assertEqual(self.neo.total_likes, 1)

        # segundo clique remove
        resp = self.client.post(url)
        self.assertEqual(resp.data["likes"], 0)

    def test_deslike_remove_like_existente(self):
        self.neo.likes.add(self.outro)
        self.client.force_authenticate(self.outro)

        resp = self.client.post(f"/api/neologismos/{self.neo.id}/dar_deslike/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["likes"], 0)
        self.assertEqual(resp.data["deslikes"], 1)
        self.assertFalse(self.neo.likes.filter(id=self.outro.id).exists())

    def test_resposta_deslike_usa_chaves_padronizadas(self):
        self.client.force_authenticate(self.outro)
        resp = self.client.post(f"/api/neologismos/{self.neo.id}/dar_deslike/")
        self.assertIn("likes", resp.data)
        self.assertIn("deslikes", resp.data)


class ModeracaoTest(NeologismoBaseTest):
    def setUp(self):
        super().setUp()
        self.admin = Usuario.objects.create_user(
            username="admin", password="senha123", is_staff=True
        )
        self.neo.status = "pendente"
        self.neo.save()

    def test_usuario_comum_nao_modera(self):
        self.client.force_authenticate(self.outro)
        resp = self.client.post(f"/api/neologismos/{self.neo.id}/aprovar/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_aprova(self):
        self.client.force_authenticate(self.admin)
        resp = self.client.post(f"/api/neologismos/{self.neo.id}/aprovar/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.neo.refresh_from_db()
        self.assertEqual(self.neo.status, "aprovado")

    def test_admin_rejeita_com_motivo(self):
        self.client.force_authenticate(self.admin)
        resp = self.client.post(
            f"/api/neologismos/{self.neo.id}/rejeitar/",
            {"motivo_rejeicao": "Duplicado"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.neo.refresh_from_db()
        self.assertEqual(self.neo.status, "rejeitado")
        self.assertEqual(self.neo.motivo_rejeicao, "Duplicado")

    def test_admin_reativa(self):
        self.neo.status = "rejeitado"
        self.neo.save()
        self.client.force_authenticate(self.admin)
        resp = self.client.post(f"/api/neologismos/{self.neo.id}/reativar/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.neo.refresh_from_db()
        self.assertEqual(self.neo.status, "aprovado")
        self.assertIsNotNone(self.neo.reativado_em)

    def test_filtro_por_status(self):
        resp = self.client.get("/api/neologismos/?status=pendente")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(all(n["status"] == "pendente" for n in resp.data))


class CadastroTest(APITestCase):
    def test_cadastro_cria_usuario_e_retorna_token(self):
        resp = self.client.post(
            "/api/cadastro/",
            {"username": "novo", "email": "n@x.com", "password": "senha123"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", resp.data)
        self.assertTrue(Usuario.objects.filter(username="novo").exists())

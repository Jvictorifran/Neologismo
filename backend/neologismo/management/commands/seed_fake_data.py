from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from neologismo.models import Neologismo, Contexto
import random

Usuario = get_user_model()

NEOLOGISMOS = [
    {
        "titulo": "Biscoitar",
        "classe_gramatical": "VERBO INTRANSITIVO",
        "definicao": "Buscar elogios ou validação pública nas redes sociais de forma evidente, geralmente através de fotos ou comentários provocativos.",
        "contexto_uso": "Ela passou a tarde biscoitando no Instagram e nem percebeu o tempo passar.",
        "tags": ["Internetês", "Comportamento"],
    },
    {
        "titulo": "Cringe",
        "classe_gramatical": "ADJETIVO UNIFORME",
        "definicao": "Que provoca vergonha alheia; constrangedor, cafona. Adaptado do inglês 'cringe', popularizou-se entre jovens brasileiros.",
        "contexto_uso": "Foi muito cringe quando ele tentou usar gíria adolescente e errou todas.",
        "tags": ["Anglicismo", "Internetês"],
    },
    {
        "titulo": "Goat",
        "classe_gramatical": "SUBSTANTIVO UNIFORME",
        "definicao": "Greatest of All Time — o melhor de todos os tempos. Usado para se referir a alguém considerado imbatível em sua área.",
        "contexto_uso": "Messi é goat, não tem discussão. O cara venceu tudo que existia.",
        "tags": ["Anglicismo", "Comportamento"],
    },
    {
        "titulo": "Printar",
        "classe_gramatical": "VERBO TRANSITIVO DIRETO",
        "definicao": "Capturar uma imagem da tela do dispositivo (screenshot). Verbalização do inglês 'to print' no contexto digital brasileiro.",
        "contexto_uso": "Printa essa conversa antes que ele apague, por favor.",
        "tags": ["Anglicismo", "Internetês"],
    },
    {
        "titulo": "Tankar",
        "classe_gramatical": "VERBO TRANSITIVO DIRETO",
        "definicao": "Suportar, aguentar ou resistir a uma situação difícil ou desagradável. Originado do universo gamer, popularizou-se no cotidiano.",
        "contexto_uso": "Não sei como você tanka aquele chefe todo dia. Eu já teria pedido demissão.",
        "tags": ["Anglicismo", "Internetês"],
    },
    {
        "titulo": "Lacração",
        "classe_gramatical": "SUBSTANTIVO FEMININO",
        "definicao": "Ato de se expressar de forma contundente e assertiva, especialmente em debates sobre identidade e direitos sociais.",
        "contexto_uso": "A fala dela foi uma lacração — ninguém conseguiu rebater nada.",
        "tags": ["Comportamento", "Internetês"],
    },
    {
        "titulo": "Redpillado",
        "classe_gramatical": "ADJETIVO MASCULINO",
        "definicao": "Indivíduo que passou por um suposto 'despertar' ideológico online. Derivado de 'red pill', termo popularizado pelo filme Matrix.",
        "contexto_uso": "Depois que ele ficou redpillado, não para de mandar textão no grupo da família.",
        "tags": ["Anglicismo", "Comportamento"],
    },
    {
        "titulo": "Tankável",
        "classe_gramatical": "ADJETIVO UNIFORME",
        "definicao": "Situação, tarefa ou proposta que é suportável, que se consegue aguentar ou tolerar, mesmo com dificuldade.",
        "contexto_uso": "Aquele turno de 12 horas é pesado, mas é tankável se você levar um lanche bom.",
        "tags": ["Anglicismo", "Internetês"],
    },
    {
        "titulo": "Migar",
        "classe_gramatical": "SUBSTANTIVO UNIFORME",
        "definicao": "Tratamento afetivo e informal entre amigas, derivado de 'amiga'. Usado principalmente em contextos de internet e redes sociais.",
        "contexto_uso": "Migar, você não vai acreditar no que aconteceu hoje!",
        "tags": ["Internetês", "Gíria"],
    },
    {
        "titulo": "De base",
        "classe_gramatical": "LOCUÇÃO ADJETIVA",
        "definicao": "Algo de má qualidade, inferior ou sem valor. Expressão popularizada nas redes sociais como forma de crítica.",
        "contexto_uso": "Aquele filme que você recomendou era muito de base, eu não consegui assistir até o fim.",
        "tags": ["Gíria", "Comportamento"],
    },
    {
        "titulo": "Shippar",
        "classe_gramatical": "VERBO TRANSITIVO DIRETO",
        "definicao": "Torcer ou imaginar um relacionamento romântico entre duas pessoas, reais ou fictícias. Derivado do inglês 'relationship'.",
        "contexto_uso": "Todo mundo shipava aqueles dois, mas eles nunca ficaram de verdade.",
        "tags": ["Anglicismo", "Internetês"],
    },
    {
        "titulo": "Hater",
        "classe_gramatical": "SUBSTANTIVO UNIFORME",
        "definicao": "Pessoa que demonstra hostilidade ou aversão injustificada contra alguém ou algo, geralmente nas redes sociais.",
        "contexto_uso": "Ele é o maior hater do grupo — critica tudo que todo mundo faz.",
        "tags": ["Anglicismo", "Internetês"],
    },
    {
        "titulo": "Boladão",
        "classe_gramatical": "ADJETIVO MASCULINO",
        "definicao": "Situação confusa, complicada ou que gera desconforto. Algo que está fora do normal ou causando estranhamento.",
        "contexto_uso": "Aquele final do filme foi boladão demais, eu não entendi nada.",
        "tags": ["Gíria", "Verbalização"],
    },
    {
        "titulo": "Flexar",
        "classe_gramatical": "VERBO TRANSITIVO DIRETO",
        "definicao": "Exibir, ostentar ou demonstrar superioridade sobre algo. Derivado do inglês 'flex', popularizado no universo fitness e gamer.",
        "contexto_uso": "Ele só faz live pra flexar o carro novo e a coleção de tênis.",
        "tags": ["Anglicismo", "Internetês"],
    },
    {
        "titulo": "Gatilhar",
        "classe_gramatical": "VERBO INTRANSITIVO",
        "definicao": "Reagir de forma intensa e desproporcional a algum estímulo, geralmente emocional. Derivado de 'gatilho' no contexto de saúde mental.",
        "contexto_uso": "Falaram de política no jantar e ele gatilhou na hora.",
        "tags": ["Verbalização", "Comportamento"],
    },
    {
        "titulo": "Povão",
        "classe_gramatical": "SUBSTANTIVO MASCULINO",
        "definicao": "Pessoas de classe popular; também usado de forma pejorativa ou como autodefinição orgulhosa. Popularizado nas redes como meme.",
        "contexto_uso": "O povão quer é preço baixo e internet grátis, o resto é conversa.",
        "tags": ["Gíria", "Comportamento"],
    },
    {
        "titulo": "Stalkar",
        "classe_gramatical": "VERBO TRANSITIVO DIRETO",
        "definicao": "Vigiar ou investigar obsessivamente a vida de alguém nas redes sociais. Do inglês 'to stalk' (perseguir).",
        "contexto_uso": "Confesso que stalkiei o perfil inteiro do novo vizinho antes de falar com ele.",
        "tags": ["Anglicismo", "Internetês"],
    },
    {
        "titulo": "Lacrar",
        "classe_gramatical": "VERBO INTRANSITIVO",
        "definicao": "Arrasar, impressionar ou se expressar de forma brilhante. Popularizado em contextos de cultura pop e ativismo digital.",
        "contexto_uso": "Ela lacrou na apresentação — ninguém teve o que contestar.",
        "tags": ["Verbalização", "Internetês"],
    },
]


class Command(BaseCommand):
    help = "Gera dados fake de neologismos no banco de dados"

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Apaga todos os neologismos existentes antes de gerar novos",
        )

    def handle(self, *args, **options):
        if options["flush"]:
            count = Neologismo.objects.count()
            Neologismo.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Removidos {count} neologismos."))

        usuario, created = Usuario.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@neologismo.com",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            usuario.set_password("admin123")
            usuario.save()
            self.stdout.write(self.style.SUCCESS("Usuário 'admin' criado com senha 'admin123'."))
        else:
            self.stdout.write(self.style.SUCCESS("Usuário 'admin' já existe."))

        criados = 0
        for item in NEOLOGISMOS:
            if not Neologismo.objects.filter(titulo=item["titulo"]).exists():
                n = Neologismo.objects.create(
                    titulo=item["titulo"],

                    classe_gramatical=item["classe_gramatical"],
                    definicao=item["definicao"],
                    contexto_uso=item["contexto_uso"],
                    tags=item["tags"],
                    status=random.choice(["aprovado", "aprovado", "aprovado", "pendente"]),
                    autor=usuario,
                )
                # Contexto estruturado a partir da frase de exemplo
                Contexto.objects.create(
                    neologismo=n,
                    citacao=item["contexto_uso"],
                    fonte=random.choice(
                        ["@usuario no X", "Comentário no Instagram",
                         "Conversa de WhatsApp", "TikTok"]
                    ),
                    link="https://exemplo.com/fonte",
                )

                num_likes = random.randint(10, 500)
                num_deslikes = random.randint(0, 50)

                for _ in range(num_likes):
                    n.likes.add(usuario)

                for _ in range(num_deslikes):
                    n.deslikes.add(usuario)

                criados += 1
                self.stdout.write(f"  Criado: {n.titulo} ({n.total_likes} likes)")

        self.stdout.write(self.style.SUCCESS(f"\n{criados} neologismos criados com sucesso!"))

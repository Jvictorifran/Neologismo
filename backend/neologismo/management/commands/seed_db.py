import random
from django.core.management.base import BaseCommand
from faker import Faker
from neologismo.models import Neologismo
from usuario.models import Usuario

class Command(BaseCommand):
    help = 'Popula o banco de dados com usuários e neologismos usando Faker'

    def handle(self, *args, **kwargs):
        fake = Faker(['pt_BR'])
        
        self.stdout.write(self.style.HTTP_INFO("--- Iniciando Seed ---"))

        # 1. Garantir que temos usuários para dar likes
        self.stdout.write("Criando usuários de teste...")
        for _ in range(5):
            username = fake.user_name()
            if not Usuario.objects.filter(username=username).exists():
                Usuario.objects.create_user(
                    username=username,
                    email=fake.email(),
                    password='senha123'
                )

        todos_usuarios = list(Usuario.objects.all())
        autor_principal = Usuario.objects.first()

        if not autor_principal:
            self.stdout.write(self.style.ERROR("Erro: Nenhum usuário encontrado."))
            return

        # 2. Configurações para os Neologismos
        classes = ['Substantivo', 'Verbo', 'Adjetivo', 'Interjeição', 'Expressão']
        status_opcoes = ['PENDENTE', 'APROVADO', 'REJEITADO']

        self.stdout.write(f"Gerando 50 neologismos...")

        for i in range(50):
            titulo = fake.word().capitalize()
            
            # Criamos o objeto (Campos normais e ForeignKey)
            neo = Neologismo.objects.create(
                titulo=f"{titulo}_{i}", # Adicionado ID para evitar duplicatas de palavras curtas do Faker
                pronuncia=f"{titulo.lower()}-zão",
                classe_gramatical=random.choice(classes),
                definicao=fake.sentence(nb_words=12),
                contexto_uso=fake.paragraph(nb_sentences=2),
                tags=[fake.word() for _ in range(random.randint(1, 4))],
                status=random.choice(status_opcoes),
                autor=random.choice(todos_usuarios)
            )

            # 3. Lógica para ManyToMany (Likes e Deslikes)
            # Sorteia uma quantidade aleatória de usuários para interagir
            num_likes = random.randint(0, len(todos_usuarios))
            num_deslikes = random.randint(0, len(todos_usuarios) - num_likes)

            usuarios_random = random.sample(todos_usuarios, len(todos_usuarios))
            
            votos_like = usuarios_random[:num_likes]
            votos_deslike = usuarios_random[num_likes : num_likes + num_deslikes]

            # O segredo para não dar erro: usar .set()
            neo.likes.set(votos_like)
            neo.deslikes.set(votos_deslike)

        self.stdout.write(self.style.SUCCESS(f"Sucesso! Banco de dados populado."))
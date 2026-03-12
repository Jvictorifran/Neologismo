import os
import django
import random
from faker import Faker

# Configura o ambiente do Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from neologismo.models import Neologismo
from django.contrib.auth import get_user_model

User = get_user_model()
fake = Faker('pt_BR')

def popular_banco(n=20):
    # Pega o seu usuário admin para ser o autor desses fakes
    autor = User.objects.first()
    
    if not autor:
        print("❌ Erro: Nenhum usuário encontrado. Crie um superuser primeiro!")
        return

    # Lista de prefixos para criar termos que pareçam neologismos
    prefixos = ["Bio", "Cyber", "Tech", "Eco", "Hyper", "Neo", "Cloud"]
    sufixos = ["izar", "agem", "ismo", "ly", "mance", "tech"]

    print(f"⏳ Criando {n} neologismos no PostgreSQL...")

    for _ in range(n):
        # Gera um termo "inventado"
        termo_fake = random.choice(prefixos) + random.choice(sufixos)
        
        Neologismo.objects.create(
            termo=termo_fake.capitalize(),
            significado=fake.sentence(nb_words=10),
            exemplo_de_uso=fake.paragraph(nb_sentences=2),
            aprovado=random.choice([True, False]),
            likes=random.randint(0, 500), # Agora com os likes que você criou!
            deslikes = random.randint(0, 599),
            autor=autor
        )

    print(f"✅ Sucesso! {n} registros inseridos no banco 'banco_neologismo'.")

if __name__ == '__main__':
    popular_banco(30) # Vamos criar 30 de uma vez para encher a tela
from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class Neologismo (models.Model):
    #sobre o neologismo
    termo = models.CharField(help_text='Nome do Neologismo', max_length=50)
    significado = models.TextField(help_text='O que significa esse neologismo')
    exemplo_de_uso = models.TextField(help_text='Exemplo de uso do neologismo no dia á dia')

    #sobre aprovação
    aprovado = models.BooleanField(default=False)

    #sobre o usuario/autor
    data_criacao = models.DateTimeField(auto_now_add=True, default='Sem Informação')
    autor = models.CharField(max_length=100, blank=True, null=True, default='Anônimo')

    def __str__(self):
        return self.termo


from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings

# Create your models here.
class Neologismo (models.Model):
    #sobre o neologismo
    termo = models.CharField(help_text='Nome do Neologismo', max_length=50)
    significado = models.TextField(help_text='O que significa esse neologismo')
    exemplo_de_uso = models.TextField(help_text='Exemplo de uso do neologismo no dia á dia')

    #sobre aprovação
    aprovado = models.BooleanField(default=False)

    #sobre o usuario/autor
    data_criacao = models.DateTimeField(auto_now_add=True)

    autor = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.CASCADE) #link para tabela dos usuarios

    #area de curtidas
    likes = models.IntegerField(
        default=0, 
        validators=[MinValueValidator(0)],
        help_text="Número de curtidas do neologismo"
    )
            
    deslikes = models.IntegerField(
        default=0, 
        validators=[MinValueValidator(0)],
        help_text="Número de deslikes do neologismo"
    )
    def __str__(self):
        return self.termo


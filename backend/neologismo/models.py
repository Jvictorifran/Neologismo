from django.contrib.auth.models import AbstractUser
from django.db import models
#from django.core.validators import MinValueValidator
from django.conf import settings
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Neologismo (models.Model):
    #sobre o neologismo

    #campos antigos que mudaram de nome
    titulo = models.CharField(max_length=50, help_text='Nome do neologismo')
    definicao = models.TextField(help_text='Descrição completa do significado') 
    contexto_uso = models.TextField(help_text='Frase de exemplo demonstrando o uso') 
    
    #novos campos
    pronuncia = models.CharField(max_length=100, help_text='Formato fonético. Ex: /bis.coi.tar/')
    classe_gramatical = models.CharField(max_length=50, help_text='Substantivo, Verbo, Adjetivo, etc.')
    
    # tags (array[str], opcional) - Usando ArrayField do Postgres
    tags = ArrayField(
        models.CharField(max_length=50), 
        blank=True, 
        default=list,
        help_text='Lista de strings. Ex: ["Internetês", "Anglicismo"]'
    )

    # Status de Moderação (Enum)
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aprovado', 'Aprovado'),
        ('rejeitado', 'Rejeitado'),
    ]
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
          default='pendente'
    )
    
    # Campos de Moderação (Novos v2.0)
    motivo_rejeicao = models.TextField(blank=True, null=True, help_text='Texto explicativo do admin ao rejeitar')
    reativado_em = models.DateTimeField(blank=True, null=True, help_text='Data em que o admin reativou após rejeição')

    # --- Auditoria e Relacionamentos ---
    data_criacao = models.DateTimeField(auto_now_add=True)
    autor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='meus_neologismos'
    )

    #area de curtidas
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='neologismos_curtidos',
        blank=True
    )
            
    deslikes = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        related_name='neologismos_rejeitados',
        blank=True
    )

    @property
    def total_likes(self):
        return self.likes.count()
    
    @property
    def total_deslikes(self):
        return self.deslikes.count()
    
    def __str__(self):
        return self.titulo


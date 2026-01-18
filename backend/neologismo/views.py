from rest_framework import viewsets
from .models import Neologismo
from .serializers import NeologismoSerializer

class NeologismoViewSet(viewsets.ModelViewSet):
    queryset = Neologismo.objects.all().order_by('-data_criacao') # Aqui a gente diz: "Pegue todos os objetos do banco"
    
    serializer_class = NeologismoSerializer # E diz: "Use esse tradutor aqui pra transformar em JSON"
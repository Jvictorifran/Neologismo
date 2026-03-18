from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import Neologismo
from .serializers import NeologismoSerializer

class NeologismoViewSet(viewsets.ModelViewSet):
    queryset = Neologismo.objects.all().order_by('-data_criacao') # Aqui a gente diz: "Pegue todos os objetos do banco"  
    serializer_class = NeologismoSerializer # E diz: "Use esse tradutor aqui pra transformar em JSON"

    def perform_create(self, serializer):
        serializer.save(autor=self.request.user)

    @action(detail=True, methods=['post'])
    def dar_like(self, request, pk=None):
        neologismo = self.get_object()
        user = request.user

        with transaction.atomic():
            # Se ele já deu DESLIKE, remove o deslike antes
            if neologismo.deslikes.filter(id=user.id).exists():
                neologismo.deslikes.remove(user)

            # dois cliques para remover
            if neologismo.likes.filter(id=user.id).exists():
                neologismo.likes.remove(user)
                msg = "Like removido"
            else:
                # Se não tinha like, adiciona agora
                neologismo.likes.add(user)
                msg = "Like adicionado"
            
        return Response({
            'status': msg,
            'likes': neologismo.total_likes, # Pega a contagem do model
            'deslikes': neologismo.total_deslikes
        })

    @action(detail=True, methods=['post'])
    def dar_deslike(self, request, pk=None):
        neologismo = self.get_object()
        user = request.user

        with transaction.atomic():
            # Se o usuário já deu LIKE, remove o like 
            if neologismo.likes.filter(id=user.id).exists():
                neologismo.likes.remove(user)

            if neologismo.deslikes.filter(id=user.id).exists():
                # Se ele já tinha dado deslike, ele está "desmarcando"
                neologismo.deslikes.remove(user)
                status_msg = "Deslike removido"
            else:
                # Se não tinha marca
                neologismo.deslikes.add(user)
                status_msg = "Deslike adicionado"
            
        return Response({
            'status': status_msg,
            'total_likes': neologismo.total_likes(),
            'total_deslikes': neologismo.total_deslikes()
        })
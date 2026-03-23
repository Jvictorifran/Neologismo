from rest_framework import serializers
from .models import Neologismo

class NeologismoSerializer(serializers.ModelSerializer):
    # Campos extras para facilitar a vida do Frontend
    autor_nome = serializers.ReadOnlyField(source='autor.username')
    total_likes = serializers.SerializerMethodField()
    total_deslikes = serializers.SerializerMethodField()

    class Meta:
        model = Neologismo
        fields = [
            'id', 'titulo', 'pronuncia', 'classe_gramatical', 
            'definicao', 'contexto_uso', 'tags', 'status', 
            'data_criacao', 'autor', 'autor_nome',
            'likes', 'deslikes', 'total_likes', 'total_deslikes'
        ]
        # 'likes' e 'deslikes' retornam IDs por padrão. 
        # 'total_likes' retornará apenas o número.

    def get_total_likes(self, obj):
        return obj.likes.count()

    def get_total_deslikes(self, obj):
        return obj.deslikes.count()
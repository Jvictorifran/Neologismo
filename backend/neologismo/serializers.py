from rest_framework import serializers
from .models import Neologismo

class NeologismoSerializer(serializers.ModelSerializer):
    total_likes = serializers.IntegerField(read_only=True)
    total_deslikes = serializers.IntegerField(read_only=True)

    class Meta:
        model = Neologismo
        fields = [
            'id', 'termo', 'significado', 'exemplo_de_uso', 
            'aprovado', 'data_criacao', 'autor', 
            'total_likes', 'total_deslikes'
        ]

        read_only_fields = ['id', 'autor', 'data_criacao']
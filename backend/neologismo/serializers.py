from rest_framework import serializers
from .models import Neologismo

class NeologismoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Neologismo
        fields = '__all__'

        read_only_fields = ['id', 'autor', 'data_criacao']
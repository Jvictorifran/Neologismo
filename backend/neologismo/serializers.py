from rest_framework import serializers
from .models import Neologismo

class NeologismoSerializer(serializers.Serializer):
    class meta:
        model = Neologismo
        fields = '__all__'
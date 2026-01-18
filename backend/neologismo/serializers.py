from rest_framework import serializers
from .models import Neologismo

class NeologismoSerializers(serializers.Serializer):
    class meta:
        model = Neologismo
        fields = '__all__'
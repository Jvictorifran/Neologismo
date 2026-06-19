from django.contrib.auth import get_user_model
from rest_framework import serializers

Usuario = get_user_model()


class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password', 'is_admin']
        read_only_fields = ['is_admin']

    def create(self, validated_data):
        return Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'is_admin']

from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import authenticate

from .serializers import RegistroSerializer, UsuarioSerializer
from django.contrib.auth import get_user_model

Usuario = get_user_model()


class RegistroView(generics.CreateAPIView):
    """Cria um Usuario e já devolve o token de autenticação."""
    serializer_class = RegistroSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'is_admin': user.is_admin,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'is_admin': user.is_admin,
            })
        return Response(
            {'detail': 'Usuário ou senha inválidos'},
            status=status.HTTP_401_UNAUTHORIZED,
        )


class MeView(generics.RetrieveAPIView):
    serializer_class = UsuarioSerializer

    def get_object(self):
        return self.request.user

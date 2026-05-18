from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from .serializers import UserSerializer


@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user:
        token, created = Token.objects.get_or_create(user=user)
        profile, _ = UserProfile.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email or '',
        })
    return Response({'error': 'Kullanıcı adı veya şifre hatalı!'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        height = request.data.get('height')
        weight = request.data.get('weight')
        workouts = request.data.get('workouts')
        streak = request.data.get('streak')
        if height is not None:
            profile.height = int(height)
        if weight is not None:
            profile.weight = float(weight)
        if workouts is not None:
            profile.workouts = int(workouts)
        if streak is not None:
            profile.streak = int(streak)
        profile.save()
    return Response({
        'height': profile.height,
        'weight': profile.weight,
        'workouts': profile.workouts,
        'streak': profile.streak,
    })

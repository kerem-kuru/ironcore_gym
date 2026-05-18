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
            'is_staff': user.is_staff,
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
            'is_staff': user.is_staff,
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

from django.db.models import Sum
from gym.models import Order, UserMembership
from django.contrib.auth.models import User
from rest_framework.permissions import IsAdminUser

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_stats_view(request):
    total_users = User.objects.count()
    active_memberships = UserMembership.objects.count()
    total_revenue = Order.objects.aggregate(total=Sum('total'))['total'] or 0
    total_orders = Order.objects.count()

    recent_orders = Order.objects.select_related('user').order_by('-created_at')[:5]
    recent_orders_data = [{
        'id': order.id,
        'username': order.user.username,
        'total': order.total,
        'date': order.created_at.strftime("%Y-%m-%d %H:%M")
    } for order in recent_orders]

    return Response({
        'total_users': total_users,
        'active_memberships': active_memberships,
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'recent_orders': recent_orders_data
    })

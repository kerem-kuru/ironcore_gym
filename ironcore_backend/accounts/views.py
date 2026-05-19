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
from gym.models import Order, UserMembership, ContactMessage, Product
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

    unread_messages_count = ContactMessage.objects.filter(is_read=False).count()
    total_products = Product.objects.filter(is_available=True).count()
    
    recent_messages = ContactMessage.objects.order_by('-created_at')[:5]
    recent_messages_data = [{
        'id': msg.id,
        'name': msg.name,
        'email': msg.email,
        'message': msg.message[:80] + '...' if len(msg.message) > 80 else msg.message,
        'date': msg.created_at.strftime("%Y-%m-%d %H:%M"),
        'is_read': msg.is_read
    } for msg in recent_messages]

    recent_memberships = UserMembership.objects.select_related('user', 'plan').order_by('-created_at')[:5]
    recent_memberships_data = [{
        'id': m.id,
        'username': m.user.username,
        'plan_name': m.plan.name,
        'start_date': m.start_date.strftime("%Y-%m-%d"),
        'end_date': m.end_date.strftime("%Y-%m-%d")
    } for m in recent_memberships]

    top_products = Product.objects.annotate(total_sold=Sum('orderitem__quantity')).order_by('-total_sold')[:5]
    top_products_data = [{
        'id': p.id,
        'name': p.name,
        'category': p.category,
        'total_sold': p.total_sold or 0,
        'price': p.price
    } for p in top_products if p.total_sold]

    return Response({
        'total_users': total_users,
        'active_memberships': active_memberships,
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'unread_messages': unread_messages_count,
        'total_products': total_products,
        'recent_orders': recent_orders_data,
        'recent_messages': recent_messages_data,
        'recent_memberships': recent_memberships_data,
        'top_products': top_products_data
    })

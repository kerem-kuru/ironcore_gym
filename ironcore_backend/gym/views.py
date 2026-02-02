from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import MembershipPlan, UserMembership, Product, Exercise, ContactMessage, Order, OrderItem
from .serializers import (
    MembershipPlanSerializer,
    UserMembershipSerializer,
    ProductSerializer,
    ExerciseSerializer,
    ContactMessageSerializer,
    OrderSerializer,
)


# --- Üyelik planları (herkes) ---
@api_view(['GET'])
def get_membership_plans(request):
    plans = MembershipPlan.objects.filter(is_active=True)
    serializer = MembershipPlanSerializer(plans, many=True)
    return Response(serializer.data)


# --- Kullanıcı üyeliği (giriş yapmış) ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_membership(request):
    serializer = UserMembershipSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_memberships(request):
    memberships = UserMembership.objects.filter(user=request.user).order_by('-created_at')
    serializer = UserMembershipSerializer(memberships, many=True)
    return Response(serializer.data)


# --- Ürünler (mağaza) ---
@api_view(['GET'])
def get_products(request):
    products = Product.objects.filter(is_available=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# --- Egzersizler (Muscle Wiki) ---
@api_view(['GET'])
def get_exercises(request):
    muscle = request.query_params.get('muscle_group', None)
    exercises = Exercise.objects.all()
    if muscle:
        exercises = exercises.filter(muscle_group=muscle)
    serializer = ExerciseSerializer(exercises, many=True)
    return Response(serializer.data)


# --- İletişim formu ---
@api_view(['POST'])
def create_contact_message(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Mesajınız alındı.'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- Sipariş (mağaza) ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    # Body: { "items": [ { "product_id": 1, "quantity": 2 }, ... ] }
    items_data = request.data.get('items', [])
    if not items_data:
        return Response({'error': 'Sepet boş.'}, status=status.HTTP_400_BAD_REQUEST)
    order_total = Decimal('0')
    order = Order.objects.create(user=request.user, total=0)
    for item in items_data:
        product_id = item.get('product_id')
        quantity = int(item.get('quantity', 1))
        if quantity < 1:
            continue
        try:
            product = Product.objects.get(pk=product_id, is_available=True)
        except Product.DoesNotExist:
            order.delete()
            return Response({'error': f'Ürün bulunamadı: {product_id}'}, status=status.HTTP_400_BAD_REQUEST)
        price = product.price * quantity
        order_total += price
        OrderItem.objects.create(order=order, product=product, quantity=quantity, price=product.price)
    order.total = order_total
    order.save()
    serializer = OrderSerializer(order, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True, context={'request': request})
    return Response(serializer.data)

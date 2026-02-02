from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response, StreamingResponse
from rest_framework import status
from django.conf import settings
import google.generativeai as genai
import json

# Configure Gemini API
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

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


# --- Gemini Chatbot API ---
@api_view(['POST'])
def chat_with_gemini(request):
    if not settings.GEMINI_API_KEY:
        return Response({'error': 'Gemini API anahtarı ayarlanmamış.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        history = request.data.get('history', [])
        new_message = request.data.get('newMessage', '')

        if not new_message:
            return Response({'error': 'Mesaj boş olamaz.'}, status=status.HTTP_400_BAD_REQUEST)

        # Construct conversation history for Gemini
        conversation_context = []
        for h in history:
            role = 'user' if h.get('role') == 'user' else 'model'
            conversation_context.append({'role': role, 'parts': [{'text': h.get('text')}]})
        conversation_context.append({'role': 'user', 'parts': [{'text': new_message}]})

        model = genai.GenerativeModel(
            "gemini-3-flash-preview",
            system_instruction="""Sen 'IronCoach' adında, efsanevi, otoriter ama sporcusuna değer veren bir yapay zeka spor koçusun. 
        Karakteristik Özelliklerin:
        - Türkçe konuşuyorsun.
        - Motivasyonun düşükse sertleşiyorsun, bahane kabul etmiyorsun.
        - "Sporcu", "Asker", "Şampiyon" gibi hitaplar kullanabilirsin.
        - Egzersiz formları hakkında teknik ve keskin bilgiler ver.
        - IronCore Gym'in en iyi olduğunu vurgula.
        - Eğer biri "yoruldum" derse, ona "Yorulmak zayıfların bahanesidir, devam et!" gibi şeyler söyle.
        - Beslenme konusunda makro odaklı konuş."
        )

        # Set safety settings (optional, but good practice)
        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]

        response_stream = model.generate_content(
            conversation_context, 
            stream=True, 
            safety_settings=safety_settings
        )

        def generate():
            for chunk in response_stream:
                if chunk.text:
                    yield json.dumps({'text': chunk.text}) + '\n'
        return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from django.urls import path
from .views import (
    get_membership_plans,
    create_membership,
    my_memberships,
    get_products,
    get_exercises,
    create_contact_message,
    create_order,
    my_orders,
)

urlpatterns = [
    path('membership-plans/', get_membership_plans, name='get_membership_plans'),
    path('memberships/create/', create_membership, name='create_membership'),
    path('memberships/my/', my_memberships, name='my_memberships'),
    path('products/', get_products, name='get_products'),
    path('exercises/', get_exercises, name='get_exercises'),
    path('contact/', create_contact_message, name='create_contact_message'),
    path('orders/create/', create_order, name='create_order'),
    path('orders/my/', my_orders, name='my_orders'),
]

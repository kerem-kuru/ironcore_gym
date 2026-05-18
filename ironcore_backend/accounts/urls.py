from django.urls import path
from .views import register_user, login_user, profile_view, admin_stats_view

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('profile/', profile_view, name='profile'),
    path('admin-stats/', admin_stats_view, name='admin_stats'),
]

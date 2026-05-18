from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import UserProfile
from gym.models import UserMembership, Order

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Kullanıcı Profili'

class UserMembershipInline(admin.TabularInline):
    model = UserMembership
    extra = 0
    verbose_name_plural = 'Üyelikler'

class OrderInline(admin.TabularInline):
    model = Order
    extra = 0
    verbose_name_plural = 'Siparişler'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline, UserMembershipInline, OrderInline)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')

admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'height', 'weight', 'workouts', 'streak')

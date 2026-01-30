from django.db import models
from django.contrib.auth.models import User


class MembershipPlan(models.Model):
    """Üyelik planı (Iron Starter, Gold Pro, Titanium Elite vb.)"""
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    period = models.CharField(max_length=50)  # Aylık, 3 Aylık, Yıllık
    description = models.TextField(blank=True)
    features = models.TextField(blank=True, help_text='Her satıra bir özellik')
    recommended = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class UserMembership(models.Model):
    """Kullanıcının seçtiği üyelik (rezervasyon benzeri)"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.ForeignKey(MembershipPlan, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.plan.name}"


class Product(models.Model):
    """Mağaza ürünü (protein, kreatin vb.)"""
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)  # Protein, Performans, Enerji vb.
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, help_text='Ürün resmi linki (Pillow gerekmez)')
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Exercise(models.Model):
    """Muscle Wiki egzersiz"""
    name = models.CharField(max_length=255)
    muscle_group = models.CharField(max_length=100)  # Göğüs, Bacak, Sırt vb.
    difficulty = models.CharField(max_length=50)  # Beginner, Intermediate, Advanced
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True, help_text='Egzersiz resmi linki')

    def __str__(self):
        return f"{self.name} ({self.muscle_group})"


class ContactMessage(models.Model):
    """İletişim formu mesajı"""
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.created_at.date()}"


class Order(models.Model):
    """Kullanıcı siparişi (mağaza)"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"#{self.id} - {self.user.username}"


class OrderItem(models.Model):
    """Sipariş kalemi"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

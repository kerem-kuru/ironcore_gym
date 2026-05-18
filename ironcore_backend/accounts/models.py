from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    height = models.IntegerField(null=True, blank=True, help_text="Boy (cm)")
    weight = models.DecimalField(max_digits=5, decimal_places=1, null=True, blank=True, help_text="Kilo (kg)")
    workouts = models.IntegerField(default=0, help_text="Antrenman Sayısı")
    streak = models.IntegerField(default=0, help_text="Günlük Streak")

    def __str__(self):
        return f"{self.user.username} Profili"

    class Meta:
        verbose_name = 'Kullanıcı Profili'
        verbose_name_plural = 'Kullanıcı Profilleri'

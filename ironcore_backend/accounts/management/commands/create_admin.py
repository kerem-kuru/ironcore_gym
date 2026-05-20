import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Çevre değişkenlerinden güvenli şekilde otomatik admin hesabı oluşturur'

    def handle(self, *args, **options):
        User = get_user_model()
        
        # Sadece çevre değişkenlerinden çekeceğiz, koda hiçbir bilgi yazılmayacak
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        # Eksik bir değişken varsa script güvenli bir şekilde duracak
        if not username or not email or not password:
            self.stdout.write(self.style.ERROR('HATA: DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL veya DJANGO_SUPERUSER_PASSWORD çevre değişkenleri eksik!'))
            return

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Admin hesabı ({username}) güvenli şekilde oluşturuldu!'))
        else:
            self.stdout.write(self.style.WARNING('Admin hesabı zaten mevcut.'))

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from gym.models import MembershipPlan, Product, Exercise

MEMBERSHIP_PLANS = [
  {
    "name": "Iron Starter",
    "price": 399,
    "period": "Aylık",
    "features": "Tüm şubelere erişim\nStandart soyunma dolabı\nÜcretsiz Wi-Fi\n08:00 - 22:00 Erişim",
  },
  {
    "name": "Gold Pro",
    "price": 899,
    "period": "3 Aylık",
    "recommended": True,
    "features": "7/24 Erişim\nÖzel antrenör (Aylık 2 seans)\nSauna & Buhar odası\nSupplement indirimi (%10)",
  },
  {
    "name": "Titanium Elite",
    "price": 2999,
    "period": "Yıllık",
    "features": "Sınırsız 7/24 Erişim\nSınırsız Özel Ders\nTüm spa imkanları\nÖzel park yeri\nMisafir getirme hakkı",
  },
]

PRODUCTS = [
  {
    "name": "Whey Protein Isolate",
    "category": "Protein",
    "price": 850,
    "description": "Hızlı emilim sağlayan saf izole protein tozu. Kırmızı meyve aromalı.",
    "image_url": "/products/whey-protein-isolate.png",
  },
  {
    "name": "Creatine Monohydrate",
    "category": "Performans",
    "price": 450,
    "description": "%100 saf mikronize kreatin monohidrat. Aromasız.",
    "image_url": "/products/creatine-monohydrate.png",
  },
  {
    "name": "Pre-Workout Energy",
    "category": "Enerji",
    "price": 550,
    "description": "Antrenman öncesi patlayıcı güç ve odaklanma. Tiger's Blood aromalı.",
    "image_url": "/products/pre-workout-energy.png",
  },
  {
    "name": "BCAA 4:1:1",
    "category": "Amino Asit",
    "price": 380,
    "description": "Kas toparlanması için 4:1:1 oranında BCAA. Ananas aromalı.",
    "image_url": "/products/bcaa-411.png",
  },
  {
    "name": "Multi-Vitamin Pack",
    "category": "Vitamin",
    "price": 220,
    "description": "Sporcular için günlük all-in-one vitamin paketi. Cherry Bomb aromalı.",
    "image_url": "/products/multi-vitamin-pack.png",
  },
  {
    "name": "L-Carnitine Liquid",
    "category": "Yağ Yakıcı",
    "price": 400,
    "description": "1000 mg L-karnitin + B6. Metabolizmayı destekleyen sıvı form.",
    "image_url": "/products/l-carnitine-liquid.png",
  },
  {
    "name": "Multivitamin Gummies",
    "category": "Vitamin",
    "price": 280,
    "description": "Probiyotik destekli çoklu vitamin jelibon. Çilek aromalı, 60 adet.",
    "image_url": "/products/multivitamin-gummies.png",
  },
]

EXERCISES = [
  {
    "name": "Bench Press",
    "muscle_group": "Göğüs",
    "difficulty": "Intermediate",
    "description": "Göğüs kaslarını geliştiren temel bileşik egzersiz.",
    "image_url": "https://static.exercisedb.dev/media/EIeI8Vf.gif",
    "youtube_id": "rT7DgCr-3pg",
  },
  {
    "name": "Squat",
    "muscle_group": "Bacak",
    "difficulty": "Advanced",
    "description": "Tüm alt vücudu çalıştıran kralların egzersizi.",
    "image_url": "https://static.exercisedb.dev/media/iYzB0Cz.gif",
    "youtube_id": "ultWZbUMPL8",
  },
  {
    "name": "Deadlift",
    "muscle_group": "Sırt",
    "difficulty": "Advanced",
    "description": "Posterior chain (arka zincir) için en etkili hareket.",
    "image_url": "https://static.exercisedb.dev/media/ila4NZS.gif",
    "youtube_id": "op9kVnS8Xgw",
  },
  {
    "name": "Bicep Curl",
    "muscle_group": "Kol",
    "difficulty": "Beginner",
    "description": "Pazı kaslarını izole eden temel hareket.",
    "image_url": "https://static.exercisedb.dev/media/2NpxjC1.gif",
    "youtube_id": "ykJmrZ5v0Oo",
  },
  {
    "name": "Shoulder Press",
    "muscle_group": "Omuz",
    "difficulty": "Intermediate",
    "description": "Omuz başlarını hedefleyen pres hareketi.",
    "image_url": "https://static.exercisedb.dev/media/A6wtbuL.gif",
    "youtube_id": "qEwKCR5JCog",
  },
  {
    "name": "Plank",
    "muscle_group": "Karın",
    "difficulty": "Beginner",
    "description": "Core bölgesini güçlendiren statik duruş egzersizi.",
    "image_url": "https://static.exercisedb.dev/media/CosupLu.gif",
    "youtube_id": "pSHjTRCQxIw",
  },
  {
    "name": "Pull Up",
    "muscle_group": "Sırt",
    "difficulty": "Advanced",
    "description": "Vücut ağırlığı ile sırt kanat kaslarını geliştiren hareket.",
    "image_url": "https://static.exercisedb.dev/media/0V2YQjW.gif",
    "youtube_id": "eGo4IYlbE5g",
  },
  {
    "name": "Tricep Dip",
    "muscle_group": "Kol",
    "difficulty": "Intermediate",
    "description": "Arka kol ve göğüs altını hedefleyen vücut ağırlığı hareketi.",
    "image_url": "https://static.exercisedb.dev/media/9RT8oQW.gif",
    "youtube_id": "6kALZikZKMw",
  },
  {
    "name": "Lateral Raise",
    "muscle_group": "Omuz",
    "difficulty": "Beginner",
    "description": "Omuzları genişletmek için yan omuz başı hareketi.",
    "image_url": "https://static.exercisedb.dev/media/DsgkuIt.gif",
    "youtube_id": "3VcKaXpzqRo",
  },
  {
    "name": "Leg Press",
    "muscle_group": "Bacak",
    "difficulty": "Beginner",
    "description": "Bacak kaslarını güvenli bir şekilde çalıştırmak için makine egzersizi.",
    "image_url": "https://static.exercisedb.dev/media/10Z2DXU.gif",
    "youtube_id": "IZxyjW7MPJQ",
  },
  {
    "name": "Crunch",
    "muscle_group": "Karın",
    "difficulty": "Beginner",
    "description": "Üst karın kaslarını hedefleyen temel mekik hareketi.",
    "image_url": "https://static.exercisedb.dev/media/TFqbd8t.gif",
    "youtube_id": "Xyd_fa5mEA0",
  },
  {
    "name": "Incline Bench Press",
    "muscle_group": "Göğüs",
    "difficulty": "Intermediate",
    "description": "Üst göğüs kaslarını hedefleyen eğimli sehpa presi.",
    "image_url": "https://static.exercisedb.dev/media/3TZduzM.gif",
    "youtube_id": "S_qOqQzXBQM",
  },
]

print("Populating Membership Plans...")
for plan in MEMBERSHIP_PLANS:
    MembershipPlan.objects.get_or_create(name=plan['name'], defaults=plan)

print("Populating Products...")
for product in PRODUCTS:
    Product.objects.update_or_create(name=product['name'], defaults=product)

print("Populating Exercises...")
for exercise in EXERCISES:
    Exercise.objects.update_or_create(name=exercise['name'], defaults=exercise)

print("Done!")

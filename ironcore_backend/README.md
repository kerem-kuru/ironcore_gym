# IronCore Backend

IronCore spor salonu sitesinin Django REST API backend'i. **elitstay_backend** yapısı temel alınarak kurulmuştur.

## Gereksinimler

- Python 3.10+
- pip / venv

## Kurulum

```bash
cd ironcore_backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # İsteğe bağlı: admin girişi
python manage.py runserver
```

API: **http://127.0.0.1:8000/**

## API Özeti

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/auth/register/` | POST | Kayıt |
| `/api/auth/login/` | POST | Giriş (token döner) |
| `/api/membership-plans/` | GET | Üyelik planları listesi |
| `/api/memberships/create/` | POST | Üyelik oluştur (auth) |
| `/api/memberships/my/` | GET | Kullanıcının üyelikleri (auth) |
| `/api/products/` | GET | Mağaza ürünleri |
| `/api/exercises/` | GET | Egzersizler (Muscle Wiki), ?muscle_group= ile filtre |
| `/api/contact/` | POST | İletişim formu |
| `/api/orders/create/` | POST | Sipariş oluştur (auth, body: `{ "items": [ { "product_id": 1, "quantity": 2 } ] }`) |
| `/api/orders/my/` | GET | Siparişlerim (auth) |

## Uygulama Yapısı (elitstay_backend ile benzer)

- **core**: Django ayarları, ana urls, CORS, DRF, SQLite, media
- **accounts**: Register / Login (Token auth)
- **gym**: Üyelik planları, kullanıcı üyelikleri, ürünler, egzersizler, iletişim mesajları

Frontend (Vite/React) genelde `http://localhost:5173` üzerinde çalışır; CORS bu origin için açıktır.

import { API_BASE_URL, MEMBERSHIP_PLANS, PRODUCTS, EXERCISES } from '../constants';

const BASE = API_BASE_URL.replace(/\/api\/?$/, '');

/** localStorage'dan token al (giriş yapmış kullanıcı) */
function getToken(): string | null {
  try {
    const raw = localStorage.getItem('ironcore_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.token ?? null;
  } catch {
    return null;
  }
}

/** Auth header ile fetch (giriş gerektiren istekler) */
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Token ${token}`;
  return fetch(url, { ...options, headers });
}

/** API'den veri alır, hata olursa fallback döner */
async function fetchOrFallback<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const data = await res.json();
    return data as T;
  } catch {
    return fallback;
  }
}

/** Backend plan: features metin (satır satır). Frontend: features string[] */
function normalizePlan(p: Record<string, unknown>) {
  const features = typeof p.features === 'string'
    ? p.features.split('\n').map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(p.features) ? p.features : [];
  return {
    id: p.id,
    name: p.name,
    price: Number(p.price) || 0,
    period: p.period || '',
    recommended: Boolean(p.recommended),
    features,
  };
}

/** Backend product: image path veya image_url. Frontend: image (URL) */
function normalizeProduct(p: Record<string, unknown>) {
  const image = (p.image_url as string) || (p.image ? `${BASE}${p.image}` : '') || 'https://picsum.photos/seed/placeholder/400/400';
  return {
    id: p.id,
    name: p.name,
    category: p.category || '',
    price: Number(p.price) || 0,
    description: p.description || '',
    image,
  };
}

/** Backend exercise: muscle_group, image. Frontend: muscleGroup, image */
function normalizeExercise(e: Record<string, unknown>) {
  const image = (e.image_url as string) || (e.image ? `${BASE}${e.image}` : '') || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600';
  return {
    id: e.id,
    name: e.name,
    muscleGroup: e.muscle_group ?? e.muscleGroup ?? '',
    difficulty: e.difficulty || 'Beginner',
    description: e.description || '',
    image,
  };
}

export const api = {
  async getMembershipPlans() {
    const raw = await fetchOrFallback<Record<string, unknown>[]>(`${API_BASE_URL}/membership-plans/`, []);
    if (Array.isArray(raw) && raw.length > 0) return raw.map(normalizePlan);
    return MEMBERSHIP_PLANS;
  },

  async getProducts() {
    const raw = await fetchOrFallback<Record<string, unknown>[]>(`${API_BASE_URL}/products/`, []);
    if (Array.isArray(raw) && raw.length > 0) return raw.map(normalizeProduct);
    return PRODUCTS;
  },

  async getExercises(muscleGroup?: string | null) {
    const url = muscleGroup ? `${API_BASE_URL}/exercises/?muscle_group=${encodeURIComponent(muscleGroup)}` : `${API_BASE_URL}/exercises/`;
    const raw = await fetchOrFallback<Record<string, unknown>[]>(url, []);
    if (Array.isArray(raw) && raw.length > 0) return raw.map(normalizeExercise);
    return muscleGroup ? EXERCISES.filter((ex) => ex.muscleGroup === muscleGroup) : EXERCISES;
  },

  async submitContact(data: { name: string; email: string; message: string }) {
    const res = await fetch(`${API_BASE_URL}/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message || 'Mesaj gönderilemedi.');
    }
    return res.json();
  },

  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error || 'Giriş başarısız.');
    return data as { token: string; user_id: number; username: string; email?: string };
  },

  async register(username: string, email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { username?: string[] }).username?.[0] || (data as { email?: string[] }).email?.[0] || 'Kayıt başarısız.');
    return data as { token: string; user_id: number; username: string };
  },

  // --- Auth gerektiren istekler ---

  async getMyMemberships() {
    const res = await fetchWithAuth(`${API_BASE_URL}/memberships/my/`);
    if (!res.ok) throw new Error('Üyelikler yüklenemedi.');
    const data = await res.json();
    return data as Array<{ id: number; plan_name: string; price: string; start_date: string; end_date: string; created_at: string }>;
  },

  async createMembership(planId: number, startDate: string, endDate: string) {
    const res = await fetchWithAuth(`${API_BASE_URL}/memberships/create/`, {
      method: 'POST',
      body: JSON.stringify({ plan: planId, start_date: startDate, end_date: endDate }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { plan?: string[] }).plan?.[0] || 'Üyelik oluşturulamadı.');
    return data;
  },

  async getMyOrders() {
    const res = await fetchWithAuth(`${API_BASE_URL}/orders/my/`);
    if (!res.ok) throw new Error('Siparişler yüklenemedi.');
    const data = await res.json();
    return data as Array<{ id: number; total: string; created_at: string; items: Array<{ product_name: string; product_image: string | null; quantity: number; price: string }> }>;
  },

  async createOrder(items: Array<{ product_id: number; quantity: number }>) {
    const res = await fetchWithAuth(`${API_BASE_URL}/orders/create/`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error || 'Sipariş oluşturulamadı.');
    return data;
  },
};

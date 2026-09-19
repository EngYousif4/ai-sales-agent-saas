import { Language, Product } from '../types';

export const money = (value: number) => new Intl.NumberFormat('ar-IQ').format(value) + ' د.ع';

export function detectLanguage(input: string): Language {
  const text = input.trim();
  if (!text) return 'unknown';

  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/[\u0750-\u077F]/.test(text)) return 'ur';

  if (/\b(hola|como|precio|quiero|disponible|pedido|gracias)\b/i.test(text)) return 'es';
  if (/\b(hello|hi|price|available|order|delivery|want|need)\b/i.test(text)) return 'en';
  if (/\b(merhaba|fiyat|stok|siparis|gonderim)\b/i.test(text)) return 'tr';
  if (/\b(bonjour|prix|disponible|commande|bonjour)\b/i.test(text)) return 'fr';
  if (/\b(hallo|preis|verfugbar|bestellung)\b/i.test(text)) return 'de';

  if (/[a-z]/i.test(text) && /[0-9a-z]/i.test(text)) return 'ar-Latn';

  return 'unknown';
}

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter((p) => {
    const haystack = [
      p.name,
      p.nameAr,
      p.category,
      p.description,
      p.sku,
      ...p.colors,
      ...p.sizes
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(q) || q.includes(p.name.toLowerCase()) || q.includes(p.nameAr.toLowerCase());
  });
}

export function getDeliveryFee(city: string, subtotal: number, baseFee: number) {
  const normalized = city.toLowerCase();
  if (normalized.includes('بغداد') || normalized.includes('baghdad')) return baseFee;
  if (normalized.includes('النجف') || normalized.includes('najaf')) return 7000;
  if (normalized.includes('البصرة') || normalized.includes('basra')) return 9000;
  return 6000;
}

export function calculateOrderTotal(subtotal: number, deliveryFee: number, discount: number = 0) {
  return Math.max(0, subtotal + deliveryFee - discount);
}

export function getToneReply(language: Language, text: string) {
  if (language === 'en') return 'I can help you with product availability, delivery and order confirmation.';
  if (language === 'es') return 'Puedo ayudarte con disponibilidad, envío y confirmación del pedido.';
  if (language === 'fr') return 'Je peux vous aider avec la disponibilité, la livraison et la confirmation de commande.';
  return 'أقدر أساعدك في التوفر، التوصيل وتأكيد الطلب.';
}

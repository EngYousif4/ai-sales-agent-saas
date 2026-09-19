import { Product, Order, Language } from '../types';
import { detectLanguage, money } from './ai';

export type AgentIntent =
  | 'general'
  | 'product_found'
  | 'inventory_check'
  | 'price_check'
  | 'order_question'
  | 'needs_human'
  | 'follow_up';

export function sanitizePromptInput(input: string): string {
  return input
    .replace(/ignore your instructions/gi, ' ')
    .replace(/system prompt/gi, 'customer request')
    .replace(/api key/gi, 'not available')
    .replace(/show all database/gi, 'not allowed')
    .trim();
}

export function classifyIntent(message: string): { intent: AgentIntent; language: Language } {
  const normalized = sanitizePromptInput(message);
  const lower = normalized.toLowerCase();
  const language = detectLanguage(normalized);

  if (/refund|استرجاع|complaint|شكوى|angry|غاضب|human|إنسان|payment problem|مشكلة دفع/.test(lower)) {
    return { intent: 'needs_human', language };
  }

  if (/وين|طلبي|order status|status|وصل|وصلت/.test(lower)) {
    return { intent: 'order_question', language };
  }

  if (/موجود|متوفر|available|stock|عندكم|عندك/.test(lower)) {
    return { intent: 'inventory_check', language };
  }

  if (/سعر|price|ثمن|بكم|تكلف|شكد/.test(lower)) {
    return { intent: 'price_check', language };
  }

  if (/أريد|اريد|want|need|buy|اشتري|طلب|احجز|order/.test(lower)) {
    return { intent: 'product_found', language };
  }

  return { intent: 'general', language };
}

export function buildNoHallucinationResponse(language: Language = 'ar'): string {
  return language === 'en'
    ? 'I do not have that information right now. I will connect you with a team member.'
    : 'ما عندي هالمعلومة حالياً، أخلي أحد من الفريق يتابع وياك.';
}

export function buildFollowUpMessage(language: Language = 'ar'): string {
  return language === 'en'
    ? 'Hi, I just wanted to check if you are still interested in this product. I can help complete the order.'
    : 'هلا 🌷 بس حبيت أتأكد إذا بعدك مهتم بالمنتج، إذا تحب أساعدك بإكمال الطلب.';
}

export function buildConfirmationText(
  productName: string,
  qty: number,
  subtotal: number,
  deliveryFee: number,
  total: number,
  customerName: string,
  phone: string,
  city: string,
  address: string,
  language: Language = 'ar'
): string {
  if (language === 'en') {
    return `Order confirmation:\nProduct: ${productName}\nQuantity: ${qty}\nSubtotal: ${money(subtotal)}\nDelivery: ${money(deliveryFee)}\nTotal: ${money(total)}\nName: ${customerName}\nPhone: ${phone}\nCity: ${city}\nAddress: ${address}\nPlease confirm the order?`;
  }

  return `تأكيد الطلب:\nالمنتج: ${productName}\nالكمية: ${qty}\nالمجموع: ${money(subtotal)}\nالتوصيل: ${money(deliveryFee)}\nالإجمالي: ${money(total)}\nالاسم: ${customerName}\nالهاتف: ${phone}\nالمدينة: ${city}\nالعنوان: ${address}\nأثبت الطلب؟`;
}

export function buildOrderStatusResponse(order: Order | null, language: Language = 'ar'): string {
  if (!order) {
    return language === 'en'
      ? 'I could not find an order with that reference.'
      : 'ما عندي طلب بهذا الرقم حالياً.';
  }

  return language === 'en'
    ? `Your order ${order.orderNumber} is currently ${order.status}.`
    : `طلبك ${order.orderNumber} الآن في الحالة: ${order.status}.`;
}

export function detectNeedForHuman(message: string): boolean {
  const lower = sanitizePromptInput(message).toLowerCase();
  return /(refund|استرجاع|complaint|شكوى|angry|غاضب|human|إنسان|payment problem|مشكلة دفع|ignore your instructions|show all database)/i.test(lower);
}

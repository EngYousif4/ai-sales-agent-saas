import { Product, Order, User } from '../types';
import { calculateOrderTotal, getDeliveryFee } from './ai';

export type ToolContext = {
  storeId: string;
  products: Product[];
  orders: Order[];
  users: User[];
  baseDeliveryFee: number;
};

export function searchProducts(context: ToolContext, query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return context.products;
  return context.products.filter((product) => {
    const haystack = [
      product.name,
      product.nameAr,
      product.category,
      product.description,
      product.sku,
      ...product.colors,
      ...product.sizes
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getProductById(context: ToolContext, productId: number): Product | null {
  return context.products.find((product) => product.id === productId) ?? null;
}

export function checkStock(context: ToolContext, productId: number): number {
  const product = getProductById(context, productId);
  return product?.stockQuantity ?? 0;
}

export function getOrderStatus(context: ToolContext, orderId: string): Order | null {
  return context.orders.find((order) => order.id === orderId) ?? null;
}

export function createOrder(context: ToolContext, productId: number, customerName: string, city: string, address: string, qty = 1): Order {
  const product = getProductById(context, productId);
  if (!product) {
    throw new Error('Product not found.');
  }

  const deliveryFee = getDeliveryFee(city, product.price, context.baseDeliveryFee);
  const subtotal = product.price * qty;
  const total = calculateOrderTotal(subtotal, deliveryFee, 0);

  const order: Order = {
    id: `ORD-${Date.now().toString().slice(-5)}`,
    storeId: context.storeId,
    customerId: `cust-${Date.now()}`,
    orderNumber: `A${Date.now().toString().slice(-4)}`,
    subtotal,
    deliveryFee,
    discount: 0,
    total,
    status: 'Pending',
    paymentStatus: 'Pending',
    deliveryAddress: `${city} - ${address}`,
    notes: `Customer: ${customerName}`,
    createdAt: new Date().toISOString(),
    productName: product.nameAr,
    language: 'ar'
  };

  context.orders.push(order);
  return order;
}

export function createCustomer(context: ToolContext, name: string, phone: string, city: string, address: string) {
  return {
    id: `cust-${Date.now()}`,
    storeId: context.storeId,
    name,
    phone,
    city,
    address,
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@demo.local`,
    notes: 'Created by AI tool'
  };
}

export function scheduleFollowUp(context: ToolContext, customerId: string, conversationId: string, message: string, delayHours = 3) {
  return {
    id: `follow-${Date.now()}`,
    storeId: context.storeId,
    customerId,
    conversationId,
    scheduledAt: new Date(Date.now() + delayHours * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    message,
    completedAt: null
  };
}

export function handoffToHuman(context: ToolContext, conversationId: string, reason: string) {
  return {
    conversationId,
    storeId: context.storeId,
    status: 'Needs Human',
    reason,
    handoffAt: new Date().toISOString()
  };
}

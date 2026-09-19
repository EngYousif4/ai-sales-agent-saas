export type Role = 'owner' | 'manager' | 'support' | 'agent' | 'customer';
export type Language = 'ar' | 'en' | 'ar-Latn' | 'es' | 'fr' | 'tr' | 'de' | 'hi' | 'ur' | 'unknown';

export interface Store {
  id: string;
  name: string;
  description: string;
  currency: string;
  timezone: string;
  defaultDeliveryFee: number;
  citiesServed: string[];
  businessHours: string;
  contactPhone: string;
}

export interface Product {
  id: number;
  storeId: string;
  name: string;
  nameAr: string;
  description: string;
  category: string;
  price: number;
  salePrice: number;
  stockQuantity: number;
  sku: string;
  images: string[];
  colors: string[];
  sizes: string[];
  active: boolean;
}

export interface Customer {
  id: string;
  storeId: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
}

export interface Order {
  id: string;
  storeId: string;
  customerId: string;
  orderNumber: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Unpaid' | 'Paid' | 'Pending';
  deliveryAddress: string;
  notes: string;
  createdAt: string;
  productName: string;
  language: Language;
}

export interface Conversation {
  id: string;
  storeId: string;
  customerId: string;
  channel: 'Demo Chat' | 'Website Chat' | 'WhatsApp' | 'Instagram';
  status: 'New' | 'Waiting' | 'Interested' | 'Ordered' | 'Needs Human' | 'Closed';
  assignedTo: 'AI' | 'Human';
  lastMessage: string;
  customerIntent: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  storeId: string;
}

export interface AiSettings {
  storeId: string;
  enabled: boolean;
  agentName: string;
  tone: 'Friendly' | 'Professional' | 'Casual';
  language: 'Iraqi Arabic' | 'Arabic' | 'English';
  businessRules: string[];
  escalationEnabled: boolean;
  followUpEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent';
  text: string;
  language: Language;
  time: string;
}

import { AiSettings, Customer, Order, Product, Store, User, Conversation } from '../types';

export const demoStore: Store = {
  id: 'store-demo-01',
  name: 'Demo Fashion Store',
  description: 'متجر تجريبي للملابس والأكسسوارات',
  currency: 'IQD',
  timezone: 'Asia/Baghdad',
  defaultDeliveryFee: 5000,
  citiesServed: ['بغداد', 'البصرة', 'النجف', 'اربيل', 'كربلاء'],
  businessHours: 'من 9:00 صباحاً حتى 9:00 مساءً',
  contactPhone: '+964 770 000 0000'
};

export const demoProducts: Product[] = [
  {
    id: 1,
    storeId: 'store-demo-01',
    name: 'Black Hoodie',
    nameAr: 'هودي أسود',
    description: 'هودي مريح عالي الجودة',
    category: 'clothes',
    price: 45000,
    salePrice: 42000,
    stockQuantity: 8,
    sku: 'HOOD-BLK-01',
    images: ['🧥'],
    colors: ['black', 'أسود'],
    sizes: ['S', 'M', 'L', 'XL'],
    active: true
  },
  {
    id: 2,
    storeId: 'store-demo-01',
    name: 'White T-Shirt',
    nameAr: 'تيشيرت أبيض',
    description: 'تيشيرت كاجوال أنيق',
    category: 'clothes',
    price: 18000,
    salePrice: 17000,
    stockQuantity: 15,
    sku: 'TSH-WHT-01',
    images: ['👕'],
    colors: ['white', 'أبيض'],
    sizes: ['S', 'M', 'L'],
    active: true
  },
  {
    id: 3,
    storeId: 'store-demo-01',
    name: 'Blue Jeans',
    nameAr: 'جينز أزرق',
    description: 'جينز واسع ومريح',
    category: 'clothes',
    price: 35000,
    salePrice: 33000,
    stockQuantity: 4,
    sku: 'JEANS-BLU-01',
    images: ['👖'],
    colors: ['blue', 'أزرق'],
    sizes: ['30', '32', '34', '36'],
    active: true
  },
  {
    id: 4,
    storeId: 'store-demo-01',
    name: 'Urban Sneakers',
    nameAr: 'سنيكرز رياضي',
    description: 'حذاء رياضي عصري',
    category: 'shoes',
    price: 60000,
    salePrice: 56000,
    stockQuantity: 6,
    sku: 'SNK-URB-01',
    images: ['👟'],
    colors: ['white', 'أبيض', 'black'],
    sizes: ['40', '41', '42', '43'],
    active: true
  },
  {
    id: 5,
    storeId: 'store-demo-01',
    name: 'Classic Cap',
    nameAr: 'كاب كلاسيك',
    description: 'كاب بسيط ومريح',
    category: 'accessories',
    price: 12000,
    salePrice: 11000,
    stockQuantity: 20,
    sku: 'CAP-CLS-01',
    images: ['🧢'],
    colors: ['black', 'أسود', 'white'],
    sizes: ['free'],
    active: true
  }
];

export const demoCustomers: Customer[] = [
  {
    id: 'cust-1',
    storeId: 'store-demo-01',
    name: 'Ahmed Ali',
    phone: '07701234567',
    email: 'ahmed@example.com',
    city: 'بغداد',
    address: 'المنصور',
    notes: 'زبون متكرر'
  },
  {
    id: 'cust-2',
    storeId: 'store-demo-01',
    name: 'Layla Hassan',
    phone: '07776543210',
    email: 'layla@example.com',
    city: 'النجف',
    address: 'حي السلام',
    notes: 'يفضل الألوان الفاتحة'
  }
];

export const demoOrders: Order[] = [
  {
    id: 'ORD-1001',
    storeId: 'store-demo-01',
    customerId: 'cust-1',
    orderNumber: 'A1001',
    subtotal: 45000,
    deliveryFee: 5000,
    discount: 0,
    total: 50000,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    deliveryAddress: 'بغداد - المنصور',
    notes: 'تسليم خلال 24 ساعة',
    createdAt: '2026-09-18T10:20:00Z',
    productName: 'هودي أسود',
    language: 'ar'
  },
  {
    id: 'ORD-1002',
    storeId: 'store-demo-01',
    customerId: 'cust-2',
    orderNumber: 'A1002',
    subtotal: 18000,
    deliveryFee: 5000,
    discount: 1000,
    total: 22000,
    status: 'Preparing',
    paymentStatus: 'Paid',
    deliveryAddress: 'النجف - حي السلام',
    notes: 'تفحص المنتج قبل شحنه',
    createdAt: '2026-09-19T08:40:00Z',
    productName: 'تيشيرت أبيض',
    language: 'en'
  }
];

export const demoConversations: Conversation[] = [
  {
    id: 'conv-1',
    storeId: 'store-demo-01',
    customerId: 'cust-1',
    channel: 'Demo Chat',
    status: 'Interested',
    assignedTo: 'AI',
    lastMessage: 'أريد هودي أسود',
    customerIntent: 'Buy product',
    createdAt: '2026-09-19T09:00:00Z'
  },
  {
    id: 'conv-2',
    storeId: 'store-demo-01',
    customerId: 'cust-2',
    channel: 'Website Chat',
    status: 'Waiting',
    assignedTo: 'Human',
    lastMessage: 'هل يوجد خصم؟',
    customerIntent: 'Question about discount',
    createdAt: '2026-09-19T11:20:00Z'
  }
];

export const demoUser: User = {
  id: 'user-demo-1',
  name: 'يوسف',
  email: 'demo@fashionstore.com',
  password: 'demo123',
  role: 'owner',
  storeId: 'store-demo-01'
};

export const demoAiSettings: AiSettings = {
  storeId: 'store-demo-01',
  enabled: true,
  agentName: 'Angel',
  tone: 'Friendly',
  language: 'Iraqi Arabic',
  businessRules: [
    'لا تعطي خصم أكثر من 5%.',
    'لا تعد الزبون بالتوصيل بنفس اليوم.',
    'إذا الزبون يسأل عن الدفع، اذكر طرق الدفع المتوفرة فقط.'
  ],
  escalationEnabled: true,
  followUpEnabled: true
};

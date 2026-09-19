import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Globe2,
  Language,
  LogIn,
  LogOut,
  MessageCircle,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  UserCircle2,
  Users
} from 'lucide-react';
import { demoAiSettings, demoConversations, demoCustomers, demoOrders, demoProducts, demoStore, demoUser } from './data';
import { calculateOrderTotal, detectLanguage, getDeliveryFee, money, searchProducts } from './lib/ai';
import { ChatMessage, Customer, Order, Product, User } from './types';

const STORAGE_KEY = 'sales-agent-demo-user';
const ORDER_KEY = 'sales-agent-demo-orders';
const PRODUCT_KEY = 'sales-agent-demo-products';

const defaultMessages: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'agent',
    text: 'هلا بيك 🌷 أنا Angel، موظف المبيعات الذكي. أقدر أساعدك في اختيار المنتج والتحقق من التوفر والتوصيل والتأكيد. جرّب: "أريد هودي أسود"',
    language: 'ar',
    time: 'الآن'
  }
];

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const raw = localStorage.getItem(PRODUCT_KEY);
    return raw ? JSON.parse(raw) : demoProducts;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const raw = localStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) : demoOrders;
  });

  useEffect(() => {
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
  }, [orders]);

  const login = (email: string, password: string) => {
    const match = demoUser.email === email && demoUser.password === password;
    if (!match) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const createOrderFromChat = (product: Product, city: string, customerName: string, phone: string, address: string) => {
    const deliveryFee = getDeliveryFee(city, product.price, demoStore.defaultDeliveryFee);
    const total = calculateOrderTotal(product.price, deliveryFee, 0);
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-5)}`,
      storeId: demoStore.id,
      customerId: 'cust-new',
      orderNumber: `A${Date.now().toString().slice(-5)}`,
      subtotal: product.price,
      deliveryFee,
      discount: 0,
      total,
      status: 'Pending',
      paymentStatus: 'Pending',
      deliveryAddress: `${city} - ${address}`,
      notes: `Client: ${customerName}`,
      createdAt: new Date().toISOString(),
      productName: product.nameAr,
      language: 'ar'
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage user={user} />} />
        <Route path="/features" element={<FeaturesPage user={user} />} />
        <Route path="/pricing" element={<PricingPage user={user} />} />
        <Route path="/login" element={<AuthPage mode="login" login={login} user={user} />} />
        <Route path="/register" element={<AuthPage mode="register" login={login} user={user} />} />
        <Route path="/demo" element={<DemoPage products={products} createOrder={createOrderFromChat} />} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/dashboard" element={<DashboardShell user={user} products={products} orders={orders} />} />
          <Route path="/dashboard/conversations" element={<ConversationsPage user={user} />} />
          <Route path="/dashboard/orders" element={<OrdersPage orders={orders} />} />
          <Route path="/dashboard/products" element={<ProductsPage products={products} setProducts={setProducts} />} />
          <Route path="/dashboard/customers" element={<CustomersPage />} />
          <Route path="/dashboard/ai" element={<AiPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ user }: { user: User | null }) {
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

function LandingPage({ user }: { user: User | null }) {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">AI</div>
          <div>
            <strong>مبيعاتي AI</strong>
            <small>AI Sales Employee</small>
          </div>
        </div>
        <nav className="nav">
          <Link to="/features">المميزات</Link>
          <Link to="/pricing">التسعير</Link>
          <Link to="/demo">Demo</Link>
          {user ? <Link to="/dashboard">لوحة التحكم</Link> : <Link to="/login">تسجيل الدخول</Link>}
        </nav>
      </header>

      <main className="landing">
        <section className="hero">
          <div className="hero-copy">
            <span className="pill">Your AI Sales Employee</span>
            <h1>يبيع، يجيب، ينشئ الطلبات، ويُتابع العملاء 24/7</h1>
            <p>
              موظف مبيعات ذكي يعمل على منتجاتك الحقيقية، يقرأ المخزون، يحسب التوصيل، يطلب المعلومات الضرورية،\
              ويشغل الطلبات بشكل آمن بدون اختلاق البيانات.
            </p>
            <div className="cta-row">
              <Link to="/demo" className="btn primary">جرّب العرض</Link>
              <Link to="/register" className="btn secondary">ابدأ الآن</Link>
            </div>
          </div>
          <div className="hero-card">
            <div className="mini-agent">
              <Bot size={30} />
              <div>
                <strong>Angel</strong>
                <small>AI Sales Agent</small>
              </div>
            </div>
            <div className="quick-list">
              <div><CheckCircle2 size={16} /> <span>بحث منتجات</span></div>
              <div><CheckCircle2 size={16} /> <span>تفعيل الطلب</span></div>
              <div><CheckCircle2 size={16} /> <span>متابعة العملاء</span></div>
              <div><CheckCircle2 size={16} /> <span>تحويل للإنسان</span></div>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard label="محادثات اليوم" value="128" icon={<MessageCircle size={18} />} />
          <StatCard label="الطلبات" value="31" icon={<ShoppingCart size={18} />} />
          <StatCard label="معدل التحويل" value="18.4%" icon={<BarChart3 size={18} />} />
          <StatCard label="دعم 24/7" value="Live" icon={<ShieldCheck size={18} />} />
        </section>
      </main>
    </div>
  );
}

function FeaturesPage({ user }: { user: User | null }) {
  return (
    <div className="page-shell inner-page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">AI</div>
          <div>
            <strong>المميزات</strong>
            <small>AI Sales Employee</small>
          </div>
        </div>
        <nav className="nav">
          <Link to="/">الرئيسية</Link>
          <Link to="/pricing">التسعير</Link>
          <Link to="/demo">Demo</Link>
          {user ? <Link to="/dashboard">لوحة التحكم</Link> : <Link to="/login">تسجيل الدخول</Link>}
        </nav>
      </header>

      <main className="content">
        <h2>كل ما يحتاجه متجرك للبيع عبر الرسائل</h2>
        <div className="feature-grid">
          <FeatureCard title="بحث منتجات ذكي" desc="يبحث داخل متجر العميل ويستخدم البيانات الحقيقية فقط." icon={<Package size={22} />} />
          <FeatureCard title="تقدير التوصيل" desc="يحسب تكلفة الشحن من إعدادات المتجر وليس من التقديرات العشوائية." icon={<CircleDollarSign size={22} />} />
          <FeatureCard title="إدارة الطلبات" desc="يجمع بيانات التوصيل قبل التأكيد ثم ينشئ الطلب بشكل آمن." icon={<ShoppingCart size={22} />} />
          <FeatureCard title="متابعة المبيعات" desc="يُدير follow-ups مع حدود مناسبة لمنع الرسائل المتكررة." icon={<Sparkles size={22} />} />
          <FeatureCard title="التعرف على اللغة" desc="يدعم العربية العراقية، العربيزي، الإنجليزية، وبعض اللغات العالمية." icon={<Language size={22} />} />
          <FeatureCard title="تحويل للإنسان" desc="عند الشكوى أو الاستفسار المعقد أو الطلب المباشر للإنسان، يتم تحويل المحادثة." icon={<Users size={22} />} />
        </div>
      </main>
    </div>
  );
}

function PricingPage({ user }: { user: User | null }) {
  return (
    <div className="page-shell inner-page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">AI</div>
          <div>
            <strong>التسعير</strong>
            <small>Simple plans</small>
          </div>
        </div>
        <nav className="nav">
          <Link to="/">الرئيسية</Link>
          <Link to="/features">المميزات</Link>
          <Link to="/demo">Demo</Link>
          {user ? <Link to="/dashboard">لوحة التحكم</Link> : <Link to="/login">تسجيل الدخول</Link>}
        </nav>
      </header>

      <main className="content pricing">
        <div className="price-card">
          <span className="pill">Starter</span>
          <h3>299 دولار / شهر</h3>
          <ul>
            <li>متجر واحد</li>
            <li>AI agent</li>
            <li>أدوات الطلبات</li>
            <li>متابعة العملاء</li>
          </ul>
          <Link to="/register" className="btn primary">ابدأ الآن</Link>
        </div>
        <div className="price-card featured">
          <span className="pill">Growth</span>
          <h3>799 دولار / شهر</h3>
          <ul>
            <li>متاجر متعددة</li>
            <li>لوحة تحكم متقدمة</li>
            <li>تقارير وأتمتة</li>
            <li>دعم فريق</li>
          </ul>
          <Link to="/register" className="btn primary">ابدأ الآن</Link>
        </div>
      </main>
    </div>
  );
}

function AuthPage({ mode, login, user }: { mode: 'login' | 'register'; login: (email: string, password: string) => boolean; user: User | null }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@fashionstore.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) {
      setError('بيانات الدخول غير صحيحة. استخدم demo@fashionstore.com / demo123');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="page-shell auth-page">
      <div className="auth-box">
        <div className="auth-header">
          <div className="brand-mark">AI</div>
          <h2>{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}</h2>
        </div>

        <form onSubmit={submit} className="auth-form">
          <label>
            البريد الإلكتروني
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="demo@fashionstore.com" />
          </label>
          <label>
            كلمة المرور
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="demo123" />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn primary full" type="submit">{mode === 'login' ? 'دخول' : 'إنشاء الحساب'}</button>
        </form>

        <div className="helper-row">
          <Link to="/">الرئيسية</Link>
          <Link to="/demo">Demo Chat</Link>
        </div>
      </div>
    </div>
  );
}

function DashboardShell({ user, products, orders }: { user: User | null; products: Product[]; orders: Order[] }) {
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const navItems = [
    { key: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { key: 'conversations', label: 'Conversations', icon: <MessageCircle size={18} /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
    { key: 'products', label: 'Products', icon: <Package size={18} /> },
    { key: 'customers', label: 'Customers', icon: <Users size={18} /> },
    { key: 'ai', label: 'AI Agent', icon: <Bot size={18} /> },
    { key: 'settings', label: 'Settings', icon: <Store size={18} /> }
  ];

  const renderPage = () => {
    switch (active) {
      case 'conversations':
        return <ConversationsPage user={user} />;
      case 'orders':
        return <OrdersPage orders={orders} />;
      case 'products':
        return <ProductsPage products={products} setProducts={() => {}} />;
      case 'customers':
        return <CustomersPage />;
      case 'ai':
        return <AiPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewPage orders={orders} products={products} />;
    }
  };

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand nav-brand">
          <div className="brand-mark">AI</div>
          <div>
            <strong>مبيعاتي AI</strong>
            <small>Demo Store</small>
          </div>
        </div>

        <div className="sidebar-nav">
          {navItems.map((item) => (
            <button key={item.key} className={active === item.key ? 'nav-item active' : 'nav-item'} onClick={() => setActive(item.key)}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-box">
            <UserCircle2 size={18} />
            <div>
              <strong>{user?.name}</strong>
              <small>{user?.role}</small>
            </div>
          </div>
          <button className="btn ghost" onClick={() => { localStorage.removeItem(STORAGE_KEY); window.location.href = '/'; }}>
            <LogOut size={16} /> خروج
          </button>
        </div>
      </aside>

      <main className="dashboard-main">{renderPage()}</main>
    </div>
  );
}

function OverviewPage({ orders, products }: { orders: Order[]; products: Product[] }) {
  return (
    <div className="page-panel">
      <div className="section-head">
        <div>
          <span className="mini-label">Overview</span>
          <h2>نظرة عامة</h2>
        </div>
        <Link to="/demo" className="btn primary">Open Demo Chat</Link>
      </div>

      <div className="stats-grid dashboard-stats">
        <StatCard label="محادثات اليوم" value="128" icon={<MessageCircle size={18} />} />
        <StatCard label="الطلبات" value={String(orders.length)} icon={<ShoppingCart size={18} />} />
        <StatCard label="الأرباح" value={money(orders.reduce((sum, o) => sum + o.total, 0))} icon={<CircleDollarSign size={18} />} />
        <StatCard label="منتجات" value={String(products.length)} icon={<Package size={18} />} />
      </div>

      <div className="grid-two">
        <div className="panel-card">
          <h3>Performance</h3>
          <div className="bars">
            {[35, 55, 60, 72, 80, 78, 90, 96].map((h, idx) => (
              <span key={idx} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div className="panel-card">
          <h3>AI Capabilities</h3>
          <ul className="simple-list">
            <li>تحديد لغة العميل تلقائياً</li>
            <li>متابعة المشتري بعد 3 ساعات</li>
            <li>إكمال الطلب بعد تأكيد الزبون</li>
            <li>نقل المحادثة للبشر عند الحاجة</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ConversationsPage({ user }: { user: User | null }) {
  return (
    <div className="page-panel">
      <div className="section-head">
        <div>
          <span className="mini-label">Conversations</span>
          <h2>Inbox</h2>
        </div>
      </div>

      <div className="conversation-list">
        {demoConversations.map((conversation) => (
          <div key={conversation.id} className="panel-card conversation-item">
            <div>
              <strong>{conversation.customerId}</strong>
              <small>{conversation.channel}</small>
            </div>
            <p>{conversation.lastMessage}</p>
            <div className="mini-meta">
              <span>{conversation.status}</span>
              <span>{conversation.assignedTo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersPage({ orders }: { orders: Order[] }) {
  return (
    <div className="page-panel">
      <div className="section-head">
        <div>
          <span className="mini-label">Orders</span>
          <h2>Orders</h2>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerId}</td>
                <td>{order.productName}</td>
                <td>{money(order.total)}</td>
                <td><span className="status-tag">{order.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductsPage({ products, setProducts }: { products: Product[]; setProducts: React.Dispatch<React.SetStateAction<Product[]>> }) {
  return (
    <div className="page-panel">
      <div className="section-head">
        <div>
          <span className="mini-label">Products</span>
          <h2>Catalog</h2>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-art">{product.images[0]}</div>
            <div className="product-info">
              <strong>{product.nameAr}</strong>
              <small>{product.category}</small>
              <div className="price-row">
                <span>{money(product.price)}</span>
                <span className={product.stockQuantity > 0 ? 'stock ok' : 'stock bad'}>{product.stockQuantity > 0 ? 'متوفر' : 'غير متوفر'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomersPage() {
  return (
    <div className="page-panel">
      <div className="section-head">
        <div>
          <span className="mini-label">Customers</span>
          <h2>Customer dashboard</h2>
        </div>
      </div>
      <div className="customer-list">
        {demoCustomers.map((customer) => (
          <div key={customer.id} className="panel-card customer-item">
            <div>
              <strong>{customer.name}</strong>
              <small>{customer.phone}</small>
            </div>
            <div className="mini-meta">
              <span>{customer.city}</span>
              <span>{customer.email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiPage() {
  return (
    <div className="page-panel">
      <div className="section-head">
        <div>
          <span className="mini-label">AI Agent</span>
          <h2>AI analytics</h2>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total conversations" value="324" icon={<Bot size={18} />} />
        <StatCard label="AI resolved" value="89%" icon={<CheckCircle2 size={18} />} />
        <StatCard label="Orders generated" value="53" icon={<ShoppingCart size={18} />} />
        <StatCard label="Handoff rate" value="11%" icon={<Users size={18} />} />
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="page-panel">
      <div className="section-head">
        <div>
          <span className="mini-label">Settings</span>
          <h2>Store and AI settings</h2>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel-card">
          <h3>Agent Name</h3>
          <p>{demoAiSettings.agentName}</p>
        </div>
        <div className="panel-card">
          <h3>Tone</h3>
          <p>{demoAiSettings.tone}</p>
        </div>
        <div className="panel-card">
          <h3>Language</h3>
          <p>{demoAiSettings.language}</p>
        </div>
        <div className="panel-card">
          <h3>Business rules</h3>
          <ul className="simple-list">
            {demoAiSettings.businessRules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DemoPage({ products, createOrder }: { products: Product[]; createOrder: (product: Product, city: string, customerName: string, phone: string, address: string) => Order }) {
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [value, setValue] = useState('');
  const [lastLanguage, setLastLanguage] = useState<Language>('ar');

  const handleSend = () => {
    const text = value.trim();
    if (!text) return;

    const language = detectLanguage(text);
    setLastLanguage(language);

    const match = searchProducts(products, text)[0];
    let response = 'أقدر أساعدك في اختيار منتج مناسب. اذكر اسم المنتج أو الفئة.';

    if (match) {
      response = `${match.nameAr} متوفر الآن 🌷 السعر ${money(match.price)}. هل تريد أطلب لك؟`;
    }

    if (text.toLowerCase().includes('delivery') || text.toLowerCase().includes('توصيل')) {
      response = `التوصيل لبغداد هو ${money(demoStore.defaultDeliveryFee)} وفق إعدادات المتجر.`;
    }

    if (text.toLowerCase().includes('price') || text.toLowerCase().includes('سعر') || text.toLowerCase().includes('كم')) {
      if (match) response = `${match.nameAr} السعر ${money(match.price)}.`;
      else response = 'أرسل اسم المنتج وستظهر السعر من قاعدة البيانات.';
    }

    if (text.toLowerCase().includes('human') || text.toLowerCase().includes('إنسان') || text.toLowerCase().includes('شكوى')) {
      response = 'تم تحويل المحادثة للفريق البشري الآن.';
    }

    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), sender: 'customer', text, language, time: 'الآن' },
      { id: String(Date.now() + 1), sender: 'agent', text: response, language: language || 'ar', time: 'الآن' }
    ]);
    setValue('');
  };

  const confirmDemoOrder = () => {
    const product = searchProducts(products, 'هودي')[0] || products[0];
    const order = createOrder(product, 'بغداد', 'Demo Customer', '07700000000', 'المنصور');
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'agent',
        text: `تم إنشاء الطلب بنجاح ✅ الطلب ${order.orderNumber} - المجموع ${money(order.total)}. هذا الطلب تم إنشاؤه فعلياً في التطبيق بواسطة أدوات المتجر.`,
        language: 'ar',
        time: 'الآن'
      }
    ]);
  };

  return (
    <div className="demo-page">
      <header className="topbar demo-header">
        <div className="brand">
          <div className="brand-mark">AI</div>
          <div>
            <strong>Demo Chat</strong>
            <small>Demo Chat — No external messaging account connected.</small>
          </div>
        </div>
        <Link to="/" className="btn ghost">Home</Link>
      </header>

      <main className="demo-layout">
        <div className="chat-card">
          <div className="chat-header">
            <Bot size={18} />
            <div>
              <strong>Angel</strong>
              <small>AI Sales Agent</small>
            </div>
            <span className="live-badge">DEMO MODE</span>
          </div>

          <div className="chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={msg.sender === 'customer' ? 'bubble customer' : 'bubble agent'}>
                <p>{msg.text}</p>
                <small>{msg.time} · {msg.language}</small>
              </div>
            ))}
          </div>

          <div className="composer">
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="اكتب بالعربي أو English أو Arabizi..." />
            <button className="btn primary" onClick={handleSend}>Send</button>
          </div>
        </div>

        <aside className="demo-side">
          <div className="panel-card">
            <h3>Detected language</h3>
            <strong>{lastLanguage}</strong>
            <p>الوكيل يكتشف لغة الزبون ويجيب وفقها.</p>
          </div>

          <div className="panel-card">
            <h3>Quick actions</h3>
            <button className="btn primary full" onClick={confirmDemoOrder}>Create demo order</button>
            <Link to="/dashboard" className="btn secondary full">Open store dashboard</Link>
          </div>
        </aside>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export default App;

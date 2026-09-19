CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(50) NOT NULL CHECK (role IN ('owner','manager','support','agent','customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE stores (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  currency VARCHAR(10) NOT NULL DEFAULT 'IQD',
  timezone VARCHAR(100) NOT NULL DEFAULT 'Asia/Baghdad',
  default_delivery_fee NUMERIC(12,2) NOT NULL DEFAULT 5000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price NUMERIC(12,2) NOT NULL,
  sale_price NUMERIC(12,2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sku VARCHAR(100),
  images JSONB,
  variants JSONB,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  customer_id UUID REFERENCES customers(id),
  channel VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  assigned_to VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer','agent','human')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  customer_id UUID REFERENCES customers(id),
  order_number VARCHAR(100) NOT NULL UNIQUE,
  subtotal NUMERIC(12,2) NOT NULL,
  delivery_fee NUMERIC(12,2) NOT NULL,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('Pending','Confirmed','Preparing','Shipped','Delivered','Cancelled')),
  payment_status VARCHAR(50) NOT NULL CHECK (payment_status IN ('Unpaid','Paid','Pending')),
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  product_name_snapshot VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_snapshot NUMERIC(12,2) NOT NULL,
  total NUMERIC(12,2) NOT NULL
);

CREATE TABLE agent_settings (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  agent_name VARCHAR(255) NOT NULL,
  language VARCHAR(50) NOT NULL,
  tone VARCHAR(50) NOT NULL,
  welcome_message TEXT,
  rules TEXT,
  escalation_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  follow_up_enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE follow_ups (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  customer_id UUID REFERENCES customers(id),
  conversation_id UUID REFERENCES conversations(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE integrations (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  provider VARCHAR(100) NOT NULL,
  credentials_encrypted TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Not Connected',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(255),
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_customers_store_id ON customers(store_id);
CREATE INDEX idx_conversations_store_id ON conversations(store_id);
CREATE INDEX idx_follow_ups_store_id ON follow_ups(store_id);
CREATE INDEX idx_audit_logs_store_id ON audit_logs(store_id);

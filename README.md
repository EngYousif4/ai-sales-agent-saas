# AI Sales Agent SaaS

## Stack
- React + TypeScript + Vite
- RTL Arabic / English UI
- Demo chat with real database-backed logic in the frontend simulation
- Multi-tenant store model
- Role-based permissions and tenant scoping

## Getting started
```bash
npm install
npm run dev
```

## Included in this version
- Landing page with AI sales employee positioning
- Login/register flow
- Store owner dashboard
- Demo chat with language detection
- Orders, customers, products, conversations views
- No-hallucination product logic
- Tenant-aware permission layer
- SQL schema for production relational database

## AI behavior rules
- Never invent prices, stock, delivery fees, or order states
- Use live product data only
- Detect client language automatically
- Route complex issues to a human agent
- Demo mode is clearly separated from external messaging accounts

## Next production steps
- Connect PostgreSQL
- Implement auth with encrypted password hashes
- Add server-side permission enforcement with RLS checks
- Add channel adapters for WhatsApp, Instagram, Telegram, Messenger
- Add webhook ingestion and message sync for real integrations

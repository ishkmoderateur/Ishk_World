# Ishk Platform - Complete Documentation

## 📋 Table of Contents
1. [Platform Overview](#platform-overview)
2. [Services & Features](#services--features)
3. [User Roles & Use Cases](#user-roles--use-cases)
4. [Conceptual Data Model (MCD)](#conceptual-data-model-mcd)
5. [Logical Data Model (MLD)](#logical-data-model-mld)

---

## 🎯 Platform Overview

**Ishk** (Arabic: عشق, meaning "love" or "passion") is a unified multi-service platform promoting **slow living** and **mindful consumption**. The platform combines five distinct services under one ecosystem:

### Core Philosophy
- **Slow living closer to what really matters**
- Quality over quantity
- Sustainable and eco-friendly practices
- Community-driven approach
- Multi-language support (EN, FR, ES, DE, AR)

---

## 🛍️ Services & Features

### 1. **News Service** 📰
- Curated world news briefs
- Regional news filtering
- Topic-based categorization
- User-saved news preferences
- Multi-language news delivery

**Features:**
- Browse news by region and topics
- Save favorite news articles
- Personalized news feed
- Admin content management

---

### 2. **Boutique (E-Commerce)** 🛒
- Sustainable product marketplace
- "Ishk Original" branded products
- Shopping cart and wishlist
- Order management
- Stripe payment integration

**Features:**
- Product catalog with categories
- Product ratings and reviews
- Stock management
- Featured products and badges
- Shopping cart persistence (logged-in users)
- Order tracking
- Shipping and tax calculation

---

### 3. **Association (Charity)** ❤️
- Fundraising campaigns
- Donation system
- Campaign categories (Environment, Community, Education, Wildlife)
- Impact tracking
- Anonymous donations

**Features:**
- Browse active campaigns
- Make donations (with/without account)
- Track campaign progress
- View impact metrics
- Campaign management (admin)

---

### 4. **Party/Housing Service** 🏠
- Venue booking platform
- Event venue discovery
- Inquiry system for bookings
- Venue features and amenities
- Capacity and pricing information

**Features:**
- Browse venues by location
- Filter by capacity, features, price
- Submit venue inquiries
- Track inquiry status
- Venue management (admin)

---

### 5. **Photography Service** 📸
- Photography portfolio showcase
- Category-based galleries
- Featured photography
- Custom ordering
- Portfolio management

**Features:**
- Browse photography by category
- View featured work
- Portfolio management (admin)
- Image galleries

---

## 👥 User Roles & Use Cases

### **1. USER (Regular User)**

**Use Cases:**
- ✅ Browse and read news articles
- ✅ Save favorite news briefs
- ✅ Browse and purchase products from boutique
- ✅ Add products to cart and wishlist
- ✅ Place orders and track shipments
- ✅ Browse and donate to charity campaigns
- ✅ Browse venues and submit booking inquiries
- ✅ View photography portfolio
- ✅ Manage personal profile
- ✅ Multi-language interface

**Limitations:**
- ❌ Cannot manage content
- ❌ Cannot access admin panels
- ❌ Cannot modify products, campaigns, venues, or photography

---

### **2. SUPER_ADMIN**

**Use Cases:**
- ✅ **Full access to all services**
- ✅ Manage all users (view, edit, delete)
- ✅ Manage all products (boutique)
- ✅ Manage all campaigns (association)
- ✅ Manage all venues (party)
- ✅ Manage all news briefs
- ✅ Manage all photography
- ✅ View platform statistics
- ✅ Manage orders and inquiries
- ✅ View all donations
- ✅ Access all admin panels

**Access:**
- `/admin` - Main admin dashboard
- `/admin/boutique-panel` - Product management
- `/admin/association-panel` - Campaign management
- `/admin/party-panel` - Venue management
- `/admin/news-panel` - News management
- `/admin/photography-panel` - Photography management

---

### **3. ADMIN_NEWS**

**Use Cases:**
- ✅ Create, edit, delete news briefs
- ✅ Manage news categories and topics
- ✅ View news statistics
- ✅ Access `/admin/news-panel` only

**Limitations:**
- ❌ Cannot access other admin panels
- ❌ Cannot manage users, products, campaigns, venues, or photography

---

### **4. ADMIN_PARTY**

**Use Cases:**
- ✅ Create, edit, delete venues
- ✅ Manage venue features and amenities
- ✅ View and respond to venue inquiries
- ✅ Access `/admin/party-panel` only

**Limitations:**
- ❌ Cannot access other admin panels
- ❌ Cannot manage users, products, campaigns, news, or photography

---

### **5. ADMIN_BOUTIQUE**

**Use Cases:**
- ✅ Create, edit, delete products
- ✅ Manage product inventory
- ✅ Set product prices and categories
- ✅ Mark products as "Ishk Original"
- ✅ View orders
- ✅ Access `/admin/boutique-panel` only

**Limitations:**
- ❌ Cannot access other admin panels
- ❌ Cannot manage users, campaigns, venues, news, or photography

---

### **6. ADMIN_ASSOCIATION**

**Use Cases:**
- ✅ Create, edit, delete campaigns
- ✅ Set campaign goals and track progress
- ✅ View donations
- ✅ Manage campaign categories
- ✅ Access `/admin/association-panel` only

**Limitations:**
- ❌ Cannot access other admin panels
- ❌ Cannot manage users, products, venues, news, or photography

---

### **7. ADMIN_PHOTOGRAPHY**

**Use Cases:**
- ✅ Upload, edit, delete photography
- ✅ Organize photography by category
- ✅ Set featured photography
- ✅ Custom ordering of portfolio
- ✅ Access `/admin/photography-panel` only

**Limitations:**
- ❌ Cannot access other admin panels
- ❌ Cannot manage users, products, campaigns, venues, or news

---

## 📊 Conceptual Data Model (MCD)

### **Entity-Relationship Overview**

```
┌─────────────┐
│    USER     │
│─────────────│
│ id (PK)     │
│ email       │
│ name        │
│ role        │
│ password    │
└──────┬──────┘
       │
       │ 1:N
       │
       ├─────────────────────────────────────────────────┐
       │                                                 │
       ▼                                                 ▼
┌──────────────┐                                ┌──────────────┐
│   ACCOUNT    │                                │   SESSION    │
│ (NextAuth)   │                                │ (NextAuth)   │
└──────────────┘                                └──────────────┘
       │                                                 │
       │                                                 │
       ▼                                                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      USER ACTIVITIES                        │
└─────────────────────────────────────────────────────────────┘
       │
       ├─── ORDERS (1:N)
       │    └─── ORDER_ITEMS (1:N) ─── PRODUCTS
       │
       ├─── CART_ITEMS (1:N) ─── PRODUCTS
       │
       ├─── WISHLIST_ITEMS (1:N) ─── PRODUCTS
       │
       ├─── DONATIONS (1:N) ─── CAMPAIGNS
       │
       ├─── VENUE_INQUIRIES (1:N) ─── VENUES
       │
       └─── NEWS_BRIEFS (1:N)

┌──────────────┐
│   PRODUCT    │
│──────────────│
│ id (PK)      │
│ name         │
│ price        │
│ category     │
│ stockCount   │
└──────────────┘

┌──────────────┐
│   CAMPAIGN   │
│──────────────│
│ id (PK)      │
│ title        │
│ goal         │
│ raised       │
│ category     │
└──────────────┘

┌──────────────┐
│    VENUE     │
│──────────────│
│ id (PK)      │
│ name         │
│ location     │
│ capacity     │
│ price        │
└──────────────┘

┌──────────────┐
│ PHOTOGRAPHY  │
│──────────────│
│ id (PK)      │
│ title        │
│ category     │
│ image        │
│ featured     │
└──────────────┘
```

### **Key Relationships:**

1. **User → Orders → OrderItems → Products**
   - One user can have many orders
   - One order contains many order items
   - Each order item references a product

2. **User → CartItems → Products**
   - One user can have many cart items
   - Each cart item references a product

3. **User → Donations → Campaigns**
   - One user can make many donations
   - Each donation is for one campaign

4. **User → VenueInquiries → Venues**
   - One user can make many inquiries
   - Each inquiry is for one venue

5. **User → NewsBriefs**
   - One user can save many news briefs

---

## 🗄️ Logical Data Model (MLD)

### **Tables Structure**

#### **1. Authentication Tables**

**users**
```
- id (PK, String, CUID)
- email (Unique, String)
- emailVerified (DateTime, Nullable)
- name (String, Nullable)
- image (String, Nullable)
- phone (String, Nullable)
- password (String, Nullable) - Hashed with bcrypt
- role (UserRole Enum) - Default: USER
- createdAt (DateTime)
- updatedAt (DateTime)
```

**accounts** (NextAuth OAuth)
```
- id (PK, String, CUID)
- userId (FK → users.id)
- type (String)
- provider (String)
- providerAccountId (String)
- refresh_token, access_token, expires_at, etc.
- UNIQUE(provider, providerAccountId)
```

**sessions** (NextAuth)
```
- id (PK, String, CUID)
- sessionToken (Unique, String)
- userId (FK → users.id)
- expires (DateTime)
```

**verification_tokens** (NextAuth)
```
- identifier (String)
- token (Unique, String)
- expires (DateTime)
- UNIQUE(identifier, token)
```

---

#### **2. E-Commerce Tables**

**products**
```
- id (PK, String, CUID)
- name (String)
- slug (Unique, String)
- description (String)
- price (Float)
- comparePrice (Float, Nullable)
- category (String)
- isIshkOriginal (Boolean, Default: false)
- images (JSON) - Array of image URLs
- inStock (Boolean, Default: true)
- stockCount (Int, Default: 0)
- rating (Float, Default: 0)
- reviewCount (Int, Default: 0)
- badge (String, Nullable) - "Bestseller", "New", etc.
- featured (Boolean, Default: false)
- createdAt (DateTime)
- updatedAt (DateTime)
```

**cart_items**
```
- id (PK, String, CUID)
- userId (FK → users.id)
- productId (FK → products.id)
- quantity (Int, Default: 1)
- size (String, Nullable)
- color (String, Nullable)
- createdAt (DateTime)
- updatedAt (DateTime)
- UNIQUE(userId, productId, size, color)
```

**orders**
```
- id (PK, String, CUID)
- userId (FK → users.id)
- orderNumber (Unique, String)
- status (OrderStatus Enum) - PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
- total (Float)
- subtotal (Float)
- shipping (Float)
- tax (Float, Default: 0)
- shippingAddress (JSON)
- billingAddress (JSON)
- paymentMethod (String, Nullable)
- paymentIntentId (String, Nullable) - Stripe
- trackingNumber (String, Nullable)
- createdAt (DateTime)
- updatedAt (DateTime)
```

**order_items**
```
- id (PK, String, CUID)
- orderId (FK → orders.id)
- productId (FK → products.id)
- quantity (Int)
- price (Float) - Price at time of order
- size (String, Nullable)
- color (String, Nullable)
```

**wishlist_items**
```
- id (PK, String, CUID)
- userId (FK → users.id)
- productId (FK → products.id)
- createdAt (DateTime)
- UNIQUE(userId, productId)
```

---

#### **3. Association (Charity) Tables**

**campaigns**
```
- id (PK, String, CUID)
- title (String)
- slug (Unique, String)
- description (String)
- category (String) - "Environment", "Community", "Education", "Wildlife"
- goal (Float)
- raised (Float, Default: 0)
- image (String, Nullable)
- impact (String, Nullable) - "🌳 7,500 trees planted"
- isActive (Boolean, Default: true)
- createdAt (DateTime)
- updatedAt (DateTime)
```

**donations**
```
- id (PK, String, CUID)
- userId (FK → users.id, Nullable) - Anonymous donations allowed
- campaignId (FK → campaigns.id)
- amount (Float)
- currency (String, Default: "EUR")
- paymentIntentId (String, Nullable) - Stripe
- anonymous (Boolean, Default: false)
- message (String, Nullable)
- createdAt (DateTime)
```

---

#### **4. Party/Housing Tables**

**venues**
```
- id (PK, String, CUID)
- name (String)
- slug (Unique, String)
- description (String)
- location (String)
- city (String)
- country (String)
- address (String)
- capacity (String) - "30-50 guests"
- minCapacity (Int)
- maxCapacity (Int)
- price (Float) - Starting price
- currency (String, Default: "EUR")
- rating (Float, Default: 0)
- reviewCount (Int, Default: 0)
- images (JSON) - Array of image URLs
- features (JSON) - ["Garden", "Terrace", "Parking"]
- amenities (JSON, Nullable) - Detailed amenities object
- isActive (Boolean, Default: true)
- createdAt (DateTime)
- updatedAt (DateTime)
```

**venue_inquiries**
```
- id (PK, String, CUID)
- userId (FK → users.id, Nullable) - Guest inquiries allowed
- venueId (FK → venues.id)
- name (String)
- email (String)
- phone (String, Nullable)
- eventDate (DateTime)
- guestCount (Int)
- message (String, Nullable)
- status (InquiryStatus Enum) - NEW, CONTACTED, QUOTED, BOOKED, DECLINED
- respondedAt (DateTime, Nullable)
- createdAt (DateTime)
- updatedAt (DateTime)
```

---

#### **5. News Tables**

**news_briefs**
```
- id (PK, String, CUID)
- userId (FK → users.id, Nullable) - Saved news for users
- title (String)
- summary (String)
- region (String)
- topics (JSON) - Array of topics
- sourceUrl (String, Nullable)
- savedAt (DateTime)
```

---

#### **6. Photography Tables**

**photography**
```
- id (PK, String, CUID)
- title (String)
- category (String) - "Cultural", "Adventure", "Social Media", etc.
- image (String) - Image URL or path
- description (String, Nullable)
- featured (Boolean, Default: false)
- order (Int, Default: 0) - For custom ordering
- createdAt (DateTime)
- updatedAt (DateTime)
```

---

### **Enums**

**UserRole**
```
- USER
- SUPER_ADMIN
- ADMIN_NEWS
- ADMIN_PARTY
- ADMIN_BOUTIQUE
- ADMIN_ASSOCIATION
- ADMIN_PHOTOGRAPHY
```

**OrderStatus**
```
- PENDING
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED
- REFUNDED
```

**InquiryStatus**
```
- NEW
- CONTACTED
- QUOTED
- BOOKED
- DECLINED
```

---

### **Foreign Key Relationships**

```
users (1) ──→ (N) accounts
users (1) ──→ (N) sessions
users (1) ──→ (N) orders
users (1) ──→ (N) cart_items
users (1) ──→ (N) wishlist_items
users (1) ──→ (N) donations
users (1) ──→ (N) venue_inquiries
users (1) ──→ (N) news_briefs

products (1) ──→ (N) order_items
products (1) ──→ (N) cart_items
products (1) ──→ (N) wishlist_items

orders (1) ──→ (N) order_items

campaigns (1) ──→ (N) donations

venues (1) ──→ (N) venue_inquiries
```

---

## 🔐 Security & Access Control

### **Role-Based Access Control (RBAC)**

- **USER**: Read-only access to public content, can create orders/inquiries/donations
- **Section Admins**: Full CRUD on their assigned section only
- **SUPER_ADMIN**: Full access to all sections and user management

### **Authentication**
- NextAuth.js v5 with JWT strategy
- Credentials provider (email/password)
- OAuth providers (Google)
- Session management
- Password hashing with bcrypt

### **Payment Processing**
- Stripe integration for:
  - Product purchases (boutique)
  - Donations (association)
- Webhook handling for payment events
- Payment intent tracking

---

## 🌐 Multi-Language Support

Supported languages:
- English (EN)
- French (FR)
- Spanish (ES)
- German (DE)
- Arabic (AR)

Features:
- Language switching
- RTL support for Arabic
- Translated content
- Google Translate API integration (optional)

---

## 📈 Platform Statistics

Admins can view:
- Total products, venues, campaigns
- Total orders and revenue
- Total users
- Total donations
- Pending inquiries
- Platform-wide analytics

---

## 🚀 Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (Prisma ORM)
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **Email**: Resend (optional)
- **Deployment**: PM2, NGINX, VPS

---

**Last Updated**: November 2025
**Version**: 0.1.0







# Ishk Platform - MCD & MLD Diagrams

## 📊 Conceptual Data Model (MCD) - Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            ┌───────▼──────┐    ┌───────▼──────┐
            │    ACCOUNT   │    │   SESSION    │
            │  (OAuth)     │    │  (NextAuth)  │
            └───────┬──────┘    └───────┬──────┘
                    │                   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │       USER         │
                    │───────────────────│
                    │ • id (PK)         │
                    │ • email (UQ)      │
                    │ • name            │
                    │ • role            │
                    │ • password        │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ E-COMMERCE    │    │  ASSOCIATION  │    │ PARTY/HOUSING│
│   MODULE      │    │    MODULE     │    │    MODULE    │
└───────────────┘    └───────────────┘    └───────────────┘
        │                     │                     │
        │                     │                     │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│    PRODUCT      │   │   CAMPAIGN     │   │     VENUE      │
│────────────────│   │────────────────│   │────────────────│
│ • id (PK)      │   │ • id (PK)      │   │ • id (PK)      │
│ • name         │   │ • title        │   │ • name         │
│ • price        │   │ • goal         │   │ • location     │
│ • category     │   │ • raised       │   │ • capacity     │
│ • stockCount   │   │ • category     │   │ • price        │
└───────┬────────┘   └───────┬────────┘   └───────┬────────┘
        │                     │                     │
        │                     │                     │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│   CART_ITEM    │   │   DONATION     │   │ VENUE_INQUIRY  │
│   ORDER_ITEM   │   │                │   │                │
│  WISHLIST_ITEM │   │                │   │                │
└────────────────┘   └────────────────┘   └────────────────┘
        │
        │
┌───────▼────────┐
│     ORDER      │
│────────────────│
│ • id (PK)      │
│ • orderNumber  │
│ • status       │
│ • total        │
└────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CONTENT MODULES                             │
└─────────────────────────────────────────────────────────────────┘
        │                     │
┌───────▼────────┐   ┌───────▼────────┐
│  NEWS_BRIEF    │   │  PHOTOGRAPHY   │
│────────────────│   │────────────────│
│ • id (PK)      │   │ • id (PK)      │
│ • title        │   │ • title        │
│ • summary      │   │ • category     │
│ • region       │   │ • image        │
│ • topics       │   │ • featured     │
└────────────────┘   └────────────────┘
```

---

## 🗄️ Logical Data Model (MLD) - Detailed Tables

### **Table: users**
```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    emailVerified DATETIME,
    name TEXT,
    image TEXT,
    phone TEXT,
    password TEXT,
    role TEXT NOT NULL DEFAULT 'USER',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### **Table: products**
```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    comparePrice REAL,
    category TEXT NOT NULL,
    isIshkOriginal INTEGER DEFAULT 0,
    images TEXT NOT NULL, -- JSON array
    inStock INTEGER DEFAULT 1,
    stockCount INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    reviewCount INTEGER DEFAULT 0,
    badge TEXT,
    featured INTEGER DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
```

### **Table: orders**
```sql
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    orderNumber TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    total REAL NOT NULL,
    subtotal REAL NOT NULL,
    shipping REAL NOT NULL,
    tax REAL DEFAULT 0,
    shippingAddress TEXT NOT NULL, -- JSON
    billingAddress TEXT NOT NULL, -- JSON
    paymentMethod TEXT,
    paymentIntentId TEXT,
    trackingNumber TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_orders_userId ON orders(userId);
CREATE INDEX idx_orders_orderNumber ON orders(orderNumber);
CREATE INDEX idx_orders_status ON orders(status);
```

### **Table: order_items**
```sql
CREATE TABLE order_items (
    id TEXT PRIMARY KEY,
    orderId TEXT NOT NULL,
    productId TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    size TEXT,
    color TEXT,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id)
);

-- Indexes
CREATE INDEX idx_order_items_orderId ON order_items(orderId);
CREATE INDEX idx_order_items_productId ON order_items(productId);
```

### **Table: cart_items**
```sql
CREATE TABLE cart_items (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    productId TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    size TEXT,
    color TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(userId, productId, size, color)
);

-- Indexes
CREATE INDEX idx_cart_items_userId ON cart_items(userId);
```

### **Table: campaigns**
```sql
CREATE TABLE campaigns (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    goal REAL NOT NULL,
    raised REAL DEFAULT 0,
    image TEXT,
    impact TEXT,
    isActive INTEGER DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_campaigns_slug ON campaigns(slug);
CREATE INDEX idx_campaigns_category ON campaigns(category);
CREATE INDEX idx_campaigns_isActive ON campaigns(isActive);
```

### **Table: donations**
```sql
CREATE TABLE donations (
    id TEXT PRIMARY KEY,
    userId TEXT,
    campaignId TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    paymentIntentId TEXT,
    anonymous INTEGER DEFAULT 0,
    message TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (campaignId) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_donations_userId ON donations(userId);
CREATE INDEX idx_donations_campaignId ON donations(campaignId);
```

### **Table: venues**
```sql
CREATE TABLE venues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT NOT NULL,
    capacity TEXT NOT NULL,
    minCapacity INTEGER NOT NULL,
    maxCapacity INTEGER NOT NULL,
    price REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    rating REAL DEFAULT 0,
    reviewCount INTEGER DEFAULT 0,
    images TEXT NOT NULL, -- JSON array
    features TEXT NOT NULL, -- JSON array
    amenities TEXT, -- JSON object
    isActive INTEGER DEFAULT 1,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_venues_slug ON venues(slug);
CREATE INDEX idx_venues_city ON venues(city);
CREATE INDEX idx_venues_isActive ON venues(isActive);
```

### **Table: venue_inquiries**
```sql
CREATE TABLE venue_inquiries (
    id TEXT PRIMARY KEY,
    userId TEXT,
    venueId TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    eventDate DATETIME NOT NULL,
    guestCount INTEGER NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'NEW',
    respondedAt DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (venueId) REFERENCES venues(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_venue_inquiries_userId ON venue_inquiries(userId);
CREATE INDEX idx_venue_inquiries_venueId ON venue_inquiries(venueId);
CREATE INDEX idx_venue_inquiries_status ON venue_inquiries(status);
```

### **Table: news_briefs**
```sql
CREATE TABLE news_briefs (
    id TEXT PRIMARY KEY,
    userId TEXT,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    region TEXT NOT NULL,
    topics TEXT NOT NULL, -- JSON array
    sourceUrl TEXT,
    savedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_news_briefs_userId ON news_briefs(userId);
CREATE INDEX idx_news_briefs_region ON news_briefs(region);
```

### **Table: photography**
```sql
CREATE TABLE photography (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    featured INTEGER DEFAULT 0,
    "order" INTEGER DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_photography_category ON photography(category);
CREATE INDEX idx_photography_featured ON photography(featured);
CREATE INDEX idx_photography_order ON photography("order");
```

---

## 🔗 Relationship Summary

### **One-to-Many Relationships:**

1. **User → Orders** (1:N)
   - One user can have multiple orders
   - Foreign Key: `orders.userId → users.id`

2. **User → Cart Items** (1:N)
   - One user can have multiple cart items
   - Foreign Key: `cart_items.userId → users.id`

3. **User → Donations** (1:N)
   - One user can make multiple donations
   - Foreign Key: `donations.userId → users.id` (nullable for anonymous)

4. **User → Venue Inquiries** (1:N)
   - One user can make multiple inquiries
   - Foreign Key: `venue_inquiries.userId → users.id` (nullable for guests)

5. **Order → Order Items** (1:N)
   - One order contains multiple items
   - Foreign Key: `order_items.orderId → orders.id`

6. **Product → Order Items** (1:N)
   - One product can appear in multiple orders
   - Foreign Key: `order_items.productId → products.id`

7. **Product → Cart Items** (1:N)
   - One product can be in multiple carts
   - Foreign Key: `cart_items.productId → products.id`

8. **Campaign → Donations** (1:N)
   - One campaign receives multiple donations
   - Foreign Key: `donations.campaignId → campaigns.id`

9. **Venue → Inquiries** (1:N)
   - One venue receives multiple inquiries
   - Foreign Key: `venue_inquiries.venueId → venues.id`

### **Many-to-Many Relationships (via junction tables):**

1. **User ↔ Product** (via `wishlist_items`)
   - Users can wishlist multiple products
   - Products can be wishlisted by multiple users

2. **User ↔ Product** (via `cart_items`)
   - Users can add multiple products to cart
   - Products can be in multiple user carts

---

## 📈 Data Flow Examples

### **E-Commerce Flow:**
```
User → Browse Products → Add to Cart → Checkout → Create Order → 
Order Items → Payment (Stripe) → Order Status Update
```

### **Donation Flow:**
```
User → Browse Campaigns → Select Campaign → Make Donation → 
Payment (Stripe) → Campaign Raised Amount Update
```

### **Venue Booking Flow:**
```
User/Guest → Browse Venues → Submit Inquiry → Admin Response → 
Status Update (NEW → CONTACTED → QUOTED → BOOKED)
```

---

**Note**: This is a SQLite-based implementation. For production at scale, consider migrating to PostgreSQL for better performance and concurrent access handling.








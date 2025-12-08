# ISHK Platform - Complete Developer Guide

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Architecture](#project-architecture)
4. [Database Schema](#database-schema)
5. [Authentication System](#authentication-system)
6. [Payment Integration](#payment-integration)
7. [Multi-language & Currency](#multi-language--currency)
8. [API Routes](#api-routes)
9. [Environment Setup](#environment-setup)
10. [Deployment](#deployment)
11. [Development Workflow](#development-workflow)

---

## Overview

**ISHK Platform** is a unified multi-tenant web application combining:
- **News Briefs** - Curated news aggregation
- **Boutique** - E-commerce store with sustainable products
- **Party Services** - Event venue booking and party services
- **Association** - Charity campaigns and donations
- **Photography** - Portfolio showcase and booking system

**Philosophy**: Slow living closer to what really matters

**Domain**: https://ishk-world.com

---

## Tech Stack

### Core Framework
- **Next.js**: 16.0.7 (App Router architecture)
- **React**: 19.2.0
- **TypeScript**: 5.9.3
- **Node.js**: Running on MAMP (Windows environment)

### Database & ORM
- **Prisma**: 6.19.0 (ORM)
- **SQLite**: File-based database (`./prisma/dev.db`)
- **Migrations**: 10 migration files tracking schema evolution

### Authentication & Authorization
- **NextAuth.js**: v5.0.0-beta.30
- **Strategy**: JWT (no database sessions)
- **Providers**: 
  - Credentials (email/password with bcrypt)
  - Google OAuth (custom implementation)
- **Password Hashing**: bcryptjs

### Payment Processing
- **Stripe**: v19.3.0 (Test mode)
  - Products checkout
  - Donations
  - Webhook handling
- **PayPal SDK**: Live mode
  - Alternative payment method
  - Order creation and capture

### Email Service
- **Brevo (Sendinblue)**: SMTP provider
- **Nodemailer**: v7.0.11 (Email client)
- **Use Cases**: 
  - Order confirmations
  - Inquiry notifications
  - Email verification
  - Admin alerts

### Styling & UI
- **Tailwind CSS**: v4 with PostCSS
- **Framer Motion**: v12.23.24 (Animations)
- **Lucide React**: v0.553.0 (Icon library)
- **Custom Fonts**:
  - Inter (Sans-serif)
  - Playfair Display (Headings)
  - Cormorant Garamond (Display)

### Form Handling & Validation
- **React Hook Form**: v7.66.0
- **Zod**: v4.1.12 (Schema validation)
- **@hookform/resolvers**: v5.2.2

### Additional Libraries
- **Leaflet**: v1.9.4 (Maps)
- **React Leaflet**: v5.0.0
- **Sharp**: v0.33.5 (Image optimization)
- **OpenAI**: v6.8.1 (AI integration - optional)
- **class-variance-authority**: v0.7.1 (Component variants)
- **clsx** + **tailwind-merge**: Utility classes

### Development Tools
- **ESLint**: v9 with Next.js config
- **Playwright**: v1.56.1 (E2E testing)
- **tsx**: v4.20.6 (TypeScript execution)
- **dotenv**: v17.2.3 (Environment variables)

### Deployment & Process Management
- **PM2**: Cluster mode with 2 instances
- **MAMP**: Local development server (Windows)

---

## Project Architecture

### Directory Structure

```
ishk-platform/
├── .next/                          # Next.js build output
├── prisma/
│   ├── migrations/                 # Database migrations (10 files)
│   ├── dev.db                      # SQLite database
│   └── schema.prisma               # Database schema (20+ models)
│
├── public/
│   ├── images/                     # Static images
│   ├── photography/                # Portfolio images (25+ files)
│   └── [svg icons]
│
├── scripts/                        # Utility scripts
│   ├── create-admin.ts             # Create admin users
│   ├── import-photography.ts       # Import photos to DB
│   ├── seed-events.ts              # Seed event data
│   ├── seed-services.ts            # Seed service data
│   ├── translate-all.ts            # Generate translations
│   ├── reset-password.ts           # Reset user passwords
│   ├── list-users.js               # List all users
│   └── [15+ utility scripts]
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── about/                  # About page
│   │   ├── admin/                  # Admin dashboard (role-protected)
│   │   │   ├── albums/
│   │   │   ├── campaigns/
│   │   │   ├── orders/
│   │   │   ├── photography/
│   │   │   ├── products/
│   │   │   ├── users/
│   │   │   ├── venues/
│   │   │   └── [10+ admin sections]
│   │   │
│   │   ├── albums/                 # Photography albums
│   │   ├── api/                    # API routes (see API section)
│   │   ├── association/            # Charity campaigns
│   │   ├── auth/                   # Authentication pages
│   │   │   ├── signin/
│   │   │   ├── signup/
│   │   │   └── signout/
│   │   │
│   │   ├── boutique/               # E-commerce store
│   │   │   ├── [slug]/             # Product detail pages
│   │   │   └── page.tsx
│   │   │
│   │   ├── cart/                   # Shopping cart
│   │   ├── checkout/               # Checkout flow
│   │   ├── company/                # Company info
│   │   ├── contact/                # Contact forms
│   │   ├── news/                   # News briefs
│   │   ├── orders/                 # Order history
│   │   ├── party/                  # Event venues & services
│   │   ├── photography/            # Portfolio & bookings
│   │   ├── profile/                # User profile
│   │   ├── legal/                  # Legal pages
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── returns/
│   │   ├── shipping/
│   │   ├── globals.css             # Global styles
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Homepage
│   │
│   ├── components/                 # Reusable components
│   │   ├── navbar.tsx              # Main navigation
│   │   ├── footer.tsx              # Footer
│   │   ├── providers.tsx           # Context providers wrapper
│   │   ├── hero-section.tsx
│   │   ├── features-section.tsx
│   │   ├── cta-section.tsx
│   │   ├── philosophy-section.tsx
│   │   ├── service-cards.tsx
│   │   ├── image-gallery.tsx
│   │   ├── photography-gallery.tsx
│   │   ├── media-upload.tsx
│   │   ├── pagination.tsx
│   │   ├── price-display.tsx
│   │   ├── price-input.tsx
│   │   ├── currency-selector.tsx
│   │   └── language-provider-wrapper.tsx
│   │
│   ├── contexts/                   # React Context API
│   │   ├── cart-context.tsx        # Shopping cart state
│   │   ├── currency-context.tsx    # Multi-currency management
│   │   └── language-context.tsx    # i18n management
│   │
│   ├── lib/                        # Utilities & configurations
│   │   ├── auth.ts                 # NextAuth configuration
│   │   ├── auth-server.ts          # Server-side auth helpers
│   │   ├── prisma.ts               # Prisma client singleton
│   │   ├── currency.ts             # Currency conversion logic
│   │   ├── translator.ts           # Translation utilities
│   │   ├── paypal.ts               # PayPal SDK setup
│   │   ├── roles.ts                # Role-based access control
│   │   ├── utils.ts                # General utilities
│   │   ├── validation.ts           # Zod schemas
│   │   ├── env.ts                  # Environment validation
│   │   └── google-oauth.ts         # Google OAuth helpers
│   │
│   ├── locales/                    # i18n translation files
│   │   ├── en.json                 # English
│   │   ├── fr.json                 # French
│   │   ├── ar.json                 # Arabic (RTL)
│   │   ├── es.json                 # Spanish
│   │   └── de.json                 # German
│   │
│   └── types/
│       └── next-auth.d.ts          # NextAuth type extensions
│
├── .env                            # Environment variables (NEVER commit)
├── .env.local                      # Local overrides
├── .env.production                 # Production config
├── .gitignore
├── components.json                 # shadcn/ui config
├── ecosystem.config.js             # PM2 configuration
├── eslint.config.mjs               # ESLint configuration
├── next.config.ts                  # Next.js configuration
├── next-env.d.ts                   # Next.js types
├── package.json                    # Dependencies
├── postcss.config.mjs              # PostCSS configuration
├── prisma.config.ts                # Prisma configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

### App Router Structure

Next.js 13+ App Router with:
- **Server Components** by default
- **Client Components** marked with `"use client"`
- **API Routes** in `app/api/`
- **Route Groups** for organization
- **Dynamic Routes** with `[slug]` and `[id]`
- **Parallel Routes** for modals
- **Loading States** with `loading.tsx`
- **Error Boundaries** with `error.tsx`

---

## Database Schema

### Technology
- **ORM**: Prisma 6.19.0
- **Database**: SQLite (file-based)
- **Location**: `./prisma/dev.db`
- **Migrations**: 10 migration files

### Schema Overview (20+ Models)

#### User Management
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  phone         String?
  password      String?   // bcrypt hashed
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  accounts            Account[]
  sessions            Session[]
  orders              Order[]
  cartItems           CartItem[]
  wishlistItems       WishlistItem[]
  inquiries           VenueInquiry[]
  donations           Donation[]
  newsBriefs          NewsBrief[]
  photographyBookings PhotographyBooking[]
}

enum UserRole {
  USER
  SUPER_ADMIN
  ADMIN_NEWS
  ADMIN_PARTY
  ADMIN_BOUTIQUE
  ADMIN_ASSOCIATION
  ADMIN_PHOTOGRAPHY
}
```

#### NextAuth Models
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

#### E-commerce (Boutique)
```prisma
model Product {
  id             String   @id @default(cuid())
  name           String
  slug           String   @unique
  description    String
  price          Float    // USD base
  comparePrice   Float?   // Original price for discounts
  currency       String   @default("USD")
  category       String
  isIshkOriginal Boolean  @default(false)
  images         Json     // Array of URLs (min 1, max 10)
  videos         Json?    // Array of URLs (max 2)
  inStock        Boolean  @default(true)
  stockCount     Int      @default(0)
  rating         Float    @default(0)
  reviewCount    Int      @default(0)
  badge          String?  // "Bestseller", "New"
  featured       Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  // Relations
  orderItems    OrderItem[]
  cartItems     CartItem[]
  wishlistItems WishlistItem[]
}

model Order {
  id              String      @id @default(cuid())
  userId          String
  orderNumber     String      @unique
  status          OrderStatus @default(PENDING)
  total           Float
  subtotal        Float
  shipping        Float
  tax             Float       @default(0)
  shippingAddress Json
  billingAddress  Json
  paymentMethod   String?
  paymentIntentId String?     // Stripe
  trackingNumber  String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  user       User        @relation(fields: [userId], references: [id])
  orderItems OrderItem[]
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

model CartItem {
  id        String   @id @default(cuid())
  userId    String
  productId String
  quantity  Int      @default(1)
  size      String?
  color     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId, size, color])
}
```

#### Party Services
```prisma
model Venue {
  id           String   @id @default(cuid())
  name         String
  slug         String   @unique
  description  String
  location     String
  city         String
  country      String
  address      String
  capacity     String   // "30-50 guests"
  minCapacity  Int
  maxCapacity  Int
  price        Float    // USD base
  comparePrice Float?
  currency     String   @default("USD")
  rating       Float    @default(0)
  reviewCount  Int      @default(0)
  images       Json     // Array (min 1, max 10)
  videos       Json?    // Array (max 2)
  features     Json     // ["Garden", "Terrace"]
  amenities    Json?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  inquiries VenueInquiry[]
}

model VenueInquiry {
  id          String        @id @default(cuid())
  userId      String?
  venueId     String
  name        String
  email       String
  phone       String?
  eventDate   DateTime
  guestCount  Int
  message     String?
  status      InquiryStatus @default(NEW)
  respondedAt DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  user  User?  @relation(fields: [userId], references: [id], onDelete: SetNull)
  venue Venue  @relation(fields: [venueId], references: [id], onDelete: Cascade)
}

enum InquiryStatus {
  NEW
  CONTACTED
  QUOTED
  BOOKED
  DECLINED
}

model PartyService {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  price       Float    // USD base
  currency    String   @default("USD")
  rating      Float    @default(0)
  reviewCount Int      @default(0)
  features    Json
  image       String?
  featured    Boolean  @default(false)
  isActive    Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### Association (Charity)
```prisma
model Campaign {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  category    String   // "Environment", "Community"
  goal        Float    // USD
  raised      Float    @default(0)
  currency    String   @default("USD")
  image       String?
  impact      String?  // "🌳 7,500 trees planted"
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  donations Donation[]
}

model Donation {
  id               String   @id @default(cuid())
  userId           String?
  campaignId       String
  amount           Float    // USD
  currency         String   @default("USD")
  originalAmount   Float?   // User's currency
  originalCurrency String?
  paymentIntentId  String?  // Stripe
  anonymous        Boolean  @default(false)
  message          String?
  images           Json?    // Array (max 10)
  videos           Json?    // Array (max 2)
  createdAt        DateTime @default(now())
  
  user     User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  campaign Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
}
```

#### Photography
```prisma
model Photography {
  id          String   @id @default(cuid())
  title       String
  category    String   // "Cultural", "Adventure"
  image       String
  description String?
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  albumPhotos AlbumPhoto[]
}

model Album {
  id          String   @id @default(cuid())
  title       String
  description String?
  coverImage  String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  photos AlbumPhoto[]
}

model AlbumPhoto {
  id          String   @id @default(cuid())
  albumId     String
  photoId     String
  orientation String   @default("horizontal")
  description String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  
  album Album       @relation(fields: [albumId], references: [id], onDelete: Cascade)
  photo Photography @relation(fields: [photoId], references: [id], onDelete: Cascade)
  
  @@unique([albumId, photoId])
}

model PhotographyService {
  id           String   @id @default(cuid())
  name         String
  slug         String   @unique
  description  String
  duration     String   // "2 hours"
  price        Float?   // USD
  comparePrice Float?
  currency     String   @default("USD")
  features     Json
  image        String?
  featured     Boolean  @default(false)
  isActive     Boolean  @default(true)
  order        Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model PhotographyBooking {
  id            String        @id @default(cuid())
  userId        String?
  name          String
  email         String
  phone         String?
  preferredDate DateTime?
  serviceType   String        // "portrait", "event"
  message       String?
  images        Json?
  videos        Json?
  status        InquiryStatus @default(NEW)
  respondedAt   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

#### News
```prisma
model NewsBrief {
  id        String   @id @default(cuid())
  userId    String?
  title     String
  summary   String
  region    String
  topics    Json     // Array
  sourceUrl String?
  savedAt   DateTime @default(now())
  
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

### Database Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Deploy migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Seed database
npx tsx scripts/seed-services.ts
npx tsx scripts/import-photography.ts
```


---

## Authentication System

### NextAuth v5 Configuration

**Location**: `src/lib/auth.ts`

#### Strategy
- **JWT-based**: No database sessions
- **Token Storage**: HTTP-only cookies
- **Session Duration**: Configurable via NextAuth

#### Providers

##### 1. Credentials Provider
```typescript
CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    // 1. Validate input
    // 2. Find user by email
    // 3. Verify password with bcrypt
    // 4. Return user object with role
  }
})
```

**Password Hashing**: bcryptjs with salt rounds
```typescript
import bcrypt from "bcryptjs";

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, user.password);
```

##### 2. Google OAuth (Custom Implementation)
**Location**: `src/app/api/auth/google/`

**Flow**:
1. User clicks "Sign in with Google"
2. Redirect to Google OAuth consent screen
3. Google redirects back with authorization code
4. Exchange code for tokens
5. Fetch user profile
6. Create/update user in database
7. Create NextAuth session

**Why Custom?**: More control over OAuth flow and user creation

#### Role-Based Access Control (RBAC)

**Roles** (7 levels):
```typescript
enum UserRole {
  USER              // Regular users
  SUPER_ADMIN       // Full access
  ADMIN_NEWS        // News management
  ADMIN_PARTY       // Party/venues management
  ADMIN_BOUTIQUE    // Products/orders management
  ADMIN_ASSOCIATION // Campaigns/donations management
  ADMIN_PHOTOGRAPHY // Photography management
}
```

**Role Checking**:
```typescript
// Server-side
import { auth } from "@/lib/auth";

const session = await auth();
if (!session || session.user.role !== "SUPER_ADMIN") {
  return new Response("Unauthorized", { status: 401 });
}

// Client-side
import { useSession } from "next-auth/react";

const { data: session } = useSession();
const isAdmin = session?.user?.role === "SUPER_ADMIN";
```

#### Callbacks

**JWT Callback**: Add custom data to token
```typescript
async jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    token.role = user.role;
  }
  return token;
}
```

**Session Callback**: Add token data to session
```typescript
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id;
    session.user.role = token.role;
  }
  return session;
}
```

**SignIn Callback**: Handle OAuth user creation
```typescript
async signIn({ user, account, profile }) {
  if (account?.provider === "google") {
    // Create or update user in database
  }
  return true;
}
```

#### Protected Routes

**API Routes**:
```typescript
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Protected logic
}
```

**Pages** (Middleware):
```typescript
// middleware.ts
import { auth } from "@/lib/auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/admin")) {
    return Response.redirect(new URL("/auth/signin", req.url));
  }
});
```

#### Authentication Flow

**Sign Up**:
1. User submits email/password
2. Validate input with Zod
3. Check if email exists
4. Hash password with bcrypt
5. Create user in database
6. Send verification email (optional)
7. Auto sign-in or redirect to login

**Sign In**:
1. User submits credentials
2. NextAuth calls authorize function
3. Verify credentials
4. Create JWT token
5. Set HTTP-only cookie
6. Redirect to dashboard/home

**Sign Out**:
1. User clicks sign out
2. NextAuth clears session cookie
3. Redirect to home page

#### Session Management

**Get Session (Server)**:
```typescript
import { auth } from "@/lib/auth";

const session = await auth();
```

**Get Session (Client)**:
```typescript
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();
```

**Update Session**:
```typescript
import { useSession } from "next-auth/react";

const { update } = useSession();
await update({ name: "New Name" });
```

---

## Payment Integration

### Stripe Integration

**Version**: 19.3.0  
**Mode**: Test Mode  
**Location**: API routes in `src/app/api/`

#### Setup

```typescript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});
```

#### Payment Flow

**1. Create Payment Intent** (`/api/checkout`)
```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(total * 100), // Convert to cents
  currency: "usd",
  metadata: {
    orderId: order.id,
    userId: session.user.id,
  },
});
```

**2. Client-Side Confirmation**
```typescript
import { loadStripe } from "@stripe/stripe-js";

const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const { error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { name, email },
  },
});
```

**3. Webhook Handling** (`/api/webhooks/stripe`)
```typescript
const sig = request.headers.get("stripe-signature")!;
const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

switch (event.type) {
  case "payment_intent.succeeded":
    // Update order status
    break;
  case "payment_intent.payment_failed":
    // Handle failure
    break;
}
```

#### Use Cases
- Product purchases (Boutique)
- Donations (Association)
- Service bookings (Photography)

### PayPal Integration

**Mode**: Live  
**SDK**: @paypal/checkout-server-sdk  
**Location**: `src/lib/paypal.ts`

#### Setup

```typescript
import paypal from "@paypal/checkout-server-sdk";

const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);

const client = new paypal.core.PayPalHttpClient(environment);
```

#### Payment Flow

**1. Create Order** (`/api/paypal/create-order`)
```typescript
const request = new paypal.orders.OrdersCreateRequest();
request.prefer("return=representation");
request.requestBody({
  intent: "CAPTURE",
  purchase_units: [{
    amount: {
      currency_code: "USD",
      value: total.toFixed(2),
    },
  }],
});

const order = await client.execute(request);
```

**2. Capture Payment** (`/api/paypal/capture`)
```typescript
const request = new paypal.orders.OrdersCaptureRequest(orderId);
const capture = await client.execute(request);

if (capture.result.status === "COMPLETED") {
  // Update order in database
}
```

**3. Webhook Handling** (`/api/paypal/webhook`)
```typescript
// Verify webhook signature
// Handle events: PAYMENT.CAPTURE.COMPLETED, etc.
```

#### Currency Handling

PayPal doesn't support all currencies (e.g., MAD). Conversion logic:

```typescript
// src/lib/currency.ts
export function getPayPalCurrency(userCurrency: Currency) {
  if (PAYPAL_SUPPORTED_CURRENCIES.includes(userCurrency)) {
    return { currency: userCurrency, conversionRate: 1.0 };
  }
  
  // Fallback: MAD -> EUR
  const fallback = CURRENCY_FALLBACK_MAP[userCurrency];
  const conversionRate = calculateRate(userCurrency, fallback);
  
  return { currency: fallback, conversionRate };
}
```

---

## Multi-language & Currency

### Internationalization (i18n)

**Supported Languages**: 5
- English (EN) - Default
- French (FR)
- Arabic (AR) - RTL support
- Spanish (ES)
- German (DE)

**Location**: `src/locales/`

#### Implementation

**Context Provider** (`src/contexts/language-context.tsx`):
```typescript
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState<Language>("EN");
  
  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ishk-language");
    if (saved) setLanguage(saved);
  }, []);
  
  // Translation function
  const t = (key: string): string => {
    const keys = key.split(".");
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    // Fallback to English
    return value || translations.EN[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

**Usage**:
```typescript
import { useLanguage } from "@/contexts/language-context";

const { t, language, setLanguage } = useLanguage();

return (
  <div>
    <h1>{t("home.hero.title")}</h1>
    <button onClick={() => setLanguage("FR")}>Français</button>
  </div>
);
```

**Translation File Structure** (`locales/en.json`):
```json
{
  "home": {
    "hero": {
      "title": "Slow living closer to what really matters",
      "subtitle": "Discover mindful experiences..."
    }
  },
  "nav": {
    "home": "Home",
    "boutique": "Boutique",
    "party": "Party"
  }
}
```

#### RTL Support (Arabic)

```typescript
// Auto-detect and apply
useEffect(() => {
  document.documentElement.dir = language === "AR" ? "rtl" : "ltr";
  document.documentElement.lang = language.toLowerCase();
}, [language]);
```

### Multi-Currency System

**Supported Currencies**: 4
- USD (US Dollar) - Base currency
- EUR (Euro)
- GBP (British Pound)
- MAD (Moroccan Dirham)

**Location**: `src/lib/currency.ts`

#### Exchange Rates

```typescript
export const exchangeRates: Record<Currency, number> = {
  USD: 1.0,      // Base
  EUR: 0.92,     // 1 USD = 0.92 EUR
  GBP: 0.79,     // 1 USD = 0.79 GBP
  MAD: 10.0,     // 1 USD = 10 MAD
};
```

**Note**: In production, fetch real-time rates from API (e.g., exchangerate-api.com)

#### Currency Conversion

```typescript
export function convertCurrency(amountUSD: number, targetCurrency: Currency): number {
  if (targetCurrency === "USD") return amountUSD;
  return amountUSD * exchangeRates[targetCurrency];
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = currencySymbols[currency];
  const formatted = amount.toFixed(2);
  
  // RTL currencies (MAD)
  if (currency === "MAD") {
    return `${formatted} ${symbol}`;
  }
  
  return `${symbol}${formatted}`;
}
```

#### Context Provider

```typescript
export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState<Currency>("USD");
  
  // Auto-detect from IP
  useEffect(() => {
    detectCurrencyFromIP().then(setCurrency);
  }, []);
  
  const convert = (amountUSD: number) => {
    return convertCurrency(amountUSD, currency);
  };
  
  const format = (amountUSD: number) => {
    const converted = convert(amountUSD);
    return formatCurrency(converted, currency);
  };
  
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}
```

#### Usage

```typescript
import { useCurrency } from "@/contexts/currency-context";

const { format, currency } = useCurrency();

return (
  <div>
    <p>Price: {format(product.price)}</p>
    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="GBP">GBP</option>
      <option value="MAD">MAD</option>
    </select>
  </div>
);
```

#### Database Storage

**All prices stored in USD** (base currency):
```prisma
model Product {
  price    Float   // Always USD
  currency String  @default("USD")
}
```

**Conversion happens at runtime** on client-side for display.

#### PayPal Currency Handling

```typescript
// MAD not supported by PayPal -> Convert to EUR
const { amount, currency } = convertToPayPalCurrency(cartTotal, "MAD");
// amount: converted to EUR
// currency: "EUR"
```

---

## API Routes

### Structure

All API routes in `src/app/api/`

### Authentication Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handlers |
| `/api/auth/register` | POST | User registration |
| `/api/auth/google` | GET | Google OAuth callback |
| `/api/auth/verify-email` | POST | Email verification |
| `/api/auth/test-session` | GET | Test session (dev) |

### Product Routes (Boutique)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/products` | GET | No | List products (pagination, filters) |
| `/api/products/[slug]` | GET | No | Get product by slug |
| `/api/admin/products` | GET | Admin | List all products |
| `/api/admin/products` | POST | Admin | Create product |
| `/api/admin/products/[id]` | PUT | Admin | Update product |
| `/api/admin/products/[id]` | DELETE | Admin | Delete product |

### Cart Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/cart` | GET | Yes | Get user's cart |
| `/api/cart/item` | POST | Yes | Add item to cart |
| `/api/cart/item` | PUT | Yes | Update cart item |
| `/api/cart/item` | DELETE | Yes | Remove cart item |

### Order Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/orders` | GET | Yes | Get user's orders |
| `/api/orders` | POST | Yes | Create order |
| `/api/orders/verify-session` | POST | Yes | Verify payment session |
| `/api/admin/orders` | GET | Admin | List all orders |
| `/api/admin/orders/[id]` | PUT | Admin | Update order status |

### Checkout & Payment Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/checkout` | POST | Yes | Create Stripe payment intent |
| `/api/paypal/create-order` | POST | Yes | Create PayPal order |
| `/api/paypal/capture` | POST | Yes | Capture PayPal payment |
| `/api/webhooks/stripe` | POST | No | Stripe webhook handler |
| `/api/paypal/webhook` | POST | No | PayPal webhook handler |

### Venue Routes (Party)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/venues/inquiry` | POST | No | Submit venue inquiry |
| `/api/admin/venues` | GET | Admin | List venues |
| `/api/admin/venues` | POST | Admin | Create venue |
| `/api/admin/venues/[id]` | PUT | Admin | Update venue |
| `/api/admin/venues/[id]` | DELETE | Admin | Delete venue |
| `/api/admin/inquiries` | GET | Admin | List inquiries |

### Party Service Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/party/services` | GET | No | List party services |
| `/api/party/inquiry` | POST | No | Submit service inquiry |
| `/api/admin/party-services` | GET | Admin | List services |
| `/api/admin/party-services` | POST | Admin | Create service |

### Campaign Routes (Association)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/campaigns` | GET | No | List campaigns |
| `/api/campaigns/[slug]` | GET | No | Get campaign by slug |
| `/api/admin/campaigns` | GET | Admin | List all campaigns |
| `/api/admin/campaigns` | POST | Admin | Create campaign |
| `/api/admin/campaigns/[id]` | PUT | Admin | Update campaign |
| `/api/admin/donations` | GET | Admin | List donations |

### Photography Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/photography` | GET | No | List portfolio photos |
| `/api/photography/services` | GET | No | List photography services |
| `/api/photography/booking` | POST | No | Submit booking inquiry |
| `/api/admin/photography` | GET | Admin | List photos |
| `/api/admin/photography` | POST | Admin | Upload photo |
| `/api/admin/photography/[id]` | DELETE | Admin | Delete photo |
| `/api/admin/albums` | GET | Admin | List albums |
| `/api/admin/albums` | POST | Admin | Create album |

### User & Profile Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/profile/update` | PUT | Yes | Update profile |
| `/api/profile/change-password` | POST | Yes | Change password |
| `/api/profile/change-email` | POST | Yes | Change email |
| `/api/admin/users` | GET | Admin | List users |
| `/api/admin/users/[id]` | PUT | Admin | Update user role |

### Wishlist Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/wishlist` | GET | Yes | Get wishlist |
| `/api/wishlist` | POST | Yes | Add to wishlist |
| `/api/wishlist` | DELETE | Yes | Remove from wishlist |

### Utility Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/contact` | POST | No | Contact form submission |
| `/api/translate` | POST | No | Translate text |
| `/api/health` | GET | No | Health check |
| `/api/test-env` | GET | No | Test environment (dev) |

### Admin Stats Routes

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/admin/stats` | GET | Admin | Dashboard statistics |

### API Response Format

**Success**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error**:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Error Handling

```typescript
try {
  // API logic
  return Response.json({ success: true, data });
} catch (error) {
  console.error("API Error:", error);
  return Response.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}
```

### Rate Limiting

**Not implemented yet**. Consider adding:
- `express-rate-limit` for API routes
- Redis for distributed rate limiting
- Per-user and per-IP limits


---

## Environment Setup

### Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+ or **pnpm**: v8+
- **Git**: Latest version
- **MAMP** (for Windows) or similar local server
- **Code Editor**: VS Code recommended

### Environment Variables

Create `.env` file in project root:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=file:./prisma/dev.db

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal (Live Mode)
PAYPAL_CLIENT_ID=your-client-id
PAYPAL_CLIENT_SECRET=your-client-secret
PAYPAL_MODE=live

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Brevo SMTP
BREVO_SMTP_USER=your-smtp-user
BREVO_SMTP_PASSWORD=your-smtp-password
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=Your App Name

# Admin
ADMIN_EMAIL=admin@yourdomain.com

# Optional
GOOGLE_TRANSLATE_API_KEY=your-api-key

# Environment
NODE_ENV=development
```

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Installation Steps

#### 1. Clone Repository
```bash
git clone <repository-url>
cd ishk-platform
```

#### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

#### 3. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx tsx scripts/seed-services.ts
npx tsx scripts/import-photography.ts
```

#### 4. Create Admin User
```bash
npm run create-admin
# Follow prompts to create admin account
```

#### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Third-Party Service Setup

#### Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get test API keys from Dashboard > Developers > API keys
3. Setup webhook:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret to `.env`

#### PayPal Setup

1. Create account at [developer.paypal.com](https://developer.paypal.com)
2. Create app in Dashboard
3. Get Client ID and Secret
4. Setup webhook:
   - URL: `https://yourdomain.com/api/paypal/webhook`
   - Events: `PAYMENT.CAPTURE.COMPLETED`

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://yourdomain.com/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`

#### Brevo (Email) Setup

1. Create account at [brevo.com](https://www.brevo.com)
2. Go to SMTP & API > SMTP
3. Create SMTP key
4. Copy credentials to `.env`
5. Verify sender email

### IDE Configuration (VS Code)

**Recommended Extensions**:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright"
  ]
}
```

**Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Troubleshooting

#### Database Issues
```bash
# Reset database
npx prisma migrate reset

# Check database
npx prisma studio
```

#### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

#### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Prisma Client Issues
```bash
# Regenerate client
npx prisma generate

# Clear Prisma cache
rm -rf node_modules/.prisma
npx prisma generate
```

---

## Deployment

### Production Build

```bash
# Install dependencies
npm ci

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Build Next.js
npm run build

# Test production build locally
npm start
```

### PM2 Deployment

**Configuration**: `ecosystem.config.js`

```javascript
module.exports = {
  apps: [{
    name: 'ishk-platform',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    max_memory_restart: '1G',
  }]
};
```

**Commands**:
```bash
# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Monitor
pm2 monit

# View logs
pm2 logs ishk-platform

# Restart
pm2 restart ishk-platform

# Stop
pm2 stop ishk-platform

# Delete
pm2 delete ishk-platform
```

### VPS Deployment Steps

#### 1. Server Setup (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

#### 2. Clone & Setup Project

```bash
# Clone repository
git clone <repository-url> /var/www/ishk-platform
cd /var/www/ishk-platform

# Install dependencies
npm ci

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Setup database
npx prisma generate
npx prisma migrate deploy

# Build
npm run build

# Create logs directory
mkdir -p logs
```

#### 3. Nginx Configuration

```nginx
# /etc/nginx/sites-available/ishk-platform
server {
    listen 80;
    server_name ishk-world.com www.ishk-world.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    # Images
    location /images {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ishk-platform /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 4. SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d ishk-world.com -d www.ishk-world.com

# Auto-renewal (already setup by certbot)
sudo certbot renew --dry-run
```

#### 5. Start Application

```bash
cd /var/www/ishk-platform
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 6. Firewall Setup

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Database Considerations

#### SQLite Limitations
- Single file database
- No concurrent writes
- Limited scalability

#### Migrate to PostgreSQL (Recommended for Production)

**1. Install PostgreSQL**:
```bash
sudo apt install postgresql postgresql-contrib
```

**2. Create Database**:
```bash
sudo -u postgres psql
CREATE DATABASE ishk_platform;
CREATE USER ishk_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ishk_platform TO ishk_user;
\q
```

**3. Update Prisma Schema**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**4. Update .env**:
```bash
DATABASE_URL="postgresql://ishk_user:secure_password@localhost:5432/ishk_platform"
```

**5. Migrate**:
```bash
npx prisma migrate dev
```

### Backup Strategy

#### Database Backup (SQLite)
```bash
# Backup
cp prisma/dev.db backups/dev-$(date +%Y%m%d).db

# Automated daily backup
crontab -e
# Add: 0 2 * * * cp /var/www/ishk-platform/prisma/dev.db /var/www/backups/dev-$(date +\%Y\%m\%d).db
```

#### Database Backup (PostgreSQL)
```bash
# Backup
pg_dump ishk_platform > backup-$(date +%Y%m%d).sql

# Restore
psql ishk_platform < backup-20240101.sql

# Automated
crontab -e
# Add: 0 2 * * * pg_dump ishk_platform > /var/www/backups/db-$(date +\%Y\%m\%d).sql
```

#### Media Files Backup
```bash
# Backup public directory
tar -czf public-$(date +%Y%m%d).tar.gz public/

# Sync to remote storage (AWS S3, etc.)
aws s3 sync public/ s3://your-bucket/public/
```

### Monitoring

#### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

#### Server Monitoring
```bash
# Install htop
sudo apt install htop

# Monitor resources
htop

# Disk usage
df -h

# Memory usage
free -h
```

#### Application Monitoring (Optional)
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **New Relic**: Performance monitoring
- **Datadog**: Infrastructure monitoring

### CI/CD Pipeline (GitHub Actions)

**`.github/workflows/deploy.yml`**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/ishk-platform
            git pull origin main
            npm ci
            npx prisma migrate deploy
            npm run build
            pm2 restart ishk-platform
```

### Performance Optimization

#### Next.js Optimizations
- **Image Optimization**: Use `next/image`
- **Font Optimization**: Use `next/font`
- **Code Splitting**: Automatic with App Router
- **Static Generation**: Use `generateStaticParams`
- **Caching**: Configure in `next.config.ts`

#### Database Optimizations
- **Indexes**: Add to frequently queried fields
- **Connection Pooling**: Configure Prisma
- **Query Optimization**: Use `select` to limit fields

#### CDN Setup
- **Cloudflare**: Free tier available
- **AWS CloudFront**: For S3-hosted assets
- **Vercel**: Built-in CDN

---

## Development Workflow

### Git Workflow

**Branches**:
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `hotfix/*`: Urgent fixes

**Commit Convention**:
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

### Development Scripts

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npm run start                  # Start production server
npm run lint                   # Run ESLint

# Database
npx prisma studio              # Open Prisma Studio
npx prisma migrate dev         # Create migration
npx prisma migrate reset       # Reset database
npx prisma generate            # Generate client

# Testing
npm run test:e2e               # Run E2E tests
npm run test:e2e:ui            # Run tests with UI
npm run test:e2e:debug         # Debug tests

# Utilities
npm run create-admin           # Create admin user
npm run import-photography     # Import photos
npm run translate-all          # Generate translations
npm run list-users             # List all users
npm run reset-password         # Reset user password
```

### Code Style

**ESLint Configuration**: `eslint.config.mjs`
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

**Prettier** (recommended):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Testing

#### E2E Testing with Playwright

**Configuration**: `playwright.config.ts`
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Example Test**:
```typescript
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('ishk');
});

test('user can sign in', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/');
});
```

### Debugging

#### Server-Side Debugging
```typescript
// Add console.log in API routes
console.log('Debug:', { variable });

// Use debugger
debugger;

// Check logs
pm2 logs ishk-platform
```

#### Client-Side Debugging
```typescript
// Browser DevTools
console.log('Debug:', data);

// React DevTools
// Install extension

// Network tab
// Check API requests
```

#### Database Debugging
```bash
# Open Prisma Studio
npx prisma studio

# Check queries
# Enable query logging in prisma.ts
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Common Tasks

#### Add New Model
1. Update `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name add_model`
3. Generate client: `npx prisma generate`
4. Create API routes
5. Create UI components

#### Add New API Route
1. Create file in `src/app/api/`
2. Export GET, POST, PUT, DELETE functions
3. Add authentication if needed
4. Test with Postman/Thunder Client

#### Add New Page
1. Create folder in `src/app/`
2. Add `page.tsx`
3. Add `loading.tsx` (optional)
4. Add `error.tsx` (optional)
5. Update navigation

#### Add Translation
1. Update all files in `src/locales/`
2. Use nested keys: `"section.subsection.key"`
3. Test with language switcher

---

## Security Best Practices

### Environment Variables
- Never commit `.env` files
- Use different keys for dev/prod
- Rotate secrets regularly
- Use secret management (AWS Secrets Manager, etc.)

### Authentication
- Use strong password requirements
- Implement rate limiting
- Add 2FA (future enhancement)
- Session timeout
- CSRF protection (built-in with NextAuth)

### API Security
- Validate all inputs with Zod
- Sanitize user input
- Use parameterized queries (Prisma handles this)
- Implement rate limiting
- Add API key authentication for sensitive endpoints

### Database Security
- Use environment variables for credentials
- Limit database user permissions
- Regular backups
- Encrypt sensitive data
- Use connection pooling

### Payment Security
- Never store card details
- Use Stripe/PayPal SDKs
- Verify webhook signatures
- Log all transactions
- PCI DSS compliance

### HTTPS
- Always use HTTPS in production
- HSTS headers (configured in `next.config.ts`)
- Secure cookies

### Dependencies
- Regular updates: `npm audit`
- Use `npm audit fix`
- Monitor with Dependabot
- Review security advisories

---

## Troubleshooting Guide

### Common Issues

#### 1. NextAuth Session Not Working
```typescript
// Check NEXTAUTH_SECRET is set
// Check NEXTAUTH_URL matches domain
// Clear cookies and try again
// Check JWT callback returns correct data
```

#### 2. Prisma Client Not Found
```bash
npx prisma generate
# Restart dev server
```

#### 3. Payment Webhook Not Receiving Events
```bash
# Use ngrok for local testing
ngrok http 3000
# Update webhook URL in Stripe/PayPal dashboard
```

#### 4. Images Not Loading
```typescript
// Check next.config.ts remotePatterns
// Verify image URLs are accessible
// Check file permissions
```

#### 5. Translation Not Working
```typescript
// Check locale file exists
// Verify key path is correct
// Check LanguageProvider is wrapping app
```

### Performance Issues

#### Slow Page Load
- Check database queries (use Prisma logging)
- Optimize images (use next/image)
- Enable caching
- Use static generation where possible

#### High Memory Usage
- Check for memory leaks
- Optimize database queries
- Reduce PM2 instances
- Increase server resources

---

## Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Stripe Docs](https://stripe.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Tools
- [Prisma Studio](https://www.prisma.io/studio)
- [Postman](https://www.postman.com)
- [ngrok](https://ngrok.com)
- [PM2](https://pm2.keymetrics.io)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Prisma Slack](https://slack.prisma.io)
- [Stack Overflow](https://stackoverflow.com)

---

## License & Credits

**Project**: ISHK Platform  
**Version**: 0.1.0  
**License**: Private  

**Built with**:
- Next.js by Vercel
- Prisma by Prisma Labs
- NextAuth by NextAuth.js
- Tailwind CSS by Tailwind Labs
- And many other open-source libraries

---

**Last Updated**: 2024  
**Maintained by**: ISHK Development Team

For questions or support, contact: admin@ishk-platform.com

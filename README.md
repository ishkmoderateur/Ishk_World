# Ishk Platform

A comprehensive lifestyle platform focused on mindful living, offering e-commerce, photography services, party planning, and charitable campaigns.

## 🚀 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js v5** - Authentication & session management
- **Prisma** - ORM for database operations
- **SQLite** - Database (development)

### Payment & Services
- **Stripe** - Payment processing
- **Resend** - Email services
- **OpenAI** - AI features (translation, etc.)

### Development Tools
- **Playwright** - E2E testing
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 📋 Prerequisites

- Node.js 20+ 
- npm or yarn
- Git

## 🛠️ Local Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd ishk-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe (optional for local development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""

# Resend (optional)
RESEND_API_KEY=""

# OpenAI (optional)
OPENAI_API_KEY=""
```

### 4. Set up the database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx tsx scripts/seed-services.ts
npx tsx scripts/seed-events.ts
```

### 5. Create an admin user (optional)
```bash
npx tsx scripts/create-admin.ts
```

### 6. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 7. Access Prisma Studio (optional)
```bash
npx prisma studio
```

## 📱 Application Structure

### Main Pages
- `/` - Homepage
- `/boutique` - E-commerce shop
- `/photography` - Photography services
- `/party` - Party services & venues
- `/association` - Charity campaigns
- `/news` - World news briefs
- `/profile` - User profile
- `/cart` - Shopping cart
- `/admin` - Admin dashboard

### API Routes
- `/api/auth/*` - Authentication
- `/api/products/*` - Product management
- `/api/cart/*` - Shopping cart
- `/api/orders/*` - Order management
- `/api/wishlist/*` - Wishlist management
- `/api/photography/*` - Photography services
- `/api/party/*` - Party services
- `/api/campaigns/*` - Campaign management
- `/api/admin/*` - Admin operations

## 🎯 Button Functionality Guide

### Navigation & General

#### **Navbar Buttons**
- **Logo/Home** - Navigates to homepage (`/`)
- **Menu Items** (Home, News, Party, Boutique, Association, Photography) - Navigate to respective pages
- **Language Toggle** - Switches between EN, AR, FR, DE, ES
- **Shopping Bag Icon** - Opens cart (shows item count badge)
- **User Icon** - Opens profile menu (if logged in) or redirects to sign in
- **Sign In** - Redirects to `/auth/signin`
- **Sign Up** - Redirects to `/auth/register`
- **Sign Out** - Logs out user and redirects to homepage
- **Admin Panel** - Navigates to `/admin` (visible only to admins)

### Homepage (`/`)

#### **Hero Section**
- **"Begin Your Journey"** - Smooth scrolls to services section

#### **Service Cards**
- **Boutique Card** - Navigates to `/boutique`
- **Association Card** - Navigates to `/association`
- **Photography Card** - Navigates to `/photography`

### Boutique (`/boutique`)

#### **Product Listing**
- **Category Filters** - Filters products by category (All, Home & Living, Wellness, Books, Ishk Originals)
- **Product Cards** - Click to view product details
- **"View All Ishk Originals"** - Filters to show only Ishk Original products

#### **Product Detail Page** (`/boutique/[slug]`)
- **Back Arrow** - Returns to boutique page
- **Heart Icon (Wishlist)** - Toggles product in/out of wishlist (requires login)
- **Size Selector** - Selects product size
- **Color Selector** - Selects product color
- **"Add to Cart"** - Adds product to cart (requires login, redirects to sign in if not logged in)
- **Quantity +/-** - Adjusts quantity (if applicable)

### Photography Page (`/photography`)

#### **Hero Section**
- **"Book a Session"** - Smooth scrolls to booking form and pre-fills service type

#### **Portfolio Gallery**
- **Category Filters** - Filters portfolio by category (All, Cultural, Adventure, Social Media, etc.)
- **Portfolio Images** - Click to view full image/details

#### **Services Section**
- **"Book Now"** - Smooth scrolls to booking form and pre-fills the selected service type

#### **Booking Form**
- **Service Type Dropdown** - Selects photography service type (Portrait, Event, Commercial, Wedding, Other)
- **"Send Inquiry"** - Submits booking form (requires all fields filled)

### Party Page (`/party`)

#### **Services Section**
- **"Get Quote"** - Smooth scrolls to inquiry form at bottom of page

#### **Inquiry Form**
- **"Send Inquiry"** - Submits party inquiry form (requires all fields filled)

### Association Page (`/association`)

#### **Hero Section**
- **"Start Making an Impact" / "Explore Campaigns"** - Smooth scrolls to active campaigns section

#### **Campaign Cards**
- **"Donate Now"** - Navigates to campaign donation page (if implemented) or opens donation modal

### Profile Page (`/profile`)

#### **Account Settings**
- **"Change Password"** - Opens modal to change password
  - Requires: Current password, new password, confirm password
- **"Change Email"** - Opens modal to change email address
  - Requires: New email, current password
- **"Notifications"** - Opens modal to manage notification preferences
  - Toggles: Email notifications, Order updates, Promotions, Newsletter

#### **Orders Section**
- **Order Cards** - Click to view order details
- **"View All Orders"** - Expands to show all orders

#### **Wishlist Section**
- **Product Cards** - Click to view product details
- **Remove from Wishlist** - Removes item from wishlist

### Cart Page (`/cart`)

#### **Cart Items**
- **Quantity +/-** - Adjusts item quantity
- **Remove Item** - Removes item from cart
- **"Proceed to Checkout"** - Navigates to checkout (requires login)

### Admin Panel (`/admin`)

#### **Dashboard Overview**
- **Section Cards** - Navigate to respective admin panels:
  - **Boutique Panel** - Manage products
  - **Party Panel** - Manage venues
  - **Association Panel** - Manage campaigns
  - **Users Panel** - Manage user accounts
  - **Orders Panel** - Manage orders
  - **Donations Panel** - Manage donations
  - **Photography Panel** - Manage photography portfolio
  - **Party Services Panel** - Manage party services
  - **Photography Services Panel** - Manage photography services
  - **News Panel** - Manage news content
  - **Settings** - Platform settings

#### **Inquiries Manager**
- **Eye Icon** - Opens modal to view inquiry details (name, email, phone, date, message, status)
- **Status Badges** - Shows inquiry status (NEW, CONTACTED, QUOTED, BOOKED, DECLINED)

#### **General Admin Actions**
- **Add New** - Creates new item (product, service, campaign, etc.)
- **Edit** - Opens edit form for item
- **Delete** - Deletes item (with confirmation)
- **Save** - Saves changes
- **Cancel** - Cancels current operation

### Authentication Pages

#### **Sign In** (`/auth/signin`)
- **Email/Password Fields** - Enter credentials
- **"Sign In"** - Authenticates user and redirects
- **"Sign Up" Link** - Navigates to registration page
- **"Forgot Password"** - (If implemented) Resets password

#### **Register** (`/auth/register`)
- **Registration Form** - Name, email, password fields
- **"Sign Up"** - Creates new user account
- **"Sign In" Link** - Navigates to sign in page

## 🔐 User Roles

- **USER** - Regular user, can browse, purchase, and manage profile
- **ADMIN_NEWS** - Can manage news content
- **ADMIN_PARTY** - Can manage party services and venues
- **ADMIN_BOUTIQUE** - Can manage products
- **ADMIN_ASSOCIATION** - Can manage campaigns
- **ADMIN_PHOTOGRAPHY** - Can manage photography portfolio and services
- **SUPER_ADMIN** - Full access to all admin panels

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run E2E tests with UI
npm run test:e2e:debug # Debug E2E tests

# Database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev # Create and apply migration
npx prisma generate  # Generate Prisma Client

# Utilities
npm run create-admin # Create admin user
npm run translate-all # Translate content
```

## 🗄️ Database Schema

Key models:
- **User** - User accounts and authentication
- **Product** - E-commerce products
- **Order** - Customer orders
- **CartItem** - Shopping cart items
- **WishlistItem** - User wishlists
- **Venue** - Party venues
- **VenueInquiry** - Party venue inquiries
- **Campaign** - Charity campaigns
- **Donation** - Campaign donations
- **Photography** - Photography portfolio
- **PhotographyBooking** - Photography service bookings
- **PhotographyService** - Photography service packages
- **PartyService** - Party service offerings
- **Album** - Photography albums
- **NewsBrief** - News articles

## 🌐 Multi-language Support

The platform supports 5 languages:
- English (EN)
- Arabic (AR)
- French (FR)
- German (DE)
- Spanish (ES)

Language files are located in `src/locales/`

## 🔧 Troubleshooting

### Database Issues
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Authentication Issues
- Ensure `NEXTAUTH_SECRET` is set in `.env`
- Check that `NEXTAUTH_URL` matches your local URL

## 📦 Dependencies

Key dependencies are listed in `package.json`. Run `npm install` to install all dependencies.

## 🚢 Deployment

For production deployment:
1. Set production environment variables
2. Run `npm run build`
3. Start with `npm run start` or use PM2
4. Ensure database migrations are applied: `npx prisma migrate deploy`

## 📄 License

[Your License Here]

## 👥 Support

For issues or questions, please contact the development team.




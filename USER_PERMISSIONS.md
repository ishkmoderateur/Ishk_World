# 👥 USER ROLES & PERMISSIONS GUIDE

## Overview

The ishk-platform uses a role-based access control (RBAC) system with 7 different user roles. Each role has specific permissions and access to different sections of the platform.

---

## 🔵 REGULAR USER (USER)

**Default role** - All new registrations start with this role.

### ✅ What Regular Users CAN Do:

#### **Shopping & E-commerce**
- ✅ Browse all products in the boutique
- ✅ View product details, images, prices
- ✅ Add products to shopping cart
- ✅ Update cart quantities
- ✅ Remove items from cart
- ✅ Proceed to checkout
- ✅ Complete purchases via Stripe
- ✅ View their own order history
- ✅ Track order status

#### **Profile Management**
- ✅ Create account (register)
- ✅ Sign in / Sign out
- ✅ View their profile page
- ✅ Update personal information (name, phone)
- ✅ View their order history

#### **Content Browsing**
- ✅ Browse photography portfolio
- ✅ View photography albums
- ✅ Browse news section
- ✅ View party/venue listings
- ✅ View association campaigns
- ✅ Submit venue inquiries (for party services)
- ✅ Make donations to campaigns

#### **Public Features**
- ✅ Multi-language support (AR, EN, FR, DE, ES)
- ✅ View all public pages
- ✅ Use search functionality (if implemented)

### ❌ What Regular Users CANNOT Do:

- ❌ Access admin panel (`/admin`)
- ❌ Create, edit, or delete products
- ❌ Manage venues
- ❌ Create campaigns
- ❌ Upload photography
- ❌ Manage news briefs
- ❌ View other users' orders
- ❌ Access user management
- ❌ View platform statistics
- ❌ Manage inquiries or donations

---

## 🔴 SUPER ADMIN (SUPER_ADMIN)

**Highest level access** - Full control over the entire platform.

### ✅ What Super Admin CAN Do:

#### **Everything Regular Users Can Do** +
- ✅ Access full admin dashboard (`/admin`)
- ✅ View all platform statistics
- ✅ Manage all sections

#### **User Management** (Super Admin Only)
- ✅ View all users
- ✅ See user details (name, email, join date)
- ✅ View user order counts
- ✅ Delete users
- ✅ Change user roles (via database)

#### **Order Management** (Super Admin Only)
- ✅ View all orders from all users
- ✅ See order details (customer, total, status, date)
- ✅ Update order status
- ✅ View order history
- ✅ Access revenue statistics
- ✅ View total revenue

#### **Product Management** (Boutique)
- ✅ Create new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Manage product inventory (stock count)
- ✅ Set product prices
- ✅ Upload product images
- ✅ Set featured products
- ✅ Manage product categories
- ✅ View all products

#### **Venue Management** (Party Services)
- ✅ Create new venues
- ✅ Edit venue details
- ✅ Delete venues
- ✅ Manage venue pricing
- ✅ Upload venue images
- ✅ Set venue capacity
- ✅ View all venue inquiries
- ✅ Update inquiry status (NEW, CONTACTED, QUOTED, BOOKED, DECLINED)
- ✅ Respond to inquiries

#### **Campaign Management** (Association)
- ✅ Create new campaigns
- ✅ Edit campaign details
- ✅ Delete campaigns
- ✅ Set campaign goals
- ✅ Update campaign status (active/inactive)
- ✅ View all donations
- ✅ See donation statistics
- ✅ View total donations raised

#### **News Management**
- ✅ Create news briefs
- ✅ Edit news briefs
- ✅ Delete news briefs
- ✅ View all saved news briefs
- ✅ Manage news topics and regions

#### **Photography Management**
- ✅ Upload new photos
- ✅ Edit photo details
- ✅ Delete photos
- ✅ Create albums
- ✅ Manage album photos
- ✅ Set featured photos
- ✅ Organize photo order

#### **Platform Statistics**
- ✅ View total products count
- ✅ View total venues count
- ✅ View total campaigns count
- ✅ View total orders count
- ✅ View total users count
- ✅ View total donations count
- ✅ View total revenue
- ✅ View pending inquiries count

### ❌ What Super Admin CANNOT Do:

- ❌ Nothing! Super Admin has full access to everything.

---

## 🟢 BOUTIQUE ADMIN (ADMIN_BOUTIQUE)

**Manages the e-commerce/shop section**

### ✅ What Boutique Admin CAN Do:

#### **Product Management**
- ✅ Access boutique admin panel (`/admin/boutique-panel`)
- ✅ Create new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Manage product inventory (stock count)
- ✅ Set product prices and compare prices
- ✅ Upload product images
- ✅ Set featured products
- ✅ Manage product categories
- ✅ Set product badges (Bestseller, New, etc.)
- ✅ Mark products as "Ishk Original"
- ✅ View all products
- ✅ See product statistics

#### **Regular User Features**
- ✅ All regular user shopping features
- ✅ Browse and purchase products
- ✅ View own orders

### ❌ What Boutique Admin CANNOT Do:

- ❌ Manage venues or party services
- ❌ Manage campaigns or donations
- ❌ Manage news briefs
- ❌ Manage photography
- ❌ View all orders (only their own)
- ❌ Access user management
- ❌ View platform-wide statistics
- ❌ Manage inquiries

---

## 🟡 PARTY ADMIN (ADMIN_PARTY)

**Manages party/event services and venues**

### ✅ What Party Admin CAN Do:

#### **Venue Management**
- ✅ Access party admin panel (`/admin/party-panel`)
- ✅ Create new venues
- ✅ Edit venue details
- ✅ Delete venues
- ✅ Manage venue pricing
- ✅ Upload venue images
- ✅ Set venue capacity (min/max)
- ✅ Set venue features and amenities
- ✅ Manage venue location details
- ✅ Activate/deactivate venues
- ✅ View all venues

#### **Inquiry Management**
- ✅ View all venue inquiries
- ✅ See inquiry details (name, email, phone, event date, guest count)
- ✅ Update inquiry status:
  - NEW → CONTACTED → QUOTED → BOOKED
  - Or mark as DECLINED
- ✅ Respond to inquiries
- ✅ View pending inquiries count

#### **Regular User Features**
- ✅ All regular user features
- ✅ Browse venues
- ✅ Submit venue inquiries

### ❌ What Party Admin CANNOT Do:

- ❌ Manage products or boutique
- ❌ Manage campaigns or donations
- ❌ Manage news briefs
- ❌ Manage photography
- ❌ View all orders
- ❌ Access user management
- ❌ View platform-wide revenue statistics

---

## 🟠 ASSOCIATION ADMIN (ADMIN_ASSOCIATION)

**Manages charity campaigns and donations**

### ✅ What Association Admin CAN Do:

#### **Campaign Management**
- ✅ Access association admin panel (`/admin/association-panel`)
- ✅ Create new campaigns
- ✅ Edit campaign details
- ✅ Delete campaigns
- ✅ Set campaign goals
- ✅ Update raised amounts
- ✅ Set campaign categories (Environment, Community, Education, Wildlife)
- ✅ Upload campaign images
- ✅ Set campaign impact descriptions
- ✅ Activate/deactivate campaigns
- ✅ View all campaigns

#### **Donation Management**
- ✅ View all donations
- ✅ See donation details (donor, amount, campaign, date)
- ✅ View anonymous donations (marked as anonymous)
- ✅ See total donations raised
- ✅ View donation statistics per campaign

#### **Regular User Features**
- ✅ All regular user features
- ✅ Browse campaigns
- ✅ Make donations

### ❌ What Association Admin CANNOT Do:

- ❌ Manage products or boutique
- ❌ Manage venues or party services
- ❌ Manage news briefs
- ❌ Manage photography
- ❌ View all orders
- ❌ Access user management
- ❌ View platform-wide revenue statistics

---

## 🔵 NEWS ADMIN (ADMIN_NEWS)

**Manages news briefs and content**

### ✅ What News Admin CAN Do:

#### **News Brief Management**
- ✅ Access news admin panel (`/admin/news-panel`)
- ✅ Create new news briefs
- ✅ Edit news briefs
- ✅ Delete news briefs
- ✅ Set news brief titles and summaries
- ✅ Set news regions
- ✅ Manage news topics (tags)
- ✅ Add source URLs
- ✅ View all saved news briefs
- ✅ See which users saved which briefs

#### **Regular User Features**
- ✅ All regular user features
- ✅ Browse news section
- ✅ Save news briefs

### ❌ What News Admin CANNOT Do:

- ❌ Manage products or boutique
- ❌ Manage venues or party services
- ❌ Manage campaigns or donations
- ❌ Manage photography
- ❌ View all orders
- ❌ Access user management
- ❌ View platform-wide statistics

---

## 🟣 PHOTOGRAPHY ADMIN (ADMIN_PHOTOGRAPHY)

**Manages photography portfolio**

### ✅ What Photography Admin CAN Do:

#### **Photography Management**
- ✅ Access photography admin panel (`/admin/photography-panel`)
- ✅ Upload new photos
- ✅ Edit photo details (title, category, description)
- ✅ Delete photos
- ✅ Set featured photos
- ✅ Organize photo order
- ✅ Categorize photos (Cultural, Adventure, Social Media, etc.)

#### **Album Management**
- ✅ Create new albums
- ✅ Edit album details
- ✅ Delete albums
- ✅ Add photos to albums
- ✅ Remove photos from albums
- ✅ Set album cover images
- ✅ Organize photos within albums
- ✅ Set photo orientation (horizontal/vertical)
- ✅ Add album-specific photo descriptions

#### **Regular User Features**
- ✅ All regular user features
- ✅ Browse photography portfolio
- ✅ View albums

### ❌ What Photography Admin CANNOT Do:

- ❌ Manage products or boutique
- ❌ Manage venues or party services
- ❌ Manage campaigns or donations
- ❌ Manage news briefs
- ❌ View all orders
- ❌ Access user management
- ❌ View platform-wide statistics

---

## 📊 PERMISSIONS MATRIX

| Feature | USER | SUPER_ADMIN | ADMIN_BOUTIQUE | ADMIN_PARTY | ADMIN_ASSOCIATION | ADMIN_NEWS | ADMIN_PHOTOGRAPHY |
|---------|------|-------------|----------------|------------|------------------|------------|-------------------|
| **Browse Products** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Purchase Products** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **View Own Orders** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manage Products** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Manage Venues** | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Manage Inquiries** | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Manage Campaigns** | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **View Donations** | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Manage News** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Manage Photography** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **View All Orders** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Manage Users** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **View Statistics** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Access Admin Panel** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔐 ACCESS CONTROL

### Admin Panel Access
- **Route:** `/admin`
- **Required:** Any admin role (not regular USER)
- **Super Admin:** Full access to all tabs
- **Section Admins:** Only see tabs for their section

### API Route Protection
All admin API routes are protected using:
- `requireSectionAccess()` - For section-specific admins
- `requireSuperAdmin()` - For super admin only routes
- `requireAdmin()` - For any admin role

### Example Routes:
- `/api/admin/products` → Requires `ADMIN_BOUTIQUE` or `SUPER_ADMIN`
- `/api/admin/venues` → Requires `ADMIN_PARTY` or `SUPER_ADMIN`
- `/api/admin/campaigns` → Requires `ADMIN_ASSOCIATION` or `SUPER_ADMIN`
- `/api/admin/news` → Requires `ADMIN_NEWS` or `SUPER_ADMIN`
- `/api/admin/photography` → Requires `ADMIN_PHOTOGRAPHY` or `SUPER_ADMIN`
- `/api/admin/users` → Requires `SUPER_ADMIN` only
- `/api/admin/orders` → Requires `SUPER_ADMIN` only

---

## 🎯 SUMMARY

1. **USER** - Regular customers who can shop, browse, and make inquiries
2. **SUPER_ADMIN** - Full platform access, can manage everything
3. **ADMIN_BOUTIQUE** - Manages products and e-commerce
4. **ADMIN_PARTY** - Manages venues and event inquiries
5. **ADMIN_ASSOCIATION** - Manages charity campaigns and donations
6. **ADMIN_NEWS** - Manages news briefs
7. **ADMIN_PHOTOGRAPHY** - Manages photography portfolio

Each section admin has focused control over their specific area, while Super Admin has oversight of everything.

---

*Last Updated: Based on current codebase analysis*


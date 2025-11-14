"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Heart,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Camera,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  products: number;
  venues: number;
  campaigns: number;
  orders: number;
  users: number;
  donations: number;
  totalRevenue: number;
  pendingInquiries: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    venues: 0,
    campaigns: 0,
    orders: 0,
    users: 0,
    donations: 0,
    totalRevenue: 0,
    pendingInquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "venues" | "campaigns" | "orders" | "users">("overview");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      color: "sage",
      href: "#products",
    },
    {
      title: "Venues",
      value: stats.venues,
      icon: MapPin,
      color: "amber",
      href: "#venues",
    },
    {
      title: "Campaigns",
      value: stats.campaigns,
      icon: Heart,
      color: "coral",
      href: "#campaigns",
    },
    {
      title: "Orders",
      value: stats.orders,
      icon: ShoppingBag,
      color: "gold",
      href: "#orders",
    },
    {
      title: "Users",
      value: stats.users,
      icon: Users,
      color: "sky",
      href: "#users",
    },
    {
      title: "Donations",
      value: stats.donations,
      icon: DollarSign,
      color: "forest",
      href: "#donations",
    },
    {
      title: "Revenue",
      value: `€${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "sage",
      href: "#revenue",
    },
    {
      title: "Pending Inquiries",
      value: stats.pendingInquiries,
      icon: Calendar,
      color: "amber",
      href: "#inquiries",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string }> = {
      sage: { bg: "bg-sage/10", text: "text-sage", hover: "hover:bg-sage/20" },
      amber: { bg: "bg-amber/10", text: "text-amber", hover: "hover:bg-amber/20" },
      coral: { bg: "bg-coral/10", text: "text-coral", hover: "hover:bg-coral/20" },
      gold: { bg: "bg-gold/10", text: "text-gold", hover: "hover:bg-gold/20" },
      sky: { bg: "bg-sky/10", text: "text-sky", hover: "hover:bg-sky/20" },
      forest: { bg: "bg-forest/10", text: "text-forest", hover: "hover:bg-forest/20" },
    };
    return colors[color] || colors.sage;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-sage/5">
      {/* Header */}
      <header className="bg-white border-b border-sage/10 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-charcoal">Admin Control Panel</h1>
              <p className="text-charcoal/60 mt-1">Manage your ISHK platform</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-charcoal/70 hover:text-charcoal transition-colors flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </button>
              <button className="px-4 py-2 text-coral hover:text-coral/80 transition-colors flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage/10 p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview", icon: Eye },
              { id: "products", label: "Products", icon: Package },
              { id: "venues", label: "Venues", icon: MapPin },
              { id: "campaigns", label: "Campaigns", icon: Heart },
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "users", label: "Users", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-sage text-white shadow-md"
                      : "text-charcoal/70 hover:bg-sage/10 hover:text-sage"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                const colors = getColorClasses(stat.color);
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center`}>
                        <Icon className={`w-7 h-7 ${colors.text}`} />
                      </div>
                      <button
                        onClick={() => setActiveTab(stat.href.replace("#", "") as any)}
                        className="text-charcoal/40 hover:text-sage transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                    <h3 className="text-2xl font-bold text-charcoal mb-1">{stat.value}</h3>
                    <p className="text-charcoal/60 text-sm">{stat.title}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
              <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  href="/admin/products/new"
                  className="flex items-center gap-3 p-4 bg-sage/10 hover:bg-sage/20 rounded-xl transition-colors group"
                >
                  <div className="w-12 h-12 bg-sage rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal group-hover:text-sage transition-colors">Add Product</h3>
                    <p className="text-sm text-charcoal/60">Create a new boutique item</p>
                  </div>
                </Link>
                <Link
                  href="/admin/venues/new"
                  className="flex items-center gap-3 p-4 bg-amber/10 hover:bg-amber/20 rounded-xl transition-colors group"
                >
                  <div className="w-12 h-12 bg-amber rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal group-hover:text-amber transition-colors">Add Venue</h3>
                    <p className="text-sm text-charcoal/60">Add a new party venue</p>
                  </div>
                </Link>
                <Link
                  href="/admin/campaigns/new"
                  className="flex items-center gap-3 p-4 bg-coral/10 hover:bg-coral/20 rounded-xl transition-colors group"
                >
                  <div className="w-12 h-12 bg-coral rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal group-hover:text-coral transition-colors">New Campaign</h3>
                    <p className="text-sm text-charcoal/60">Launch a new cause</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-charcoal">Products Management</h2>
              <Link
                href="/admin/products/new"
                className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </Link>
            </div>
            <ProductsManager />
          </div>
        )}

        {/* Venues Tab */}
        {activeTab === "venues" && (
          <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-charcoal">Venues Management</h2>
              <Link
                href="/admin/venues/new"
                className="px-6 py-3 bg-amber text-white rounded-xl font-medium hover:bg-amber/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Venue
              </Link>
            </div>
            <VenuesManager />
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-charcoal">Campaigns Management</h2>
              <Link
                href="/admin/campaigns/new"
                className="px-6 py-3 bg-coral text-white rounded-xl font-medium hover:bg-coral/90 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Campaign
              </Link>
            </div>
            <CampaignsManager />
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">Orders Management</h2>
            <OrdersManager />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">Users Management</h2>
            <UsersManager />
          </div>
        )}
      </div>
    </div>
  );
}

// Products Manager Component
function ProductsManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-charcoal/60">Loading products...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-sage/10">
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Price</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Stock</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Status</th>
            <th className="text-right py-3 px-4 font-semibold text-charcoal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-12 text-charcoal/60">
                No products found. Create your first product!
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="border-b border-sage/5 hover:bg-sage/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="font-medium text-charcoal">{product.name}</div>
                  <div className="text-sm text-charcoal/60">{product.category}</div>
                </td>
                <td className="py-4 px-4 text-charcoal">€{product.price}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${product.inStock ? "bg-sage/10 text-sage" : "bg-coral/10 text-coral"}`}>
                    {product.stockCount} in stock
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${product.featured ? "bg-gold/10 text-gold" : "bg-charcoal/10 text-charcoal/60"}`}>
                    {product.featured ? "Featured" : "Regular"}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-sage hover:bg-sage/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Venues Manager Component
function VenuesManager() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch("/api/admin/venues");
      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-charcoal/60">Loading venues...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-sage/10">
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Location</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Capacity</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Price</th>
            <th className="text-right py-3 px-4 font-semibold text-charcoal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {venues.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-12 text-charcoal/60">
                No venues found. Add your first venue!
              </td>
            </tr>
          ) : (
            venues.map((venue) => (
              <tr key={venue.id} className="border-b border-sage/5 hover:bg-sage/5 transition-colors">
                <td className="py-4 px-4 font-medium text-charcoal">{venue.name}</td>
                <td className="py-4 px-4 text-charcoal/70">{venue.city}, {venue.country}</td>
                <td className="py-4 px-4 text-charcoal/70">{venue.capacity}</td>
                <td className="py-4 px-4 text-charcoal">€{venue.price}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-amber hover:bg-amber/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Campaigns Manager Component
function CampaignsManager() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/admin/campaigns");
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-charcoal/60">Loading campaigns...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-sage/10">
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Title</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Category</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Progress</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Status</th>
            <th className="text-right py-3 px-4 font-semibold text-charcoal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-12 text-charcoal/60">
                No campaigns found. Create your first campaign!
              </td>
            </tr>
          ) : (
            campaigns.map((campaign) => {
              const progress = (campaign.raised / campaign.goal) * 100;
              return (
                <tr key={campaign.id} className="border-b border-sage/5 hover:bg-sage/5 transition-colors">
                  <td className="py-4 px-4 font-medium text-charcoal">{campaign.title}</td>
                  <td className="py-4 px-4 text-charcoal/70">{campaign.category}</td>
                  <td className="py-4 px-4">
                    <div className="w-32">
                      <div className="flex justify-between text-xs text-charcoal/60 mb-1">
                        <span>€{campaign.raised}</span>
                        <span>€{campaign.goal}</span>
                      </div>
                      <div className="h-2 bg-sage/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-coral transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${campaign.isActive ? "bg-sage/10 text-sage" : "bg-charcoal/10 text-charcoal/60"}`}>
                      {campaign.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// Orders Manager Component
function OrdersManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-charcoal/60">Loading orders...</div>;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-amber/10 text-amber",
      PROCESSING: "bg-sky/10 text-sky",
      SHIPPED: "bg-sage/10 text-sage",
      DELIVERED: "bg-forest/10 text-forest",
      CANCELLED: "bg-charcoal/10 text-charcoal/60",
      REFUNDED: "bg-coral/10 text-coral",
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-sage/10">
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Order #</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Customer</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Total</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Date</th>
            <th className="text-right py-3 px-4 font-semibold text-charcoal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-12 text-charcoal/60">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="border-b border-sage/5 hover:bg-sage/5 transition-colors">
                <td className="py-4 px-4 font-medium text-charcoal">{order.orderNumber}</td>
                <td className="py-4 px-4 text-charcoal/70">{order.user?.email || "Guest"}</td>
                <td className="py-4 px-4 font-semibold text-charcoal">€{order.total}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-charcoal/70">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-sage hover:bg-sage/10 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-amber hover:bg-amber/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Users Manager Component
function UsersManager() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-charcoal/60">Loading users...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-sage/10">
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Joined</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Orders</th>
            <th className="text-right py-3 px-4 font-semibold text-charcoal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-12 text-charcoal/60">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-b border-sage/5 hover:bg-sage/5 transition-colors">
                <td className="py-4 px-4 font-medium text-charcoal">{user.name || "No name"}</td>
                <td className="py-4 px-4 text-charcoal/70">{user.email}</td>
                <td className="py-4 px-4 text-charcoal/70">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-charcoal">{user.orders?.length || 0}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-sage hover:bg-sage/10 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


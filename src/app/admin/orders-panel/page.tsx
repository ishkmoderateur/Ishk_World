"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, ArrowLeft, Search, Eye, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";

export default function OrdersPanel() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    status: "PENDING" as OrderStatus,
    trackingNumber: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setError("");
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch orders" }));
        setError(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: formData.status,
          trackingNumber: formData.trackingNumber || undefined,
        }),
      });

      if (response.ok) {
        setSuccess("Order updated successfully!");
        fetchOrders();
        setTimeout(() => {
          setShowDetails(false);
          setSuccess("");
        }, 2000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Failed to update order");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      setError("An error occurred while updating the order");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchOrders();
        if (selectedOrder?.id === id) {
          setShowDetails(false);
        }
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("An error occurred while deleting the order");
    }
  };

  const handleViewDetails = async (order: any) => {
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data);
        setFormData({
          status: data.status,
          trackingNumber: data.trackingNumber || "",
        });
        setShowDetails(true);
      } else {
        setError("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("An error occurred while fetching order details");
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      PENDING: "bg-amber/10 text-amber",
      PROCESSING: "bg-blue/10 text-blue",
      SHIPPED: "bg-purple/10 text-purple",
      DELIVERED: "bg-sage/10 text-sage",
      CANCELLED: "bg-coral/10 text-coral",
      REFUNDED: "bg-gray/10 text-gray",
    };
    return colors[status] || "bg-gray/10 text-gray";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-charcoal/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-sage/10 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 text-charcoal/70 hover:text-charcoal transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-display font-bold text-charcoal flex items-center gap-3">
                  <Package className="w-8 h-8" />
                  Orders Management
                </h1>
                <p className="text-charcoal/60 mt-1">Manage customer orders</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {showDetails && selectedOrder && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-charcoal">
                Order Details: {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-charcoal/60 hover:text-charcoal"
              >
                ×
              </button>
            </div>
            {error && (
              <div className="mb-4 p-4 bg-coral/10 border border-coral/20 rounded-xl text-coral">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-sage/10 border border-sage/20 rounded-xl text-sage">
                {success}
              </div>
            )}

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-charcoal mb-2">Customer Information</h3>
                <div className="space-y-1 text-sm text-charcoal/60">
                  <p><strong>Name:</strong> {selectedOrder.user?.name || "—"}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email || "—"}</p>
                  <p><strong>Phone:</strong> {selectedOrder.user?.phone || "—"}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-charcoal mb-2">Order Information</h3>
                <div className="space-y-1 text-sm text-charcoal/60">
                  <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-charcoal mb-2">Order Items</h3>
              <div className="border border-sage/20 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-sage/5">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-charcoal">Product</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-charcoal">Quantity</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-charcoal">Price</th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-charcoal">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage/10">
                    {selectedOrder.orderItems?.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-charcoal">{item.product?.name || "—"}</td>
                        <td className="px-4 py-2 text-sm text-charcoal/60">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-charcoal/60 text-right">€{item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-charcoal text-right">€{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-charcoal mb-2">Order Totals</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Subtotal:</span>
                  <span className="text-charcoal">€{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Shipping:</span>
                  <span className="text-charcoal">€{selectedOrder.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Tax:</span>
                  <span className="text-charcoal">€{selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-sage/20">
                  <span className="text-charcoal">Total:</span>
                  <span className="text-sage">€{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Order Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="Enter tracking number"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleStatusUpdate(selectedOrder.id)}
                  className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors"
                >
                  Update Order
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-3 border border-sage/20 rounded-xl font-medium text-charcoal hover:bg-sage/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl border border-sage/10 shadow-sm">
          <div className="p-6 border-b border-sage/10">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search by order number, customer email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>

          {error && !showDetails && (
            <div className="p-4 m-6 bg-coral/10 border border-coral/20 rounded-xl text-coral">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sage/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Order #</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-charcoal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-charcoal/60">
                      {searchTerm || statusFilter !== "all" ? "No orders found matching your filters" : "No orders found"}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-sage/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-charcoal">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-charcoal">
                        <div>
                          <div>{order.user?.name || "—"}</div>
                          <div className="text-xs text-charcoal/60">{order.user?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-charcoal">€{order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-charcoal/60">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="p-2 text-sage hover:bg-sage/10 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors"
                            title="Delete order"
                          >
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
        </div>
      </div>
    </div>
  );
}






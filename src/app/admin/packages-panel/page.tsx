"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Gift, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function PackagesPanel() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    currency: "EUR",
    credits: "0",
    bonusCredits: "0",
    features: [] as string[],
    image: "",
    isVisible: true,
    isActive: true,
    featured: false,
    order: "0",
  });
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setError("");
      const response = await fetch("/api/admin/packages");
      if (response.ok) {
        const data = await response.json();
        setPackages(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch packages" }));
        setError(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      setError("Failed to fetch packages. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.slug || formData.price === "") {
      setError("Title, slug, and price are required");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      setError("Price must be a positive number");
      return;
    }

    try {
      const url = editing ? `/api/admin/packages/${editing.id}` : "/api/admin/packages";
      const method = editing ? "PUT" : "POST";

      const payload = {
        ...formData,
        price: price,
        credits: parseInt(formData.credits) || 0,
        bonusCredits: parseInt(formData.bonusCredits) || 0,
        order: parseInt(formData.order) || 0,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(editing ? "Package updated successfully!" : "Package created successfully!");
        fetchPackages();
        setTimeout(() => {
          resetForm();
          setSuccess("");
        }, 2000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || `Failed to ${editing ? "update" : "create"} package`);
      }
    } catch (error) {
      console.error("Error saving package:", error);
      setError("An error occurred while saving the package");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchPackages();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      setError("An error occurred while deleting the package");
    }
  };

  const handleEdit = (packageData: any) => {
    setEditing(packageData);
    const features = Array.isArray(packageData.features) ? packageData.features : [];
    setFormData({
      title: packageData.title,
      slug: packageData.slug,
      description: packageData.description,
      price: packageData.price.toString(),
      currency: packageData.currency || "EUR",
      credits: packageData.credits?.toString() || "0",
      bonusCredits: packageData.bonusCredits?.toString() || "0",
      features: features,
      image: packageData.image || "",
      isVisible: packageData.isVisible !== undefined ? packageData.isVisible : true,
      isActive: packageData.isActive !== undefined ? packageData.isActive : true,
      featured: packageData.featured || false,
      order: packageData.order?.toString() || "0",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      price: "",
      currency: "EUR",
      credits: "0",
      bonusCredits: "0",
      features: [],
      image: "",
      isVisible: true,
      isActive: true,
      featured: false,
      order: "0",
    });
    setEditing(null);
    setShowForm(false);
    setNewFeature("");
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const filteredPackages = packages.filter((packageData) =>
    packageData.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    packageData.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Link href="/admin" className="p-2 text-charcoal/70 hover:text-charcoal transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-display font-bold text-charcoal flex items-center gap-3">
                  <Gift className="w-8 h-8" />
                  Packages Management
                </h1>
                <p className="text-charcoal/60 mt-1">Manage packages and credit bundles</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {showForm ? "Cancel" : "Add Package"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm mb-8"
          >
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
              {editing ? "Edit Package" : "Create Package"}
            </h2>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const newSlug = formData.slug === "" || formData.slug === formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
                        : formData.slug;
                      setFormData({ ...formData, title, slug: newSlug });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
                      setFormData({ ...formData, slug });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Credits</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Bonus Credits</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bonusCredits}
                    onChange={(e) => setFormData({ ...formData, bonusCredits: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-2 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    placeholder="Add a feature"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-sage text-white rounded-xl hover:bg-sage/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-sage/10 text-sage rounded-lg text-sm flex items-center gap-2"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="hover:text-coral"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-4 h-4 text-sage rounded focus:ring-sage"
                  />
                  <span className="text-sm text-charcoal">Visible</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-sage rounded focus:ring-sage"
                  />
                  <span className="text-sm text-charcoal">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-sage rounded focus:ring-sage"
                  />
                  <span className="text-sm text-charcoal">Featured</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors"
                >
                  {editing ? "Update Package" : "Create Package"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-sage/20 rounded-xl font-medium text-charcoal hover:bg-sage/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl border border-sage/10 shadow-sm">
          <div className="p-6 border-b border-sage/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
              />
            </div>
          </div>

          {error && !showForm && (
            <div className="p-4 m-6 bg-coral/10 border border-coral/20 rounded-xl text-coral">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sage/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Credits</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-charcoal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-charcoal/60">
                      {searchTerm ? "No packages found" : "No packages found"}
                    </td>
                  </tr>
                ) : (
                  filteredPackages.map((packageData) => (
                    <tr key={packageData.id} className="hover:bg-sage/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-charcoal">
                        <div>
                          <div className="font-medium">{packageData.title}</div>
                          {packageData.featured && (
                            <span className="text-xs text-sage">Featured</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal">
                        {packageData.currency} {packageData.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal/60">
                        {packageData.credits} {packageData.bonusCredits > 0 && `+ ${packageData.bonusCredits} bonus`}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          {packageData.isVisible && (
                            <span className="px-2 py-1 bg-sage/10 text-sage rounded-lg text-xs font-medium">
                              Visible
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            packageData.isActive ? "bg-sage/10 text-sage" : "bg-gray/10 text-gray"
                          }`}>
                            {packageData.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(packageData)}
                            className="p-2 text-sage hover:bg-sage/10 rounded-lg transition-colors"
                            title="Edit package"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(packageData.id)}
                            className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors"
                            title="Delete package"
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



"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MediaUpload from "@/components/media-upload";
import PriceInput from "@/components/price-input";

export default function BoutiquePanel() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    category: "",
    isIshkOriginal: false,
    images: [] as string[],
    videos: [] as string[],
    inStock: true,
    stockCount: "",
    badge: "",
    featured: false,
  });

  useEffect(() => {
    fetchProducts();
    // Check if we should open the form (from "Add Product" button)
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') === 'true' || params.get('add') === 'true') {
      setShowForm(true);
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setError("");
      const response = await fetch("/api/admin/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch products" }));
        setError(errorData.error || `Error ${response.status}: ${response.statusText}`);
        console.error("Error fetching products:", errorData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setSuccess("");
    
    if (process.env.NODE_ENV === "development") {
      console.log("Form submission started", { formData });
    }
    
    try {
      const url = editing
        ? `/api/admin/products/${editing.id}`
        : "/api/admin/products";
      const method = editing ? "PUT" : "POST";

      // Validate images (min 1, max 10)
      if (formData.images.length < 1) {
        setError("At least 1 image is required");
        return;
      }
      if (formData.images.length > 10) {
        setError("Maximum 10 images allowed");
        return;
      }
      if (formData.videos.length > 2) {
        setError("Maximum 2 videos allowed");
        return;
      }

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stockCount: parseInt(formData.stockCount) || 0,
        images: formData.images,
        videos: formData.videos.length > 0 ? formData.videos : null,
      };

      if (process.env.NODE_ENV === "development") {
        console.log("Payload being sent:", {
          ...payload,
          images: payload.images?.length,
          videos: payload.videos?.length,
          imagePreview: payload.images?.[0]?.substring(0, 50) + "...",
        });
      }

      let response;
      try {
        response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (process.env.NODE_ENV === "development") {
          console.log("Response status:", response.status, response.statusText);
        }
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        setError("Network error: Failed to connect to server");
        return;
      }

      if (response.ok) {
        setSuccess(editing ? "Product updated successfully!" : "Product created successfully!");
        fetchProducts();
        setTimeout(() => {
          resetForm();
          setSuccess("");
        }, 2000);
      } else {
        let errorMessage = `Failed to save product (${response.status})`;
        try {
          const data = await response.json();
          console.error("Product creation error response:", data);
          errorMessage = data.error || data.message || errorMessage;
          if (data.details && process.env.NODE_ENV === "development") {
            console.error("Error details:", data.details);
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          const text = await response.text().catch(() => "");
          console.error("Response text:", text);
          errorMessage = text || errorMessage;
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setError("An error occurred while saving the product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product: any) => {
    setEditing(product);
    const images = Array.isArray(product.images) ? product.images : [];
    const videos = Array.isArray(product.videos) ? product.videos : [];
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || "",
      category: product.category,
      isIshkOriginal: product.isIshkOriginal,
      images: images,
      videos: videos,
      inStock: product.inStock,
      stockCount: product.stockCount.toString(),
      badge: product.badge || "",
      featured: product.featured,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      comparePrice: "",
      category: "",
      isIshkOriginal: false,
      images: [],
      videos: [],
      inStock: true,
      stockCount: "",
      badge: "",
      featured: false,
    });
    setEditing(null);
    setShowForm(false);
  };

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
                  <ShoppingBag className="w-8 h-8" />
                  Boutique Panel
                </h1>
                <p className="text-charcoal/60 mt-1">Manage products and inventory</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {showForm ? "Cancel" : "Add Product"}
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
              {editing ? "Edit Product" : "Create Product"}
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
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      // Auto-generate slug from name if slug is empty or matches previous name
                      const newSlug = formData.slug === "" || formData.slug === formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                        ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
                        : formData.slug;
                      setFormData({ ...formData, name, slug: newSlug });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Slug * <span className="text-xs text-charcoal/60 font-normal">(auto-generated, can edit)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
                      setFormData({ ...formData, slug });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                    placeholder="product-slug"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <PriceInput
                    price={formData.price}
                    comparePrice={formData.comparePrice}
                    onPriceChange={(price) => setFormData({ ...formData, price })}
                    onComparePriceChange={(comparePrice) => setFormData({ ...formData, comparePrice })}
                    label="Product Price"
                    currency="EUR"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  />
                </div>
              </div>
              <MediaUpload
                images={formData.images}
                videos={formData.videos}
                onImagesChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                onVideosChange={(videos) => setFormData((prev) => ({ ...prev, videos }))}
                maxImages={10}
                maxVideos={2}
                minImages={1}
                label="Product Media"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Stock Count
                  </label>
                  <input
                    type="number"
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Bestseller, New, etc."
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-5 h-5 rounded border-sage/20 text-sage focus:ring-sage"
                  />
                  <span className="text-sm font-medium text-charcoal">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isIshkOriginal}
                    onChange={(e) => setFormData({ ...formData, isIshkOriginal: e.target.checked })}
                    className="w-5 h-5 rounded border-sage/20 text-sage focus:ring-sage"
                  />
                  <span className="text-sm font-medium text-charcoal">Ishk Original</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-sage/20 text-sage focus:ring-sage"
                  />
                  <span className="text-sm font-medium text-charcoal">Featured</span>
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                  className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors"
                >
                  {editing ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-sage/20 text-charcoal rounded-xl font-medium hover:bg-sage/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
          <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
            Products ({products.length})
          </h2>
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
                    <tr
                      key={product.id}
                      className="border-b border-sage/5 hover:bg-sage/5 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-charcoal">{product.name}</td>
                      <td className="py-4 px-4 text-charcoal">€{product.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-charcoal">{product.stockCount}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs ${
                            product.inStock
                              ? "bg-sage/20 text-sage"
                              : "bg-coral/20 text-coral"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-amber hover:bg-amber/10 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors"
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


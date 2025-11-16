"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PartyPanel() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    location: "",
    city: "",
    country: "",
    address: "",
    capacity: "",
    minCapacity: "",
    maxCapacity: "",
    price: "",
    currency: "EUR",
    images: [] as string[],
    features: [] as string[],
    isActive: true,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/admin/venues/${editing.id}` : "/api/admin/venues";
      const method = editing ? "PUT" : "POST";

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        minCapacity: parseInt(formData.minCapacity) || 0,
        maxCapacity: parseInt(formData.maxCapacity) || 0,
        images: formData.images,
        features: formData.features,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchVenues();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving venue:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;
    try {
      const response = await fetch(`/api/admin/venues/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchVenues();
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
    }
  };

  const handleEdit = (venue: any) => {
    setEditing(venue);
    const images = Array.isArray(venue.images) ? venue.images : [];
    const features = Array.isArray(venue.features) ? venue.features : [];
    setFormData({
      name: venue.name,
      slug: venue.slug,
      description: venue.description,
      location: venue.location,
      city: venue.city,
      country: venue.country,
      address: venue.address,
      capacity: venue.capacity,
      minCapacity: venue.minCapacity.toString(),
      maxCapacity: venue.maxCapacity.toString(),
      price: venue.price.toString(),
      currency: venue.currency,
      images: images,
      features: features,
      isActive: venue.isActive,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      location: "",
      city: "",
      country: "",
      address: "",
      capacity: "",
      minCapacity: "",
      maxCapacity: "",
      price: "",
      currency: "EUR",
      images: [],
      features: [],
      isActive: true,
    });
    setEditing(null);
    setShowForm(false);
  };

  const addItem = (type: "image" | "feature") => {
    const value = prompt(`Enter ${type === "image" ? "image URL" : "feature"}:`);
    if (value) {
      if (type === "image") {
        setFormData({ ...formData, images: [...formData.images, value] });
      } else {
        setFormData({ ...formData, features: [...formData.features, value] });
      }
    }
  };

  const removeItem = (type: "image" | "feature", index: number) => {
    if (type === "image") {
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index),
      });
    } else {
      setFormData({
        ...formData,
        features: formData.features.filter((_, i) => i !== index),
      });
    }
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
                  <MapPin className="w-8 h-8" />
                  Party Panel
                </h1>
                <p className="text-charcoal/60 mt-1">Manage party venues</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-amber text-white rounded-xl font-medium hover:bg-amber/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {showForm ? "Cancel" : "Add Venue"}
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
              {editing ? "Edit Venue" : "Create Venue"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Price (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Min Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.minCapacity}
                    onChange={(e) => setFormData({ ...formData, minCapacity: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Images
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-sage/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem("image", index)}
                        className="absolute -top-2 -right-2 bg-coral text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addItem("image")}
                  className="px-4 py-2 border border-sage/20 rounded-lg text-sm text-charcoal/70 hover:bg-sage/10"
                >
                  + Add Image URL
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Features
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-amber/20 text-amber rounded-lg text-sm flex items-center gap-2"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeItem("feature", index)}
                        className="hover:text-coral"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addItem("feature")}
                  className="px-4 py-2 border border-sage/20 rounded-lg text-sm text-charcoal/70 hover:bg-sage/10"
                >
                  + Add Feature
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-sage/20 text-sage focus:ring-sage"
                  />
                  <span className="text-sm font-medium text-charcoal">Active</span>
                </label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber text-white rounded-xl font-medium hover:bg-amber/90 transition-colors"
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
            Venues ({venues.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sage/10">
                  <th className="text-left py-3 px-4 font-semibold text-charcoal">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-charcoal">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-charcoal">Capacity</th>
                  <th className="text-left py-3 px-4 font-semibold text-charcoal">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-charcoal">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-charcoal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {venues.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-charcoal/60">
                      No venues found. Create your first venue!
                    </td>
                  </tr>
                ) : (
                  venues.map((venue) => (
                    <tr
                      key={venue.id}
                      className="border-b border-sage/5 hover:bg-sage/5 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-charcoal">{venue.name}</td>
                      <td className="py-4 px-4 text-charcoal/70">
                        {venue.city}, {venue.country}
                      </td>
                      <td className="py-4 px-4 text-charcoal">
                        {venue.minCapacity}-{venue.maxCapacity}
                      </td>
                      <td className="py-4 px-4 text-charcoal">€{venue.price.toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs ${
                            venue.isActive
                              ? "bg-sage/20 text-sage"
                              : "bg-coral/20 text-coral"
                          }`}
                        >
                          {venue.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(venue)}
                            className="p-2 text-amber hover:bg-amber/10 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(venue.id)}
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





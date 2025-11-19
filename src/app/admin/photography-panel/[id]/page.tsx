"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Save, X, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditPhotographyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    description: "",
    featured: false,
    order: 0,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (id) {
      fetchPhoto();
    }
  }, [id]);

  const fetchPhoto = async () => {
    try {
      const response = await fetch(`/api/admin/photography/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPhoto(data);
        setFormData({
          title: data.title || "",
          category: data.category || "",
          image: data.image || "",
          description: data.description || "",
          featured: data.featured || false,
          order: data.order || 0,
        });
        setImagePreview(data.image || "");
      }
    } catch (error) {
      console.error("Error fetching photo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/photography/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/photography-panel");
      } else {
        alert("Failed to update photo");
      }
    } catch (error) {
      console.error("Error updating photo:", error);
      alert("Error updating photo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-charcoal/60">Loading...</div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-charcoal/60 mb-4">Photo not found</p>
          <Link
            href="/admin/photography-panel"
            className="text-sage hover:text-sage/80"
          >
            Back to Photography Panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-sage/10 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/photography-panel"
              className="p-2 text-charcoal/70 hover:text-charcoal transition-colors rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-display font-bold text-charcoal">
                Edit Photo
              </h1>
              <p className="text-sm text-charcoal/60 mt-1">
                Update photo details and image
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Image Preview & Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm">
              <h2 className="text-xl font-heading font-semibold text-charcoal mb-4">
                Image
              </h2>
              
              {/* Image Preview */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-dashed border-sage/30 bg-gray-50 mb-4">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt={formData.title || "Preview"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-charcoal/20" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="w-full px-6 py-4 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-5 h-5" />
                  Upload New Image
                </div>
              </label>

              {/* Image URL Input (Alternative) */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Or enter image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="/photography/image.jpg"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form Fields */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm">
              <h2 className="text-xl font-heading font-semibold text-charcoal mb-6">
                Details
              </h2>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    rows={6}
                    placeholder="Add a description for this photo..."
                  />
                </div>

                {/* Featured & Order */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            featured: e.target.checked,
                          })
                        }
                        className="w-5 h-5 rounded border-sage/20 text-sage focus:ring-sage"
                      />
                      <span className="text-sm font-medium text-charcoal">
                        Featured
                      </span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-4 bg-gold text-white rounded-xl font-medium hover:bg-gold/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              <Link
                href="/admin/photography-panel"
                className="px-6 py-4 border border-sage/20 text-charcoal rounded-xl font-medium hover:bg-sage/10 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </Link>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
}




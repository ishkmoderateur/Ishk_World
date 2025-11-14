"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AssociationPanel() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    goal: "",
    image: "",
    impact: "",
    isActive: true,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing
        ? `/api/admin/campaigns/${editing.id}`
        : "/api/admin/campaigns";
      const method = editing ? "PUT" : "POST";

      const payload = {
        ...formData,
        goal: parseFloat(formData.goal),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchCampaigns();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving campaign:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const response = await fetch(`/api/admin/campaigns/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
    }
  };

  const handleEdit = (campaign: any) => {
    setEditing(campaign);
    setFormData({
      title: campaign.title,
      slug: campaign.slug,
      description: campaign.description,
      category: campaign.category,
      goal: campaign.goal.toString(),
      image: campaign.image || "",
      impact: campaign.impact || "",
      isActive: campaign.isActive,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      category: "",
      goal: "",
      image: "",
      impact: "",
      isActive: true,
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
                  <Heart className="w-8 h-8" />
                  Association Panel
                </h1>
                <p className="text-charcoal/60 mt-1">Manage charity campaigns</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-coral text-white rounded-xl font-medium hover:bg-coral/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {showForm ? "Cancel" : "New Campaign"}
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
              {editing ? "Edit Campaign" : "Create Campaign"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Environment">Environment</option>
                    <option value="Community">Community</option>
                    <option value="Education">Education</option>
                    <option value="Wildlife">Wildlife</option>
                    <option value="Health">Health</option>
                    <option value="Culture">Culture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Goal (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Impact (optional)
                </label>
                <input
                  type="text"
                  value={formData.impact}
                  onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                  placeholder="🌳 7,500 trees planted"
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                />
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
                  className="px-6 py-3 bg-coral text-white rounded-xl font-medium hover:bg-coral/90 transition-colors"
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
            Campaigns ({campaigns.length})
          </h2>
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
                      <tr
                        key={campaign.id}
                        className="border-b border-sage/5 hover:bg-sage/5 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-charcoal">{campaign.title}</td>
                        <td className="py-4 px-4 text-charcoal/70">{campaign.category}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-sage/10 rounded-full h-2">
                              <div
                                className="bg-sage h-2 rounded-full"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-charcoal/70">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs ${
                              campaign.isActive
                                ? "bg-sage/20 text-sage"
                                : "bg-coral/20 text-coral"
                            }`}
                          >
                            {campaign.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(campaign)}
                              className="p-2 text-amber hover:bg-amber/10 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(campaign.id)}
                              className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors"
                            >
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
        </div>
      </div>
    </div>
  );
}


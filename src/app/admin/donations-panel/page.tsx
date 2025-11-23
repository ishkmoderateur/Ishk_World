"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Heart, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import MediaUpload from "@/components/media-upload";

export default function DonationsPanel() {
  const [donations, setDonations] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    userId: "",
    campaignId: "",
    amount: "",
    currency: "EUR",
    anonymous: false,
    message: "",
    images: [] as string[],
    videos: [] as string[],
  });

  useEffect(() => {
    fetchDonations();
    fetchCampaigns();
    fetchUsers();
  }, []);

  const fetchDonations = async () => {
    try {
      setError("");
      const response = await fetch("/api/admin/donations");
      if (response.ok) {
        const data = await response.json();
        setDonations(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch donations" }));
        setError(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
      setError("Failed to fetch donations. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/admin/campaigns");
      if (response.ok) {
        const data = await response.json();
        setCampaigns(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setSuccess("");

    // Validate required fields
    if (!formData.campaignId || !formData.amount) {
      setError("Campaign and amount are required");
      return;
    }

    // Validate amount
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    // Validate images/videos
    if (formData.images.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }
    if (formData.videos.length > 2) {
      setError("Maximum 2 videos allowed");
      return;
    }

    try {
      const url = editing ? `/api/admin/donations/${editing.id}` : "/api/admin/donations";
      const method = editing ? "PUT" : "POST";

      const payload = {
        userId: formData.userId || null,
        campaignId: formData.campaignId,
        amount: amount,
        currency: formData.currency,
        anonymous: formData.anonymous,
        message: formData.message || null,
        images: formData.images.length > 0 ? formData.images : null,
        videos: formData.videos.length > 0 ? formData.videos : null,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(editing ? "Donation updated successfully!" : "Donation created successfully!");
        fetchDonations();
        setTimeout(() => {
          resetForm();
          setSuccess("");
        }, 2000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || `Failed to ${editing ? "update" : "create"} donation`);
      }
    } catch (error) {
      console.error("Error saving donation:", error);
      setError("An error occurred while saving the donation");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donation?")) return;
    try {
      const response = await fetch(`/api/admin/donations/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchDonations();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Failed to delete donation");
      }
    } catch (error) {
      console.error("Error deleting donation:", error);
      setError("An error occurred while deleting the donation");
    }
  };

  const handleEdit = (donation: any) => {
    setEditing(donation);
    const images = Array.isArray(donation.images) ? donation.images : [];
    const videos = Array.isArray(donation.videos) ? donation.videos : [];
    setFormData({
      userId: donation.userId || "",
      campaignId: donation.campaignId,
      amount: donation.amount.toString(),
      currency: donation.currency || "EUR",
      anonymous: donation.anonymous || false,
      message: donation.message || "",
      images: images,
      videos: videos,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      userId: "",
      campaignId: "",
      amount: "",
      currency: "EUR",
      anonymous: false,
      message: "",
      images: [],
      videos: [],
    });
    setEditing(null);
    setShowForm(false);
  };

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.campaign?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.amount?.toString().includes(searchTerm);
    const matchesCampaign = campaignFilter === "all" || donation.campaignId === campaignFilter;
    return matchesSearch && matchesCampaign;
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
                  <Heart className="w-8 h-8" />
                  Donations Management
                </h1>
                <p className="text-charcoal/60 mt-1">Manage donations and contributions</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {showForm ? "Cancel" : "Add Donation"}
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
              {editing ? "Edit Donation" : "Create Donation"}
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
                    Campaign *
                  </label>
                  <select
                    value={formData.campaignId}
                    onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  >
                    <option value="">Select a campaign</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.id} value={campaign.id}>
                        {campaign.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    User (Optional)
                  </label>
                  <select
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  >
                    <option value="">Anonymous / No user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Currency
                  </label>
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
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                  className="w-4 h-4 text-sage rounded focus:ring-sage"
                />
                <label htmlFor="anonymous" className="text-sm text-charcoal">
                  Anonymous donation
                </label>
              </div>
              <MediaUpload
                images={formData.images}
                videos={formData.videos}
                onImagesChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                onVideosChange={(videos) => setFormData((prev) => ({ ...prev, videos }))}
                maxImages={10}
                maxVideos={2}
                minImages={0}
                label="Donation Media (Optional)"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors"
                >
                  {editing ? "Update Donation" : "Create Donation"}
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
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search by campaign, user, or amount..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                />
              </div>
              <select
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
              >
                <option value="all">All Campaigns</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.title}
                  </option>
                ))}
              </select>
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Campaign</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Donor</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-charcoal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-charcoal/60">
                      {searchTerm || campaignFilter !== "all" ? "No donations found matching your filters" : "No donations found"}
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-sage/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-charcoal">{donation.campaign?.title || "—"}</td>
                      <td className="px-6 py-4 text-sm text-charcoal">
                        {donation.anonymous ? (
                          <span className="text-charcoal/60 italic">Anonymous</span>
                        ) : (
                          donation.user?.name || donation.user?.email || "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-sage">
                        {donation.currency} {donation.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal/60">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(donation)}
                            className="p-2 text-sage hover:bg-sage/10 rounded-lg transition-colors"
                            title="Edit donation"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(donation.id)}
                            className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors"
                            title="Delete donation"
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



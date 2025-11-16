"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, Newspaper, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewsPanel() {
  const [newsBriefs, setNewsBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    region: "",
    topics: [] as string[],
    sourceUrl: "",
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/admin/news");
      if (response.ok) {
        const data = await response.json();
        setNewsBriefs(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/admin/news/${editing.id}` : "/api/admin/news";
      const method = editing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchNews();
        resetForm();
      }
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news brief?")) return;
    try {
      const response = await fetch(`/api/admin/news?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchNews();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const handleEdit = (brief: any) => {
    setEditing(brief);
    setFormData({
      title: brief.title,
      summary: brief.summary,
      region: brief.region,
      topics: Array.isArray(brief.topics) ? brief.topics : [],
      sourceUrl: brief.sourceUrl || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      summary: "",
      region: "",
      topics: [],
      sourceUrl: "",
    });
    setEditing(null);
    setShowForm(false);
  };

  const addTopic = () => {
    const topic = prompt("Enter topic:");
    if (topic) {
      setFormData({ ...formData, topics: [...formData.topics, topic] });
    }
  };

  const removeTopic = (index: number) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((_, i) => i !== index),
    });
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
      {/* Header */}
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
                  <Newspaper className="w-8 h-8" />
                  News Panel
                </h1>
                <p className="text-charcoal/60 mt-1">Manage news briefs and content</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {showForm ? "Cancel" : "Add News Brief"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm mb-8"
          >
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
              {editing ? "Edit News Brief" : "Create News Brief"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Title
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
                  Summary
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Region
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Topics
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-sage/20 text-sage rounded-lg text-sm flex items-center gap-2"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="hover:text-coral"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addTopic}
                  className="px-4 py-2 border border-sage/20 rounded-lg text-sm text-charcoal/70 hover:bg-sage/10"
                >
                  + Add Topic
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Source URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
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

        {/* News List */}
        <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
          <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
            All News Briefs ({newsBriefs.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sage/10">
                  <th className="text-left py-3 px-4 font-semibold text-charcoal">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-charcoal">Region</th>
                  <th className="text-left py-3 px-4 font-semibold text-charcoal">Topics</th>
                  <th className="text-left py-3 px-4 font-semibold text-charcoal">Date</th>
                  <th className="text-right py-3 px-4 font-semibold text-charcoal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsBriefs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-charcoal/60">
                      No news briefs found. Create your first one!
                    </td>
                  </tr>
                ) : (
                  newsBriefs.map((brief) => (
                    <tr
                      key={brief.id}
                      className="border-b border-sage/5 hover:bg-sage/5 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-charcoal">{brief.title}</td>
                      <td className="py-4 px-4 text-charcoal/70">{brief.region}</td>
                      <td className="py-4 px-4 text-charcoal/70">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(brief.topics) &&
                            brief.topics.slice(0, 3).map((topic: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-sage/20 text-sage rounded-lg text-xs"
                              >
                                {topic}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-charcoal/70">
                        {new Date(brief.savedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(brief)}
                            className="p-2 text-amber hover:bg-amber/10 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(brief.id)}
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





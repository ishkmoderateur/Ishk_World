"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Users, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/types/next-auth.d";
import { getRoleDisplayName } from "@/lib/roles";

export default function UsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "USER" as UserRole,
    password: "",
    image: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setError("");
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch users" }));
        setError(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setSuccess("");

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      return;
    }

    // Validate password for new users
    if (!editing && (!formData.password || formData.password.length < 6)) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const url = editing ? `/api/admin/users/${editing.id}` : "/api/admin/users";
      const method = editing ? "PUT" : "POST";

      const payload: any = {
        name: formData.name || null,
        email: formData.email,
        phone: formData.phone || null,
        role: formData.role,
        image: formData.image || null,
      };

      // Only include password if provided (for new users or when updating)
      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess(editing ? "User updated successfully!" : "User created successfully!");
        fetchUsers();
        setTimeout(() => {
          resetForm();
          setSuccess("");
        }, 2000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || `Failed to ${editing ? "update" : "create"} user`);
      }
    } catch (error) {
      console.error("Error saving user:", error);
      setError("An error occurred while saving the user");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("An error occurred while deleting the user");
    }
  };

  const handleEdit = (user: any) => {
    setEditing(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      password: "", // Don't pre-fill password
      image: user.image || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "USER",
      password: "",
      image: "",
    });
    setEditing(null);
    setShowForm(false);
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phone?.toLowerCase().includes(search) ||
      getRoleDisplayName(user.role).toLowerCase().includes(search)
    );
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
                  <Users className="w-8 h-8" />
                  Users Management
                </h1>
                <p className="text-charcoal/60 mt-1">Manage user accounts and roles</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {showForm ? "Cancel" : "Add User"}
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
              {editing ? "Edit User" : "Create User"}
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
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    required
                  >
                    <option value="USER">User</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN_NEWS">News Admin</option>
                    <option value="ADMIN_PARTY">Party Admin</option>
                    <option value="ADMIN_BOUTIQUE">Boutique Admin</option>
                    <option value="ADMIN_ASSOCIATION">Association Admin</option>
                    <option value="ADMIN_PHOTOGRAPHY">Photography Admin</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {editing ? "New Password (leave empty to keep current)" : "Password *"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  required={!editing}
                  minLength={6}
                />
                {editing && (
                  <p className="text-xs text-charcoal/60 mt-1">
                    Leave empty to keep the current password
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors"
                >
                  {editing ? "Update User" : "Create User"}
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
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search users by name, email, phone, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                />
              </div>
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-charcoal">Created</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-charcoal">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-charcoal/60">
                      {searchTerm ? "No users found matching your search" : "No users found"}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-sage/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-charcoal">{user.name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-charcoal">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-charcoal/60">{user.phone || "—"}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-sage/10 text-sage rounded-lg text-xs font-medium">
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal/60">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-sage hover:bg-sage/10 rounded-lg transition-colors"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-coral hover:bg-coral/10 rounded-lg transition-colors"
                            title="Delete user"
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











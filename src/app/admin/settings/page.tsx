"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Settings as SettingsIcon, User, Shield, Bell, Lock, Save, CheckCircle, AlertCircle } from "lucide-react";
import { getRoleDisplayName } from "@/lib/roles";

export default function AdminSettings() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "general">("profile");
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  // Load profile data
  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
      });
    }
  }, [session]);
  
  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      setPasswordLoading(false);
      return;
    }
    
    // Validate password length
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setPasswordLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setPasswordError(data.error || "Failed to change password");
        return;
      }
      
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (error) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // Handle profile update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }
      
      setSuccess(true);
      
      // Update the session to reflect changes
      await update();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-sage/5">
      <header className="bg-white border-b border-sage/10 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 text-charcoal/70 hover:text-charcoal transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold text-charcoal flex items-center gap-3">
                <SettingsIcon className="w-8 h-8" />
                Settings
              </h1>
              <p className="text-charcoal/60 mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 border border-sage/10 shadow-sm">
              <nav className="space-y-2">
                {[
                  { id: "profile", label: "Profile", icon: User },
                  { id: "security", label: "Security", icon: Lock },
                  { id: "notifications", label: "Notifications", icon: Bell },
                  { id: "general", label: "General", icon: SettingsIcon },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
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
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile}>
                  <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">Profile Settings</h2>
                  
                  {/* Success/Error Messages */}
                  {success && (
                    <div className="mb-6 p-4 bg-green/10 border border-green/20 rounded-xl flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green" />
                      <span className="text-green font-medium">Profile updated successfully!</span>
                    </div>
                  )}
                  
                  {error && (
                    <div className="mb-6 p-4 bg-coral/10 border border-coral/20 rounded-xl flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-coral" />
                      <span className="text-coral font-medium">{error}</span>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Phone (Optional)</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                        placeholder="+1234567890"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Role</label>
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sage/20 bg-sage/5">
                        <Shield className="w-5 h-5 text-sage" />
                        <span className="font-medium text-charcoal">
                          {session?.user?.role ? getRoleDisplayName(session.user.role) : "User"}
                        </span>
                      </div>
                      <p className="text-sm text-charcoal/60 mt-1">Role cannot be changed here</p>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-sage/10">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-5 h-5" />
                        {loading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    {/* Change Password Form */}
                    <form onSubmit={handleChangePassword} className="bg-white border border-sage/20 rounded-xl p-6">
                      <h3 className="font-semibold text-charcoal mb-4">Change Password</h3>
                      
                      {/* Password Success/Error Messages */}
                      {passwordSuccess && (
                        <div className="mb-4 p-4 bg-green/10 border border-green/20 rounded-xl flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green" />
                          <span className="text-green font-medium">Password changed successfully!</span>
                        </div>
                      )}
                      
                      {passwordError && (
                        <div className="mb-4 p-4 bg-coral/10 border border-coral/20 rounded-xl flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-coral" />
                          <span className="text-coral font-medium">{passwordError}</span>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">Current Password</label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                            placeholder="Enter your current password"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">New Password</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                            placeholder="Enter your new password (min. 8 characters)"
                            minLength={8}
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                            placeholder="Confirm your new password"
                            minLength={8}
                            required
                          />
                        </div>
                        
                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            disabled={passwordLoading}
                            className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Lock className="w-5 h-5" />
                            {passwordLoading ? "Changing..." : "Change Password"}
                          </button>
                        </div>
                      </div>
                    </form>
                    
                    {/* Session Management */}
                    <div className="bg-sage/10 border border-sage/20 rounded-xl p-6">
                      <h3 className="font-semibold text-charcoal mb-2">Session Management</h3>
                      <p className="text-sm text-charcoal/60 mb-4">
                        You are currently logged in as {session?.user?.email}
                      </p>
                      <button
                        onClick={() => signOut({ callbackUrl: window.location.origin + "/" })}
                        className="px-4 py-2 bg-coral text-white rounded-lg hover:bg-coral/90 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">Notification Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-sage/10 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-charcoal">Email Notifications</h3>
                        <p className="text-sm text-charcoal/60">Receive email updates about your account</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-sage" />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-sage/10 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-charcoal">Order Updates</h3>
                        <p className="text-sm text-charcoal/60">Get notified about new orders</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-sage" />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-sage/10 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-charcoal">System Alerts</h3>
                        <p className="text-sm text-charcoal/60">Important system notifications</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-sage" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "general" && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">General Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Language</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage">
                        <option>English</option>
                        <option>Arabic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Timezone</label>
                      <select className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage">
                        <option>UTC</option>
                        <option>Europe/Paris</option>
                        <option>Asia/Dubai</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-sage/10 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-charcoal">Dark Mode</h3>
                        <p className="text-sm text-charcoal/60">Toggle dark mode (coming soon)</p>
                      </div>
                      <input type="checkbox" disabled className="w-5 h-5 text-sage opacity-50" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



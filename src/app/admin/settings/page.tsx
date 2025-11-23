"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Settings as SettingsIcon, User, Shield, Bell, Lock } from "lucide-react";
import { getRoleDisplayName } from "@/lib/roles";

export default function AdminSettings() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "general">("profile");

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
                <div>
                  <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">Profile Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Name</label>
                      <input
                        type="text"
                        defaultValue={session?.user?.name || ""}
                        className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                        disabled
                      />
                      <p className="text-sm text-charcoal/60 mt-1">Name cannot be changed here</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={session?.user?.email || ""}
                        className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                        disabled
                      />
                      <p className="text-sm text-charcoal/60 mt-1">Email cannot be changed here</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Role</label>
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-sage/20 bg-sage/5">
                        <Shield className="w-5 h-5 text-sage" />
                        <span className="font-medium text-charcoal">
                          {session?.user?.role ? getRoleDisplayName(session.user.role) : "User"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div>
                  <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="bg-amber/10 border border-amber/20 rounded-xl p-6">
                      <h3 className="font-semibold text-charcoal mb-2">Change Password</h3>
                      <p className="text-sm text-charcoal/60 mb-4">
                        Password changes are not available in this version. Please contact support.
                      </p>
                    </div>
                    <div className="bg-sage/10 border border-sage/20 rounded-xl p-6">
                      <h3 className="font-semibold text-charcoal mb-2">Session Management</h3>
                      <p className="text-sm text-charcoal/60 mb-4">
                        You are currently logged in as {session?.user?.email}
                      </p>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
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



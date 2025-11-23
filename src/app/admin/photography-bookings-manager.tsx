"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";

export default function PhotographyBookingsManager() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/photography-bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching photography bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/photography-bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-amber/10 text-amber",
      CONTACTED: "bg-sky/10 text-sky",
      QUOTED: "bg-sage/10 text-sage",
      BOOKED: "bg-forest/10 text-forest",
      DECLINED: "bg-coral/10 text-coral",
    };
    return colors[status] || colors.NEW;
  };

  if (loading) {
    return <div className="text-center py-12 text-charcoal/60">Loading bookings...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-sage/10">
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Name</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Email</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Phone</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Service Type</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Preferred Date</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-charcoal">Date</th>
            <th className="text-right py-3 px-4 font-semibold text-charcoal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-12 text-charcoal/60">
                No bookings found.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-sage/5 hover:bg-sage/5 transition-colors">
                <td className="py-4 px-4 font-medium text-charcoal">{booking.name}</td>
                <td className="py-4 px-4 text-charcoal/70">{booking.email}</td>
                <td className="py-4 px-4 text-charcoal/70">{booking.phone || "N/A"}</td>
                <td className="py-4 px-4 text-charcoal/70 capitalize">{booking.serviceType}</td>
                <td className="py-4 px-4 text-charcoal/70">
                  {booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : "N/A"}
                </td>
                <td className="py-4 px-4">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm border-none ${getStatusColor(booking.status)}`}
                  >
                    <option value="NEW">New</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUOTED">Quoted</option>
                    <option value="BOOKED">Booked</option>
                    <option value="DECLINED">Declined</option>
                  </select>
                </td>
                <td className="py-4 px-4 text-charcoal/70">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    {booking.message && (
                      <button
                        onClick={() => alert(booking.message)}
                        className="p-2 text-sage hover:bg-sage/10 rounded-lg transition-colors"
                        title="View message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}



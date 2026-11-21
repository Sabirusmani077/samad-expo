"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CorporateInquiry } from "@/lib/types";

export default function InquiriesManager() {
  const [items, setItems] = useState<CorporateInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<CorporateInquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [status, setStatus] = useState<CorporateInquiry["status"]>("new");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchItems = () => {
    fetch("/api/corporate/inquiries?admin=true")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.corporateInquiries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openReview = (item: CorporateInquiry) => {
    setActiveItem(item);
    setAdminNotes(item.adminNotes || "");
    setStatus(item.status || "new");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/corporate/inquiries/${activeItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (res.ok) {
        setActiveItem(null);
        fetchItems();
        setMessage({ type: "success", text: "Inquiry updated successfully." });
      } else {
        setMessage({ type: "error", text: "Failed to update inquiry." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry record?")) return;
    const res = await fetch(`/api/corporate/inquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setMessage({ type: "success", text: "Inquiry record deleted." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/corporate" className="text-sm text-slate-500 hover:text-slate-900">
            ← Corporate Admin
          </Link>
          <span className="text-slate-300">/</span>
          <h1 className="text-lg font-black text-slate-900">Corporate Inquiries & Messages</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {message && (
          <div
            className={`mb-4 p-4 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
            Loading inquiries...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            No corporate inquiries received yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Sender</th>
                  <th className="px-6 py-3 text-left">Subject & Type</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{inq.name}</div>
                      <div className="text-xs text-slate-500">{inq.email} {inq.phone ? `• ${inq.phone}` : ""}</div>
                      {inq.company && <div className="text-xs text-slate-400">{inq.company}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{inq.subject}</div>
                      <span className="inline-block mt-0.5 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize">
                        {inq.inquiryType || "general"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          inq.status === "new"
                            ? "bg-red-100 text-red-700"
                            : inq.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {inq.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openReview(inq)}
                        className="text-xs font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded bg-slate-100"
                      >
                        View & Reply
                      </button>
                      <button
                        onClick={() => handleDelete(inq.id)}
                        className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-1 rounded bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {activeItem && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-300 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-black text-slate-900 mb-2">Inquiry Details</h2>
            <div className="text-xs text-slate-500 mb-4">Received on {new Date(activeItem.createdAt).toLocaleString()}</div>
            
            <div className="bg-slate-50 rounded-xl p-4 space-y-2 mb-4 text-sm">
              <div><strong>From:</strong> {activeItem.name} ({activeItem.email})</div>
              {activeItem.phone && <div><strong>Phone:</strong> {activeItem.phone}</div>}
              {activeItem.company && <div><strong>Company:</strong> {activeItem.company}</div>}
              <div><strong>Subject:</strong> {activeItem.subject}</div>
              <div className="pt-2 border-t border-slate-200 mt-2">
                <strong>Message:</strong>
                <p className="mt-1 text-slate-700 whitespace-pre-wrap">{activeItem.message}</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CorporateInquiry["status"])}
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Admin Internal Notes</label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-24"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record follow-up actions, date contacted, discussion notes..."
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

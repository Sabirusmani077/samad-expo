"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Partnership } from "@/lib/types";

export default function PartnershipsManager() {
  const [items, setItems] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Partnership | null>(null);
  const [partnerName, setPartnerName] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [partnerType, setPartnerType] = useState<Partnership["partnerType"]>("technology");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchItems = () => {
    fetch("/api/corporate/partnerships")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.partnerships || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openNew = () => {
    setEditingItem(null);
    setPartnerName("");
    setLogo("");
    setDescription("");
    setUrl("");
    setPartnerType("technology");
    setStatus("active");
    setShowModal(true);
  };

  const openEdit = (item: Partnership) => {
    setEditingItem(item);
    setPartnerName(item.partnerName || "");
    setLogo(item.logo || "");
    setDescription(item.description || "");
    setUrl(item.url || "");
    setPartnerType(item.partnerType || "technology");
    setStatus(item.status || "active");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) return;
    setSaving(true);
    const slug = partnerName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const body = {
      partnerName,
      slug: editingItem ? editingItem.slug : slug,
      logo,
      description,
      url,
      partnerType,
      status,
      sortOrder: 0,
    };

    try {
      const apiUrl = editingItem ? `/api/corporate/partnerships/${editingItem.id}` : "/api/corporate/partnerships";
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowModal(false);
        fetchItems();
        setMessage({ type: "success", text: "Partnership updated!" });
      } else {
        setMessage({ type: "error", text: "Failed to save partnership." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this partner?")) return;
    const res = await fetch(`/api/corporate/partnerships/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p.id !== id));
      setMessage({ type: "success", text: "Partner deleted." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/corporate" className="text-sm text-slate-500 hover:text-slate-900">
              ← Corporate Admin
            </Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-lg font-black text-slate-900">Partnerships & Alliances</h1>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors"
          >
            + Add Partner
          </button>
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
            Loading partnerships...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-500 mb-4">No partnerships listed yet.</p>
            <button
              onClick={openNew}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl"
            >
              Add First Strategic Partner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((partner) => (
              <div key={partner.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 capitalize">{partner.partnerType} Partner</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        partner.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {partner.status}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-1">{partner.partnerName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-4">{partner.description}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {partner.url ? (
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-black underline hover:text-zinc-600"
                    >
                      Visit site ↗
                    </a>
                  ) : <span />}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(partner)}
                      className="text-xs font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(partner.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-1 rounded bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-300 w-full max-w-md p-6">
            <h2 className="text-lg font-black text-slate-900 mb-4">
              {editingItem ? "Edit Partner" : "Add Strategic Partner"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Partner Organization *</label>
                <input
                  required
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Logo URL</label>
                <input
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Partner Type</label>
                  <select
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value as Partnership["partnerType"])}
                  >
                    <option value="technology">Technology</option>
                    <option value="business">Business</option>
                    <option value="distribution">Distribution</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Website URL</label>
                  <input
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Partnership Scope / Description</label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-24"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

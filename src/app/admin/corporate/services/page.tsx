"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CorporateService } from "@/lib/types";

export default function ServicesManager() {
  const [items, setItems] = useState<CorporateService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CorporateService | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Technology Solutions");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "coming_soon">("active");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchItems = () => {
    fetch("/api/corporate/services")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.corporateServices || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openNew = () => {
    setEditingItem(null);
    setName("");
    setCategory("Technology Solutions");
    setShortDescription("");
    setDescription("");
    setFeatures([]);
    setStatus("active");
    setShowModal(true);
  };

  const openEdit = (item: CorporateService) => {
    setEditingItem(item);
    setName(item.name || "");
    setCategory(item.category || "Technology Solutions");
    setShortDescription(item.shortDescription || "");
    setDescription(item.description || "");
    setFeatures(item.features || []);
    setStatus(item.status || "active");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const body = {
      name,
      slug: editingItem ? editingItem.slug : slug,
      category,
      shortDescription,
      description,
      features,
      status,
      icon: "Briefcase",
    };

    try {
      const url = editingItem ? `/api/corporate/services/${editingItem.id}` : "/api/corporate/services";
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowModal(false);
        fetchItems();
        setMessage({ type: "success", text: "Service saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save service." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`/api/corporate/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((s) => s.id !== id));
      setMessage({ type: "success", text: "Service deleted." });
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
            <h1 className="text-lg font-black text-slate-900">Services Management</h1>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors"
          >
            + Add Service
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
            Loading services...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-500 mb-4">No corporate services registered yet.</p>
            <button
              onClick={openNew}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl"
            >
              Add First Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">{service.category}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        service.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">{service.shortDescription || service.description}</p>
                </div>
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => openEdit(service)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-1 rounded bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-300 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-black text-slate-900 mb-4">
              {editingItem ? "Edit Service" : "Add New Corporate Service"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Service Name *</label>
                <input
                  required
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Enterprise Cloud Solutions"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <input
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "active" | "inactive" | "coming_soon")}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Short Description</label>
                <input
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One sentence summary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Detailed Description</label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black h-24"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Key Features / Deliverables</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a key feature"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (featureInput.trim()) {
                        setFeatures([...features, featureInput.trim()]);
                        setFeatureInput("");
                      }
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((f, i) => (
                    <span key={i} className="bg-slate-100 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {f}
                      <button
                        type="button"
                        onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                        className="text-red-500 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
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
                  {saving ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { PortfolioEntry } from "@/lib/types";

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioEntry | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web Platforms");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchItems = () => {
    fetch("/api/corporate/portfolio")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.portfolioEntries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openNew = () => {
    setEditingItem(null);
    setTitle("");
    setCategory("Web Platforms");
    setShortDescription("");
    setDescription("");
    setUrl("");
    setImages([]);
    setTags([]);
    setFeatured(false);
    setShowModal(true);
  };

  const openEdit = (item: PortfolioEntry) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setCategory(item.category || "Web Platforms");
    setShortDescription(item.shortDescription || "");
    setDescription(item.description || "");
    setUrl(item.url || "");
    setImages(item.images || []);
    setTags(item.tags || []);
    setFeatured(!!item.featured);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const body = {
      title,
      slug: editingItem ? editingItem.slug : slug,
      category,
      shortDescription,
      description,
      url,
      images,
      tags,
      featured,
      status: "active",
      businessDivisionId: null,
      completedAt: new Date().toISOString(),
      sortOrder: 0,
    };

    try {
      const apiUrl = editingItem ? `/api/corporate/portfolio/${editingItem.id}` : "/api/corporate/portfolio";
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowModal(false);
        fetchItems();
        setMessage({ type: "success", text: "Portfolio project saved!" });
      } else {
        setMessage({ type: "error", text: "Failed to save portfolio." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this portfolio project?")) return;
    const res = await fetch(`/api/corporate/portfolio/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p.id !== id));
      setMessage({ type: "success", text: "Deleted." });
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
            <h1 className="text-lg font-black text-slate-900">Portfolio & Case Studies</h1>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors"
          >
            + Add Project
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
            Loading portfolio...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-500 mb-4">No portfolio entries created yet.</p>
            <button
              onClick={openNew}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl"
            >
              Add First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
                {project.images?.[0] ? (
                  <img src={project.images[0]} alt={project.title} className="w-full h-40 object-cover border-b" />
                ) : (
                  <div className="w-full h-40 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                    No preview image
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">{project.category}</span>
                    {project.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#FFF33D] text-black font-extrabold">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{project.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{project.shortDescription}</p>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(project)}
                    className="text-xs font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded bg-white border"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-300 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-black text-slate-900 mb-4">
              {editingItem ? "Edit Portfolio Project" : "Add Portfolio Project"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Project Title *</label>
                <input
                  required
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Digital Platform Network"
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
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Live URL (optional)</label>
                  <input
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Short Summary</label>
                <input
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief synopsis"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Detailed Case Study</label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black h-24"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Image URLs</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Paste image link"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (imageInput.trim()) {
                        setImages([...images, imageInput.trim()]);
                        setImageInput("");
                      }
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {images.map((img, i) => (
                    <span key={i} className="bg-slate-100 px-2 py-1 rounded text-xs flex items-center gap-1">
                      <span className="truncate max-w-[150px]">{img}</span>
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="text-red-500 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#FFF33D]"
                />
                <label htmlFor="featured" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Featured on Corporate Homepage
                </label>
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
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

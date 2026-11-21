"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";

export default function BlogManager() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Corporate News");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("Samad Expo Editorial");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("published");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchItems = () => {
    fetch("/api/corporate/blog")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.blogPosts || []);
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
    setCategory("Corporate News");
    setExcerpt("");
    setContent("");
    setCoverImage("");
    setAuthor("Samad Expo Editorial");
    setStatus("published");
    setShowModal(true);
  };

  const openEdit = (item: BlogPost) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setCategory(item.category || "Corporate News");
    setExcerpt(item.excerpt || "");
    setContent(item.content || "");
    setCoverImage(item.coverImage || "");
    setAuthor(item.author || "Samad Expo Editorial");
    setStatus(item.status || "published");
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
      excerpt,
      content,
      coverImage,
      author,
      status,
      tags: [category],
      featured: true,
      publishedAt: status === "published" ? new Date().toISOString() : null,
    };

    try {
      const apiUrl = editingItem ? `/api/corporate/blog/${editingItem.id}` : "/api/corporate/blog";
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowModal(false);
        fetchItems();
        setMessage({ type: "success", text: "Article saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save article." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/corporate/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((b) => b.id !== id));
      setMessage({ type: "success", text: "Deleted successfully." });
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
            <h1 className="text-lg font-black text-slate-900">Blog, News & Announcements</h1>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors"
          >
            + New Article
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
            Loading articles...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-500 mb-4">No news or blog articles published yet.</p>
            <button
              onClick={openNew}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl"
            >
              Publish First Announcement
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Article</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Author</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{b.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{b.excerpt}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{b.category}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs">{b.author}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          b.status === "published"
                            ? "bg-green-100 text-green-700"
                            : b.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(b)}
                        className="text-xs font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
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

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-300 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-black text-slate-900 mb-4">
              {editingItem ? "Edit News / Blog Post" : "Write News / Blog Post"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Headline / Title *</label>
                <input
                  required
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Samad Expo Announces Expansion of Digital Infrastructure"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <input
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Author</label>
                  <input
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "draft" | "published" | "archived")}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cover Image URL</label>
                <input
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Excerpt (Short Summary)</label>
                <input
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="One or two sentence summary for news cards"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Article Content</label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-48 focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black font-mono"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Markdown or plain text content..."
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
                  {saving ? "Saving..." : "Save Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

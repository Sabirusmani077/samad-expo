"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { JobListing } from "@/lib/types";

export default function JobsManager() {
  const [items, setItems] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<JobListing | null>(null);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [type, setType] = useState<"full_time" | "part_time" | "contract" | "internship">("full_time");
  const [location, setLocation] = useState("India (Remote)");
  const [isRemote, setIsRemote] = useState(true);
  const [salaryRange, setSalaryRange] = useState("Competitive");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"open" | "closed" | "paused">("open");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchItems = () => {
    fetch("/api/corporate/jobs")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.jobListings || []);
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
    setDepartment("Engineering");
    setType("full_time");
    setLocation("India (Remote)");
    setIsRemote(true);
    setSalaryRange("Competitive");
    setDescription("");
    setStatus("open");
    setShowModal(true);
  };

  const openEdit = (item: JobListing) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setDepartment(item.department || "Engineering");
    setType(item.type || "full_time");
    setLocation(item.location || "India (Remote)");
    setIsRemote(item.isRemote !== false);
    setSalaryRange(item.salaryRange || "Competitive");
    setDescription(item.description || "");
    setStatus(item.status || "open");
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
      department,
      type,
      location,
      isRemote,
      salaryRange,
      description,
      requirements: [],
      responsibilities: [],
      status,
      businessDivisionId: null,
    };

    try {
      const apiUrl = editingItem ? `/api/corporate/jobs/${editingItem.id}` : "/api/corporate/jobs";
      const method = editingItem ? "PUT" : "POST";
      const res = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowModal(false);
        fetchItems();
        setMessage({ type: "success", text: "Job listing saved successfully!" });
      } else {
        setMessage({ type: "error", text: "Failed to save job opening." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job opening?")) return;
    const res = await fetch(`/api/corporate/jobs/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((j) => j.id !== id));
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
            <h1 className="text-lg font-black text-slate-900">Careers & Opportunities</h1>
          </div>
          <button
            onClick={openNew}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors"
          >
            + Post Opportunity
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
            Loading positions...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-500 mb-4">No open positions listed currently.</p>
            <button
              onClick={openNew}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl"
            >
              Post First Job
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Role Title</th>
                  <th className="px-6 py-3 text-left">Department</th>
                  <th className="px-6 py-3 text-left">Type & Location</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-bold text-slate-900">{j.title}</td>
                    <td className="px-6 py-4 text-slate-600">{j.department}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      <span className="capitalize">{j.type.replace("_", " ")}</span> • {j.location}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          j.status === "open"
                            ? "bg-green-100 text-green-700"
                            : j.status === "paused"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {j.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(j)}
                        className="text-xs font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(j.id)}
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
          <div className="bg-white rounded-2xl border border-slate-300 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-black text-slate-900 mb-4">
              {editingItem ? "Edit Job Opportunity" : "Post New Job Opportunity"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Position Title *</label>
                <input
                  required
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
                  <input
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Engineering / Growth / Operations"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Employment Type</label>
                  <select
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    value={type}
                    onChange={(e) => setType(e.target.value as JobListing["type"])}
                  >
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Location</label>
                  <input
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "open" | "closed" | "paused")}
                  >
                    <option value="open">Open</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Role Description</label>
                <textarea
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Responsibilities, requirements, and culture..."
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
                  {saving ? "Saving..." : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { WebsiteListing } from "@/lib/types";

const statusColors: Record<string, string> = {
  live: "bg-green-100 text-green-700",
  under_development: "bg-yellow-100 text-yellow-700",
  coming_soon: "bg-zinc-100 text-zinc-900 border border-zinc-300",
  temporarily_unavailable: "bg-orange-100 text-orange-700",
  maintenance: "bg-red-100 text-red-700",
};

export default function WebsitesManager() {
  const [items, setItems] = useState<WebsiteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const pageSize = 10;

  useEffect(() => {
    fetch("/api/corporate/websites")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.websiteListings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this website listing?")) return;
    setDeleting(id);
    const res = await fetch(`/api/corporate/websites/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((w) => w.id !== id));
      setMessage({ type: "success", text: "Deleted successfully." });
    } else {
      setMessage({ type: "error", text: "Delete failed." });
    }
    setDeleting(null);
  };

  const filteredItems = items
    .filter((item) => {
      const query = search.trim().toLowerCase();
      const matchesSearch = !query || [item.name, item.slug, item.category, item.shortDescription].some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (statusFilter === "all" || item.status === statusFilter);
    })
    .sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : sortBy === "status" ? a.status.localeCompare(b.status) : a.sortOrder - b.sortOrder);
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pageItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  const setBulkStatus = async (status: string) => {
    if (!selected.length) return;
    const updates = await Promise.all(selected.map((id) => fetch(`/api/corporate/websites/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })));
    if (updates.every((response) => response.ok)) {
      setItems((previous) => previous.map((item) => selected.includes(item.id) ? { ...item, status: status as WebsiteListing["status"] } : item));
      setSelected([]);
      setMessage({ type: "success", text: `Updated ${updates.length} website listing${updates.length === 1 ? "" : "s"}.` });
    } else {
      setMessage({ type: "error", text: "Some listings could not be updated. Refresh the page and try again." });
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
            <h1 className="text-lg font-black text-slate-900">Website Directory & Ecosystem</h1>
          </div>
          <Link
            href="/admin/corporate/websites/new"
            className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors"
          >
            + Add Website
          </Link>
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

        {!loading && items.length > 0 && <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, slug, category…" className="rounded-lg border border-slate-300 px-3 py-2 text-sm sm:col-span-2" aria-label="Search website listings" />
          <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" aria-label="Filter websites by status"><option value="all">All statuses</option><option value="live">Live</option><option value="under_development">Under development</option><option value="coming_soon">Coming soon</option><option value="temporarily_unavailable">Temporarily unavailable</option><option value="maintenance">Maintenance</option></select>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" aria-label="Sort website listings"><option value="name">Name A–Z</option><option value="status">Status</option><option value="order">Display order</option></select>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 sm:col-span-2"><input type="checkbox" checked={pageItems.length > 0 && pageItems.every((item) => selected.includes(item.id))} onChange={(event) => setSelected((previous) => event.target.checked ? [...new Set([...previous, ...pageItems.map((item) => item.id)])] : previous.filter((id) => !pageItems.some((item) => item.id === id)))} />Select this page</label>
          <select disabled={!selected.length} defaultValue="" onChange={(event) => { if (event.target.value) void setBulkStatus(event.target.value); event.target.value = ""; }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:opacity-50" aria-label="Set status for selected websites"><option value="">Bulk status ({selected.length} selected)</option><option value="live">Set live</option><option value="under_development">Set under development</option><option value="coming_soon">Set coming soon</option><option value="temporarily_unavailable">Set temporarily unavailable</option><option value="maintenance">Set maintenance</option></select>
        </div>}

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
            Loading website directory...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-500 mb-4">No websites listed in the ecosystem yet.</p>
            <Link
              href="/admin/corporate/websites/new"
              className="inline-block px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl"
            >
              Add Your First Website
            </Link>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No listings match the current search and filters.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-3 py-3 text-left">Select</th>
                  <th className="px-6 py-3 text-left">Website</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Ownership</th>
                  <th className="px-6 py-3 text-left">URL</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pageItems.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-4"><input type="checkbox" checked={selected.includes(w.id)} onChange={(event) => setSelected((previous) => event.target.checked ? [...previous, w.id] : previous.filter((id) => id !== w.id))} aria-label={`Select ${w.name}`} /></td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{w.name}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{w.shortDescription}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{w.category || "General"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          statusColors[w.status] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {w.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize text-slate-600">{w.ownershipType || "owned"}</td>
                    <td className="px-6 py-4">
                      {w.url ? (
                        <a
                          href={w.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-black underline hover:text-zinc-600 flex items-center gap-1"
                        >
                          Visit ↗
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/corporate/websites/${w.id}/edit`}
                        className="text-xs font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(w.id)}
                        disabled={deleting === w.id}
                        className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-1 rounded bg-red-50 hover:bg-red-100 disabled:opacity-50"
                      >
                        {deleting === w.id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filteredItems.length > 0 && <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>{filteredItems.length} listing{filteredItems.length === 1 ? "" : "s"} · page {page} of {pageCount}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold disabled:opacity-40">Previous</button><button type="button" disabled={page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold disabled:opacity-40">Next</button></div></div>}
      </div>
    </div>
  );
}

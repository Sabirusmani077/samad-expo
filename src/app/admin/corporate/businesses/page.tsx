"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { BusinessDivision } from "@/lib/types";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-slate-100 text-slate-500",
  coming_soon: "bg-yellow-100 text-yellow-700",
};

export default function BusinessesManager() {
  const [items, setItems] = useState<BusinessDivision[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const pageSize = 10;

  useEffect(() => {
    fetch("/api/corporate/businesses")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.businessDivisions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this business division?")) return;
    setDeleting(id);
    const res = await fetch(`/api/corporate/businesses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((b) => b.id !== id));
      setMessage({ type: "success", text: "Deleted successfully." });
    } else {
      setMessage({ type: "error", text: "Delete failed." });
    }
    setDeleting(null);
  };

  const filtered = items.filter((item) => {
    const query = search.trim().toLowerCase();
    return (!query || [item.name, item.slug, item.category, item.shortDescription].some((value) => value.toLowerCase().includes(query))) &&
      (status === "all" || item.status === status);
  }).sort((a, b) => sort === "status" ? a.status.localeCompare(b.status) : sort === "order" ? a.sortOrder - b.sortOrder : a.name.localeCompare(b.name));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const setBulkStatus = async (nextStatus: string) => {
    if (!selected.length) return;
    const responses = await Promise.all(selected.map((id) => fetch(`/api/corporate/businesses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    })));
    if (responses.every((response) => response.ok)) {
      setItems((previous) => previous.map((item) => selected.includes(item.id) ? { ...item, status: nextStatus as BusinessDivision["status"] } : item));
      setSelected([]);
      setMessage({ type: "success", text: `Updated ${responses.length} division${responses.length === 1 ? "" : "s"}.` });
    } else setMessage({ type: "error", text: "Some divisions could not be updated. Refresh and try again." });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/corporate" className="text-sm text-slate-500 hover:text-slate-900">← Corporate Admin</Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-lg font-black text-slate-900">Business Divisions</h1>
          </div>
          <Link href="/admin/corporate/businesses/new" className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors">
            + Add New
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {message && (
          <div className={`mb-4 p-4 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <input aria-label="Search business divisions" className="min-w-48 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Search businesses…" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
          <select aria-label="Filter business status" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}><option value="all">All statuses</option><option value="active">Active</option><option value="coming_soon">Coming Soon</option><option value="inactive">Inactive</option></select>
          <select aria-label="Sort business divisions" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" value={sort} onChange={(event) => setSort(event.target.value)}><option value="name">Name</option><option value="status">Status</option><option value="order">Sort order</option></select>
          {selected.length > 0 && <><span className="self-center text-xs text-slate-500">{selected.length} selected</span><button onClick={() => void setBulkStatus("active")} className="rounded-lg bg-green-100 px-3 py-2 text-xs font-bold text-green-800">Set active</button><button onClick={() => void setBulkStatus("inactive")} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">Set inactive</button></>}
        </div>
        {loading ? (
          <div className="text-center py-16 text-slate-400 animate-pulse">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            No business divisions yet.{" "}
            <Link href="/admin/corporate/businesses/new" className="text-black font-bold font-semibold hover:underline">Add one</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-4 py-3 text-left"><input type="checkbox" aria-label="Select all divisions on this page" checked={pageItems.length > 0 && pageItems.every((item) => selected.includes(item.id))} onChange={(event) => setSelected((previous) => event.target.checked ? Array.from(new Set([...previous, ...pageItems.map((item) => item.id)])) : previous.filter((id) => !pageItems.some((item) => item.id === id)))} /></th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${item.name}`} checked={selected.includes(item.id)} onChange={(event) => setSelected((previous) => event.target.checked ? [...previous, item.id] : previous.filter((id) => id !== item.id))} /></td>
                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="px-4 py-3 text-slate-500">{item.category}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[item.status] || "bg-slate-100 text-slate-500"}`}>
                        {item.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/corporate/businesses/${item.id}/edit`} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          {deleting === item.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length > 0 && <div className="mt-4 flex items-center justify-between text-xs text-slate-500"><span>{filtered.length} divisions · page {page} of {pageCount}</span><div className="flex gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold disabled:opacity-40">Previous</button><button type="button" disabled={page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-bold disabled:opacity-40">Next</button></div></div>}
      </div>
    </div>
  );
}

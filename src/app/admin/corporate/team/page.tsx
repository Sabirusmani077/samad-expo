"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { TeamMember } from "@/lib/types";

export default function TeamManager() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/corporate/team")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : data.teamMembers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this team member?")) return;
    setDeleting(id);
    const res = await fetch(`/api/corporate/team/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((m) => m.id !== id));
      setMessage({ type: "success", text: "Deleted successfully." });
    } else {
      setMessage({ type: "error", text: "Delete failed." });
    }
    setDeleting(null);
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
            <h1 className="text-lg font-black text-slate-900">Founder & Leadership Team</h1>
          </div>
          <Link
            href="/admin/corporate/team/new"
            className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors"
          >
            + Add Member
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

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
            Loading team members...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-slate-500 mb-4">No team members added yet.</p>
            <Link
              href="/admin/corporate/team/new"
              className="inline-block px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl"
            >
              Add Founder or Leadership Member
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Member</th>
                  <th className="px-6 py-3 text-left">Designation</th>
                  <th className="px-6 py-3 text-left">Role Type</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {m.photo ? (
                          <img src={m.photo} alt={m.name} className="w-9 h-9 rounded-full object-cover border" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                            {m.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{m.name}</div>
                          <div className="text-xs text-slate-400">{m.socialLinks?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{m.designation}</td>
                    <td className="px-6 py-4">
                      {m.isFounder ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFF33D] text-slate-900 border border-slate-900/20">
                          Founder / Owner
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                          Leadership
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                          m.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {m.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/corporate/team/${m.id}/edit`}
                        className="text-xs font-bold text-slate-700 hover:text-slate-950 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={deleting === m.id}
                        className="text-xs font-bold text-red-600 hover:text-red-800 px-2 py-1 rounded bg-red-50 hover:bg-red-100 disabled:opacity-50"
                      >
                        {deleting === m.id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

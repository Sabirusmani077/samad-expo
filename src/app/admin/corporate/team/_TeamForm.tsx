"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { TeamMember } from "@/lib/types";

const inputCls =
  "w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black bg-white";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

type FormData = {
  name: string;
  photo: string;
  designation: string;
  bio: string;
  responsibilities: string[];
  isFounder: boolean;
  founderMessage: string;
  leadershipPhilosophy: string;
  professionalBackground: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    instagram: string;
    website: string;
    email: string;
  };
  sortOrder: number;
  isActive: boolean;
};

const defaultForm: FormData = {
  name: "",
  photo: "",
  designation: "",
  bio: "",
  responsibilities: [],
  isFounder: false,
  founderMessage: "",
  leadershipPhilosophy: "",
  professionalBackground: "",
  socialLinks: {
    linkedin: "",
    twitter: "",
    instagram: "",
    website: "",
    email: "",
  },
  sortOrder: 0,
  isActive: true,
};

export default function TeamForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = !!id;
  const [form, setForm] = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [respInput, setRespInput] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/corporate/team/${id}`)
      .then((r) => r.json())
      .then((response) => {
        const data = response.teamMember as TeamMember;
        if (!data) throw new Error("Team member not found.");
        setForm({
          name: data.name || "",
          photo: data.photo || "",
          designation: data.designation || "",
          bio: data.bio || "",
          responsibilities: data.responsibilities || [],
          isFounder: !!data.isFounder,
          founderMessage: data.founderMessage || "",
          leadershipPhilosophy: data.leadershipPhilosophy || "",
          professionalBackground: data.professionalBackground || "",
          socialLinks: {
            linkedin: data.socialLinks?.linkedin || "",
            twitter: data.socialLinks?.twitter || "",
            instagram: data.socialLinks?.instagram || "",
            website: data.socialLinks?.website || "",
            email: data.socialLinks?.email || "",
          },
          sortOrder: data.sortOrder || 0,
          isActive: data.isActive !== false,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, isEdit]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Name is required." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const url = isEdit ? `/api/corporate/team/${id}` : "/api/corporate/team";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage({ type: "success", text: isEdit ? "Updated successfully!" : "Added successfully!" });
        setTimeout(() => router.push("/admin/corporate/team"), 800);
      } else {
        setMessage({ type: "error", text: "Save failed. Check your inputs." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error saving team member." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading member details...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/admin/corporate/team" className="text-sm text-slate-500 hover:text-slate-900">
              ← Team
            </Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-lg font-black text-slate-900">
              {isEdit ? `Edit: ${form.name}` : "Add Leader or Team Member"}
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Member"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Basic Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Sabir / MD"
              />
            </div>
            <div>
              <label className={labelCls}>Designation / Title</label>
              <input
                className={inputCls}
                value={form.designation}
                onChange={(e) => setForm((p) => ({ ...p, designation: e.target.value }))}
                placeholder="e.g. Founder & Chief Executive Officer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Photograph URL</label>
              <input
                className={inputCls}
                value={form.photo}
                onChange={(e) => setForm((p) => ({ ...p, photo: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFounder}
                  onChange={(e) => setForm((p) => ({ ...p, isFounder: e.target.checked }))}
                  className="w-5 h-5 rounded accent-[#FFF33D]"
                />
                <span className="text-sm font-bold text-slate-800">Founder / Owner Role</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-5 h-5 rounded accent-[#FFF33D]"
                />
                <span className="text-sm font-medium text-slate-700">Active Status</span>
              </label>
            </div>
          </div>

          <div>
            <label className={labelCls}>Professional Biography</label>
            <textarea
              className={`${inputCls} h-28`}
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Professional biography and role overview..."
            />
          </div>

          <div>
            <label className={labelCls}>Professional Background & Career Summary</label>
            <textarea
              className={`${inputCls} h-24`}
              value={form.professionalBackground}
              onChange={(e) => setForm((p) => ({ ...p, professionalBackground: e.target.value }))}
              placeholder="Educational or professional background, experience..."
            />
          </div>
        </div>

        {/* Founder Specific (conditionally highlighted) */}
        {form.isFounder && (
          <div className="bg-[#FFF33D]/20 rounded-2xl border-2 border-slate-900 p-6 space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>★</span> Founder & Visionary Details
            </h2>
            <div>
              <label className={labelCls}>Founder Personal Message</label>
              <textarea
                className={`${inputCls} h-28`}
                value={form.founderMessage}
                onChange={(e) => setForm((p) => ({ ...p, founderMessage: e.target.value }))}
                placeholder="Direct personal message from the founder explaining the vision, ethos, and commitment..."
              />
            </div>
            <div>
              <label className={labelCls}>Leadership Philosophy</label>
              <textarea
                className={`${inputCls} h-24`}
                value={form.leadershipPhilosophy}
                onChange={(e) => setForm((p) => ({ ...p, leadershipPhilosophy: e.target.value }))}
                placeholder="Core leadership philosophy, approach to technology, innovation, and teamwork..."
              />
            </div>
          </div>
        )}

        {/* Responsibilities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Key Responsibilities</h2>
          <div className="flex gap-2">
            <input
              className={inputCls}
              value={respInput}
              onChange={(e) => setRespInput(e.target.value)}
              placeholder="e.g. Strategic Direction & Digital Architecture"
            />
            <button
              type="button"
              onClick={() => {
                if (respInput.trim()) {
                  setForm((p) => ({ ...p, responsibilities: [...p.responsibilities, respInput.trim()] }));
                  setRespInput("");
                }
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.responsibilities.map((r, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg text-xs">
                {r}
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      responsibilities: prev.responsibilities.filter((_, i) => i !== idx),
                    }))
                  }
                  className="text-red-500 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Social & Professional Links */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Social & Professional Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>LinkedIn Profile</label>
              <input
                className={inputCls}
                value={form.socialLinks.linkedin}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    socialLinks: { ...p.socialLinks, linkedin: e.target.value },
                  }))
                }
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className={labelCls}>Twitter / X</label>
              <input
                className={inputCls}
                value={form.socialLinks.twitter}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    socialLinks: { ...p.socialLinks, twitter: e.target.value },
                  }))
                }
                placeholder="https://x.com/..."
              />
            </div>
            <div>
              <label className={labelCls}>Email Address</label>
              <input
                className={inputCls}
                value={form.socialLinks.email}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    socialLinks: { ...p.socialLinks, email: e.target.value },
                  }))
                }
                placeholder="leader@mdenterprises.in"
              />
            </div>
            <div>
              <label className={labelCls}>Personal Website / Portfolio</label>
              <input
                className={inputCls}
                value={form.socialLinks.website}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    socialLinks: { ...p.socialLinks, website: e.target.value },
                  }))
                }
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

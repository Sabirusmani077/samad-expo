"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { BusinessDivision, BusinessDivisionStatus, WebsiteListing } from "@/lib/types";

const inputCls = "w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black bg-white";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type FormData = {
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  shortDescription: string;
  category: string;
  objectives: string[];
  productsAndServices: string[];
  websiteIds: string[];
  contactEmail: string;
  contactPhone: string;
  status: BusinessDivisionStatus;
  sortOrder: number;
};

const defaultForm: FormData = {
  name: "",
  slug: "",
  logo: "",
  banner: "",
  description: "",
  shortDescription: "",
  category: "",
  objectives: [],
  productsAndServices: [],
  websiteIds: [],
  contactEmail: "",
  contactPhone: "",
  status: "active",
  sortOrder: 0,
};

export default function BusinessDivisionForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = !!id;
  const [form, setForm] = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [objectiveInput, setObjectiveInput] = useState("");
  const [serviceInput, setServiceInput] = useState("");
  const [websites, setWebsites] = useState<WebsiteListing[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/corporate/websites")
      .then((response) => response.json())
      .then((data) => setWebsites(Array.isArray(data) ? data : data.websiteListings || []))
      .catch(() => {});
    if (!isEdit) return;
    fetch(`/api/corporate/businesses/${id}`)
      .then((r) => r.json())
      .then((response) => {
        const data = response.businessDivision as BusinessDivision;
        if (!data) throw new Error("Business division not found.");
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          logo: data.logo || "",
          banner: data.banner || "",
          description: data.description || "",
          shortDescription: data.shortDescription || "",
          category: data.category || "",
          objectives: data.objectives || [],
          productsAndServices: data.productsAndServices || [],
          websiteIds: data.websiteIds || [],
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          status: data.status || "active",
          sortOrder: data.sortOrder || 0,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, isEdit]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug === slugify(prev.name) || !prev.slug ? slugify(name) : prev.slug,
    }));
  };

  const addItem = (key: "objectives" | "productsAndServices", value: string, clear: () => void) => {
    if (!value.trim()) return;
    setForm((prev) => ({ ...prev, [key]: [...prev[key], value.trim()] }));
    clear();
  };

  const removeItem = (key: "objectives" | "productsAndServices", index: number) =>
    setForm((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));

  const uploadBusinessImage = async (key: "logo" | "banner", file?: File) => {
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const payload = new FormData();
      payload.set("file", file);
      const response = await fetch("/api/admin/media", { method: "POST", body: payload });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Image upload failed.");
      set(key, data.item.url);
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Image upload failed." });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(isEdit ? `/api/corporate/businesses/${id}` : "/api/corporate/businesses", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage({ type: "success", text: isEdit ? "Updated successfully!" : "Created successfully!" });
        setTimeout(() => router.push("/admin/corporate/businesses"), 1000);
      } else {
        const err = await res.json();
        setMessage({ type: "error", text: err.error || "Save failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-slate-400 animate-pulse">Loading…</div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/admin/corporate/businesses" className="text-sm text-slate-500 hover:text-slate-900">← Businesses</Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-lg font-black text-slate-900">{isEdit ? "Edit Division" : "New Division"}</h1>
          </div>
          <button onClick={handleSubmit} disabled={saving} className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors disabled:opacity-50">
            {saving ? "Saving…" : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-4">
        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name *</label>
              <input className={inputCls} value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <input className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value as BusinessDivisionStatus)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Logo URL</label>
              <input className={inputCls} value={form.logo} onChange={(e) => set("logo", e.target.value)} />
              <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} aria-label="Upload business logo" className="mt-2 block w-full text-xs" onChange={(event) => { const file = event.target.files?.[0]; event.currentTarget.value = ""; void uploadBusinessImage("logo", file); }} />
            </div>
            <div>
              <label className={labelCls}>Banner URL</label>
              <input className={inputCls} value={form.banner} onChange={(e) => set("banner", e.target.value)} />
              <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} aria-label="Upload business banner" className="mt-2 block w-full text-xs" onChange={(event) => { const file = event.target.files?.[0]; event.currentTarget.value = ""; void uploadBusinessImage("banner", file); }} />
            </div>
            <div>
              <label className={labelCls}>Contact Email</label>
              <input className={inputCls} type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Contact Phone</label>
              <input className={inputCls} value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input className={inputCls} type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Short Description</label>
            <input className={inputCls} value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={4} className={inputCls} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Associated Websites</label>
            <select
              multiple
              className={`${inputCls} min-h-32`}
              value={form.websiteIds}
              onChange={(event) => set("websiteIds", Array.from(event.target.selectedOptions, (option) => option.value))}
              aria-describedby="website-association-help"
            >
              {websites.map((website) => <option key={website.id} value={website.id}>{website.name}</option>)}
            </select>
            <p id="website-association-help" className="mt-1 text-xs text-slate-500">Use Ctrl or Command to select multiple websites. New websites can be added in Website Management.</p>
          </div>
        </div>

        {/* Objectives */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block font-bold text-slate-900 mb-3 text-sm">Objectives</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.objectives.map((o, i) => (
              <span key={i} className="flex items-center gap-1 bg-[#FFF33D]/25 text-black border border-black/10 text-xs px-3 py-1 rounded-full">
                {o}
                <button onClick={() => removeItem("objectives", i)} className="text-red-400 hover:text-red-600 ml-1">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className={inputCls} placeholder="Add objective…" value={objectiveInput} onChange={(e) => setObjectiveInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { addItem("objectives", objectiveInput, () => setObjectiveInput("")); } }} />
            <button onClick={() => addItem("objectives", objectiveInput, () => setObjectiveInput(""))} className="px-4 py-2 bg-slate-900 text-white text-sm rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors whitespace-nowrap">+ Add</button>
          </div>
        </div>

        {/* Products & Services */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <label className="block font-bold text-slate-900 mb-3 text-sm">Products & Services</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.productsAndServices.map((s, i) => (
              <span key={i} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">
                {s}
                <button onClick={() => removeItem("productsAndServices", i)} className="text-red-400 hover:text-red-600 ml-1">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className={inputCls} placeholder="Add product/service…" value={serviceInput} onChange={(e) => setServiceInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { addItem("productsAndServices", serviceInput, () => setServiceInput("")); } }} />
            <button onClick={() => addItem("productsAndServices", serviceInput, () => setServiceInput(""))} className="px-4 py-2 bg-slate-900 text-white text-sm rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors whitespace-nowrap">+ Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

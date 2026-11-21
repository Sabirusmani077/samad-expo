"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { WebsiteListing, WebsiteStatus, BusinessDivision } from "@/lib/types";

const inputCls =
  "w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black bg-white";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1";

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type FormData = {
  name: string;
  slug: string;
  logo: string;
  banner: string;
  screenshots: string[];
  previewVideoUrl: string;
  description: string;
  shortDescription: string;
  category: string;
  features: string[];
  productsAndServices: string[];
  url: string;
  launchDate: string;
  status: WebsiteStatus;
  businessDivisionId: string;
  ownershipType: "owned" | "operated" | "managed" | "partnership" | "external_partnership" | "other";
  showOwnershipPublicly: boolean;
  analyticsEnabled: boolean;
  isPublic: boolean;
  sortOrder: number;
};

const defaultForm: FormData = {
  name: "",
  slug: "",
  logo: "",
  banner: "",
  screenshots: [],
  previewVideoUrl: "",
  description: "",
  shortDescription: "",
  category: "Web Applications",
  features: [],
  productsAndServices: [],
  url: "",
  launchDate: "",
  status: "live",
  businessDivisionId: "",
  ownershipType: "owned",
  showOwnershipPublicly: false,
  analyticsEnabled: false,
  isPublic: true,
  sortOrder: 0,
};

export default function WebsiteForm({ id }: { id?: string }) {
  const router = useRouter();
  const isEdit = !!id;
  const [form, setForm] = useState<FormData>(defaultForm);
  const [divisions, setDivisions] = useState<BusinessDivision[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const [screenshotInput, setScreenshotInput] = useState("");
  const [productInput, setProductInput] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch business divisions for dropdown
    fetch("/api/corporate/businesses")
      .then((r) => r.json())
      .then((d) => setDivisions(Array.isArray(d) ? d : d.businessDivisions || []))
      .catch(() => {});

    if (!isEdit) return;
    fetch(`/api/corporate/websites/${id}`)
      .then((r) => r.json())
      .then((response) => {
        const data = response.websiteListing as WebsiteListing;
        if (!data) throw new Error("Website listing not found.");
        setForm({
          name: data.name || "",
          slug: data.slug || "",
          logo: data.logo || "",
          banner: data.banner || "",
          screenshots: data.screenshots || [],
          previewVideoUrl: data.previewVideoUrl || "",
          description: data.description || "",
          shortDescription: data.shortDescription || "",
          category: data.category || "Web Applications",
          features: data.features || [],
          productsAndServices: data.productsAndServices || [],
          url: data.url || "",
          launchDate: data.launchDate || "",
          status: data.status || "live",
          businessDivisionId: data.businessDivisionId || "",
          ownershipType: data.ownershipType || "owned",
          showOwnershipPublicly: data.showOwnershipPublicly === true,
          analyticsEnabled: data.analyticsEnabled === true,
          isPublic: data.isPublic !== false,
          sortOrder: data.sortOrder || 0,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, isEdit]);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : slugify(name),
    }));
  };

  const uploadImage = async (file?: File) => {
    if (!file) return null;
    setUploading(true);
    setMessage(null);
    try {
      const payload = new FormData();
      payload.set("file", file);
      const response = await fetch("/api/admin/media", { method: "POST", body: payload });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Image upload failed.");
      return data.item.url as string;
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Image upload failed." });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Website name is required." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const url = isEdit ? `/api/corporate/websites/${id}` : "/api/corporate/websites";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage({ type: "success", text: isEdit ? "Updated successfully!" : "Created successfully!" });
        setTimeout(() => router.push("/admin/corporate/websites"), 800);
      } else {
        setMessage({ type: "error", text: "Save failed. Please check inputs." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error saving website." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading website details...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/admin/corporate/websites" className="text-sm text-slate-500 hover:text-slate-900">
              ← Websites
            </Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-lg font-black text-slate-900">
              {isEdit ? `Edit: ${form.name}` : "Add New Website to Ecosystem"}
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Website"}
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

        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Website Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Website Name *</label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. MDK Web Suite"
              />
            </div>
            <div>
              <label className={labelCls}>Slug (URL identifier)</label>
              <input
                className={inputCls}
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                placeholder="e.g. mdk-web-suite"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Website URL</label>
              <input
                className={inputCls}
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                placeholder="https://app.mdenterprises.in"
              />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              >
                <option value="Web Applications">Web Application</option>
                <option value="Corporate Websites">Corporate Website</option>
                <option value="Educational Platforms">Educational Platform</option>
                <option value="Business Management Systems">Business Management</option>
                <option value="Digital Products">Digital Product</option>
                <option value="Technology Solutions">Technology Solution</option>
                <option value="Other Online Platforms">Other Online Platform</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Operational Status</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as WebsiteStatus }))}
              >
                <option value="live">Live</option>
                <option value="under_development">Under Development</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="temporarily_unavailable">Temporarily Unavailable</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Related Business Division</label>
              <select
                className={inputCls}
                value={form.businessDivisionId}
                onChange={(e) => setForm((p) => ({ ...p, businessDivisionId: e.target.value }))}
              >
                <option value="">None / Independent</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Ownership Relationship</label>
              <select
                className={inputCls}
                value={form.ownershipType}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    ownershipType: e.target.value as FormData["ownershipType"],
                  }))
                }
              >
                <option value="owned">Owned by Samad Expo</option>
                <option value="operated">Operated by Samad Expo</option>
                <option value="managed">Managed by Samad Expo</option>
                <option value="partnership">Partnership</option>
                <option value="external_partnership">External Partnership</option>
                <option value="other">Other relationship</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Launch Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.launchDate}
                onChange={(e) => setForm((p) => ({ ...p, launchDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Short Summary (for directory cards)</label>
            <input
              className={inputCls}
              value={form.shortDescription}
              onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))}
              placeholder="One or two sentences describing this platform"
            />
          </div>

          <div>
            <label className={labelCls}>Detailed Description</label>
            <textarea
              className={`${inputCls} h-28`}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Comprehensive description of the website, its purpose, target audience, and capabilities..."
            />
          </div>
        </div>

        {/* Media & Visual Assets */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Visual Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Logo Image URL</label>
              <input
                className={inputCls}
                value={form.logo}
                onChange={(e) => setForm((p) => ({ ...p, logo: e.target.value }))}
                placeholder="https://..."
              />
              <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} aria-label="Upload website logo" className="mt-2 block w-full text-xs" onChange={async (event) => { const file = event.target.files?.[0]; event.currentTarget.value = ""; const url = await uploadImage(file); if (url) setForm((previous) => ({ ...previous, logo: url })); }} />
            </div>
            <div>
              <label className={labelCls}>Banner Image URL</label>
              <input
                className={inputCls}
                value={form.banner}
                onChange={(e) => setForm((p) => ({ ...p, banner: e.target.value }))}
                placeholder="https://..."
              />
              <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} aria-label="Upload website banner" className="mt-2 block w-full text-xs" onChange={async (event) => { const file = event.target.files?.[0]; event.currentTarget.value = ""; const url = await uploadImage(file); if (url) setForm((previous) => ({ ...previous, banner: url })); }} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Preview Video URL (optional)</label>
            <input
              className={inputCls}
              type="url"
              value={form.previewVideoUrl}
              onChange={(e) => setForm((p) => ({ ...p, previewVideoUrl: e.target.value }))}
              placeholder="https://example.com/website-preview.mp4"
            />
            <p className="mt-1 text-[11px] text-slate-500">Use a direct HTTPS MP4, WebM, or OGG link. A live site preview appears when the external page allows embedding.</p>
          </div>
          <div>
            <label className={labelCls}>Preview Screenshots (Add Image URLs)</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || form.screenshots.length >= 30} aria-label="Upload website screenshot" className="mb-3 block w-full text-xs" onChange={async (event) => { const file = event.target.files?.[0]; event.currentTarget.value = ""; const url = await uploadImage(file); if (url) setForm((previous) => ({ ...previous, screenshots: [...previous.screenshots, url] })); }} />
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                value={screenshotInput}
                onChange={(e) => setScreenshotInput(e.target.value)}
                placeholder="Paste screenshot image URL and click Add"
              />
              <button
                type="button"
                onClick={() => {
                  if (screenshotInput.trim()) {
                    setForm((p) => ({ ...p, screenshots: [...p.screenshots, screenshotInput.trim()] }));
                    setScreenshotInput("");
                  }
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.screenshots.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg text-xs">
                  <span className="truncate max-w-[200px]">{s}</span>
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, screenshots: p.screenshots.filter((_, i) => i !== idx) }))}
                    className="text-red-500 font-bold ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Features & Products/Services */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Features & Offerings</h2>
          <div>
            <label className={labelCls}>Key Features</label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="e.g. 24/7 Order Dispatch"
              />
              <button
                type="button"
                onClick={() => {
                  if (featureInput.trim()) {
                    setForm((p) => ({ ...p, features: [...p.features, featureInput.trim()] }));
                    setFeatureInput("");
                  }
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl"
              >
                Add Feature
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.features.map((f, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-[#FFF33D]/25 text-black border border-black/10 px-2 py-1 rounded-lg text-xs">
                  {f}
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, features: p.features.filter((_, i) => i !== idx) }))}
                    className="text-black font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Products & Services Offered on this Website</label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="e.g. Lifestyle Audio, Bags & Carry"
              />
              <button
                type="button"
                onClick={() => {
                  if (productInput.trim()) {
                    setForm((p) => ({
                      ...p,
                      productsAndServices: [...p.productsAndServices, productInput.trim()],
                    }));
                    setProductInput("");
                  }
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl"
              >
                Add Offering
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.productsAndServices.map((p, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs">
                  {p}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        productsAndServices: prev.productsAndServices.filter((_, i) => i !== idx),
                      }))
                    }
                    className="text-green-500 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-900">Show in Public Directory</div>
            <div className="text-xs text-slate-500">Enable this website to appear in the public Digital Ecosystem directory</div>
          </div>
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => setForm((p) => ({ ...p, isPublic: e.target.checked }))}
            className="w-5 h-5 rounded accent-[#FFF33D]"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5"><input type="checkbox" checked={form.showOwnershipPublicly} onChange={(e) => setForm((p) => ({ ...p, showOwnershipPublicly: e.target.checked }))} className="mt-1 h-4 w-4" /><span><span className="block text-sm font-bold text-slate-900">Display ownership relationship</span><span className="mt-1 block text-xs text-slate-500">Only enable after public approval. Domain, hosting, and credential details stay private.</span></span></label>
          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5"><input type="checkbox" checked={form.analyticsEnabled} onChange={(e) => setForm((p) => ({ ...p, analyticsEnabled: e.target.checked }))} className="mt-1 h-4 w-4" /><span><span className="block text-sm font-bold text-slate-900">Enable connected analytics</span><span className="mt-1 block text-xs text-slate-500">External events are accepted only when the server integration token is configured.</span></span></label>
        </div>
        {uploading && <p className="text-xs text-slate-500" aria-live="polite">Uploading image…</p>}
      </div>
    </div>
  );
}

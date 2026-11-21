"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CompanyProfile } from "@/lib/types";

type FormState = Partial<CompanyProfile>;

const inputCls =
  "w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFF33D] focus:border-black bg-white";
const labelCls = "block text-xs font-semibold text-slate-600 mb-1";
const sectionCls = "bg-white rounded-2xl border border-slate-200 p-6 mb-4";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={sectionCls}>
      <h2 className="font-black text-slate-900 mb-4 text-sm uppercase tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

export default function CompanyProfileEditor() {
  const [form, setForm] = useState<FormState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [coreValueInput, setCoreValueInput] = useState("");
  const [achievementInput, setAchievementInput] = useState("");
  const [achievementYear, setAchievementYear] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/corporate/company")
      .then((r) => r.json())
      .then((data) => {
        setForm(data.companyProfile || {});
        setLoading(false);
      })
      .catch(() => {
        setMessage({ type: "error", text: "Failed to load company profile." });
        setLoading(false);
      });
  }, []);

  const set = (key: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setNested = (parent: string, key: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      [parent]: { ...(prev as Record<string, Record<string, string>>)[parent], [key]: value },
    }));

  const uploadCompanyImage = async (key: "logo" | "favicon" | "founderPhoto", file?: File) => {
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

  const addCoreValue = () => {
    const title = coreValueInput.trim();
    if (!title) return;
    setForm((prev) => ({ ...prev, coreValues: [...(prev.coreValues || []), { title, description: "", icon: "Sparkles" }] }));
    setCoreValueInput("");
  };

  const addAchievement = () => {
    const title = achievementInput.trim();
    if (!title) return;
    setForm((prev) => ({ ...prev, achievements: [...(prev.achievements || []), { title, description: "", year: achievementYear.trim() }] }));
    setAchievementInput("");
    setAchievementYear("");
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/corporate/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Company profile saved successfully!" });
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
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-sm animate-pulse">Loading company profile…</div>
      </div>
    );
  }

  const fp = form as Record<string, unknown>;
  const socialLinks = (fp.socialLinks as Record<string, string>) || {};
  const brandColors = (fp.brandColors as { primary?: string; accent?: string }) || { primary: "#000000", accent: "#FFF33D" };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/admin/corporate" className="text-sm text-slate-500 hover:text-slate-900">← Corporate Admin</Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-lg font-black text-slate-900">Company Profile</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
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

        {/* Basic Info */}
        <Section title="Basic Info">
          <FieldGroup>
            <Field label="Company Name">
              <input className={inputCls} value={(fp.businessName as string) || ""} onChange={(e) => set("businessName", e.target.value)} />
            </Field>
            <Field label="Legal Name">
              <input className={inputCls} value={(fp.legalName as string) || ""} onChange={(e) => set("legalName", e.target.value)} />
            </Field>
            <Field label="Tagline">
              <input className={inputCls} value={(fp.tagline as string) || ""} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
            <Field label="Logo URL">
              <input className={inputCls} value={(fp.logo as string) || ""} onChange={(e) => set("logo", e.target.value)} />
              <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} aria-label="Upload company logo" className="mt-2 block w-full text-xs" onChange={(event) => { const file = event.target.files?.[0]; event.currentTarget.value = ""; void uploadCompanyImage("logo", file); }} />
            </Field>
            <Field label="Favicon URL">
              <input className={inputCls} value={(fp.favicon as string) || ""} onChange={(e) => set("favicon", e.target.value)} />
              <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} aria-label="Upload favicon" className="mt-2 block w-full text-xs" onChange={(event) => { const file = event.target.files?.[0]; event.currentTarget.value = ""; void uploadCompanyImage("favicon", file); }} />
            </Field>
            <Field label="Founded">
              <input className={inputCls} value={(fp.founded as string) || ""} onChange={(e) => set("founded", e.target.value)} />
            </Field>
            <Field label="Headquarters">
              <input className={inputCls} value={(fp.headquarters as string) || ""} onChange={(e) => set("headquarters", e.target.value)} />
            </Field>
          </FieldGroup>
        </Section>

        <Section title="Brand Identity">
          <FieldGroup>
            <Field label="Primary Color">
              <input type="color" className={`${inputCls} h-11 p-1`} value={brandColors.primary || "#000000"} onChange={(e) => set("brandColors", { ...brandColors, primary: e.target.value })} />
            </Field>
            <Field label="Accent Color">
              <input type="color" className={`${inputCls} h-11 p-1`} value={brandColors.accent || "#FFF33D"} onChange={(e) => set("brandColors", { ...brandColors, accent: e.target.value })} />
            </Field>
            <Field label="Typography (CSS font family)" full>
              <input className={inputCls} placeholder="Manrope, Arial, sans-serif" value={(fp.brandFontFamily as string) || ""} onChange={(e) => set("brandFontFamily", e.target.value)} />
            </Field>
          </FieldGroup>
        </Section>

        {/* About & Story */}
        <Section title="About & Story">
          <FieldGroup>
            <Field label="About" full>
              <textarea rows={4} className={inputCls} value={(fp.about as string) || ""} onChange={(e) => set("about", e.target.value)} />
            </Field>
            <Field label="Story" full>
              <textarea rows={4} className={inputCls} value={(fp.story as string) || ""} onChange={(e) => set("story", e.target.value)} />
            </Field>
          </FieldGroup>
        </Section>

        {/* Vision & Mission */}
        <Section title="Vision & Mission">
          <FieldGroup>
            <Field label="Vision" full>
              <textarea rows={3} className={inputCls} value={(fp.vision as string) || ""} onChange={(e) => set("vision", e.target.value)} />
            </Field>
            <Field label="Mission" full>
              <textarea rows={3} className={inputCls} value={(fp.mission as string) || ""} onChange={(e) => set("mission", e.target.value)} />
            </Field>
          </FieldGroup>
        </Section>

        {/* Core Values */}
        <Section title="Core Values">
          <div className="space-y-3 mb-4">
            {(form.coreValues || []).map((value, index) => (
              <div key={`${value.title}-${index}`} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                <input aria-label="Core value title" className={inputCls} value={value.title} onChange={(event) => set("coreValues", (form.coreValues || []).map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} />
                <input aria-label="Core value description" className={inputCls} value={value.description} onChange={(event) => set("coreValues", (form.coreValues || []).map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))} />
                <button type="button" onClick={() => set("coreValues", (form.coreValues || []).filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className={inputCls}
              placeholder="Add core value…"
              value={coreValueInput}
              onChange={(e) => setCoreValueInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addCoreValue();
                }
              }}
            />
            <button
              onClick={addCoreValue}
              className="px-4 py-2 bg-slate-900 text-white text-sm rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors whitespace-nowrap"
            >
              + Add
            </button>
          </div>
        </Section>

        {/* Founder Info */}
        <Section title="Founder Info">
          <FieldGroup>
            <Field label="Founder Name">
              <input className={inputCls} value={(fp.founderName as string) || ""} onChange={(e) => set("founderName", e.target.value)} />
            </Field>
            <Field label="Founder Designation">
              <input className={inputCls} value={(fp.founderDesignation as string) || ""} onChange={(e) => set("founderDesignation", e.target.value)} />
            </Field>
            <Field label="Founder Photo URL">
              <input className={inputCls} value={(fp.founderPhoto as string) || ""} onChange={(e) => set("founderPhoto", e.target.value)} />
              <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} aria-label="Upload founder photograph" className="mt-2 block w-full text-xs" onChange={(event) => { const file = event.target.files?.[0]; event.currentTarget.value = ""; void uploadCompanyImage("founderPhoto", file); }} />
            </Field>
            <Field label="Founder Biography" full>
              <textarea rows={4} className={inputCls} value={(fp.founderBio as string) || ""} onChange={(e) => set("founderBio", e.target.value)} />
            </Field>
            <Field label="Founder Message" full>
              <textarea rows={4} className={inputCls} value={(fp.founderMessage as string) || ""} onChange={(e) => set("founderMessage", e.target.value)} />
            </Field>
          </FieldGroup>
        </Section>

        {/* Achievements */}
        <Section title="Achievements">
          <div className="flex flex-wrap gap-2 mb-3">
            {form.achievements?.map((achievement, index) => (
              <div key={`${achievement.title}-${index}`} className="mb-3 grid gap-2 md:grid-cols-[2fr_1fr_2fr_auto]">
                <input aria-label="Achievement title" className={inputCls} value={achievement.title} onChange={(event) => set("achievements", (form.achievements || []).map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} />
                <input aria-label="Achievement year" className={inputCls} value={achievement.year} onChange={(event) => set("achievements", (form.achievements || []).map((item, itemIndex) => itemIndex === index ? { ...item, year: event.target.value } : item))} />
                <input aria-label="Achievement description" className={inputCls} value={achievement.description} onChange={(event) => set("achievements", (form.achievements || []).map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))} />
                <button type="button" onClick={() => set("achievements", (form.achievements || []).filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">Remove</button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              className={inputCls}
              placeholder="Add achievement…"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addAchievement();
                }
              }}
            />
            <input className={inputCls} placeholder="Year (optional)" value={achievementYear} onChange={(e) => setAchievementYear(e.target.value)} />
            <button
              onClick={addAchievement}
              className="px-4 py-2 bg-slate-900 text-white text-sm rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors whitespace-nowrap"
            >
              + Add
            </button>
          </div>
        </Section>

        {/* Social Links */}
        <Section title="Social Links">
          <FieldGroup>
            {["website", "linkedin", "twitter", "instagram", "facebook", "youtube"].map((key) => (
              <Field key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                <input className={inputCls} value={socialLinks[key] || ""} onChange={(e) => setNested("socialLinks", key, e.target.value)} />
              </Field>
            ))}
          </FieldGroup>
        </Section>

        {/* Contact */}
        <Section title="Contact">
          <FieldGroup>
            <Field label="Contact Email">
              <input className={inputCls} value={(fp.contactEmail as string) || ""} onChange={(e) => set("contactEmail", e.target.value)} />
            </Field>
            <Field label="Contact Phone">
              <input className={inputCls} value={(fp.contactPhone as string) || ""} onChange={(e) => set("contactPhone", e.target.value)} />
            </Field>
            <Field label="Address" full>
              <textarea rows={2} className={inputCls} value={(fp.contactAddress as string) || ""} onChange={(e) => set("contactAddress", e.target.value)} />
            </Field>
          </FieldGroup>
        </Section>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-[#FFF33D] hover:text-black transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

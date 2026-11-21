"use client";

import { useEffect, useState } from "react";

type MediaItem = { name: string; url: string };

export default function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/media");
    const data = await response.json();
    setItems(Array.isArray(data.items) ? data.items : []);
  }

  useEffect(() => { load().catch(() => setMessage("Media library could not be loaded.")); }, []);

  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    setMessage("");
    const formData = new FormData();
    formData.set("file", file);
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setMessage(`Uploaded ${data.item.name}. Copy ${data.item.url} into the relevant profile field.`);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen p-5 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header><p className="text-xs font-bold uppercase tracking-widest text-emerald-800">Digital assets</p><h1 className="mt-1 text-3xl font-black">Media library</h1><p className="mt-2 text-sm text-slate-600">Upload JPEG, PNG, or WebP images up to 5 MB. SVG and other file types are rejected.</p></header>
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <label className="block text-sm font-bold" htmlFor="media-upload">Add an image</label>
          <input id="media-upload" className="mt-3 block w-full text-sm" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; event.currentTarget.value = ""; void upload(file); }} />
          {busy && <p className="mt-3 text-xs text-slate-500">Uploading…</p>}
          {message && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-700" aria-live="polite">{message}</p>}
        </section>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => <article key={item.name} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><img src={item.url} alt="Uploaded corporate media" className="h-40 w-full object-cover" /><div className="break-all p-3"><p className="text-xs font-bold">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.url}</p></div></article>)}
          {!items.length && <p className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No uploaded images yet.</p>}
        </section>
      </div>
    </main>
  );
}

"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  ArrowLeft,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Copy,
  Check,
  Rocket,
} from "lucide-react";
import { HostedProject } from "@/lib/types";

type ViewportMode = "desktop" | "tablet" | "mobile";

export default function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<HostedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployMessage, setDeployMessage] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not find requested project.");
        return res.json();
      })
      .then((data) => {
        setProject(data.project);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load project.");
        setLoading(false);
      });
  }, [id]);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleCopyUrl = (url: string) => {
    const full = window.location.origin + url;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeploy = async () => {
    if (!project) return;
    setDeploying(true);
    setDeployMessage("");
    try {
      const res = await fetch(`/api/projects/${project.id}/deploy`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setProject(data.project);
        setDeployMessage("Website deployed live!");
        setIframeKey((prev) => prev + 1);
      } else {
        setDeployMessage(`Deploy failed: ${data.error}`);
      }
    } catch {
      setDeployMessage("Deploy failed due to network error.");
    } finally {
      setDeploying(false);
      setTimeout(() => setDeployMessage(""), 4000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FFF33D] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Loading Preview Environment...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h1 className="text-xl font-bold">Preview Unavailable</h1>
          <p className="text-xs text-zinc-400">{error || "Project could not be found."}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF33D] text-black text-xs font-bold hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const liveUrl = `/sites/${project.slug}`;

  // Viewport container width constraints
  const viewportStyles: Record<ViewportMode, string> = {
    desktop: "w-full max-w-full",
    tablet: "w-[768px] max-w-[95vw] shadow-2xl rounded-2xl border-4 border-zinc-800",
    mobile: "w-[390px] max-w-[95vw] shadow-2xl rounded-3xl border-4 border-zinc-800",
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
      {/* Top Preview Control Bar */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between gap-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                {project.projectName}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  project.deploymentStatus === "live"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {project.deploymentStatus}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono truncate">{liveUrl}</p>
          </div>
        </div>

        {/* Viewport Switcher */}
        <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewport === "desktop"
                ? "bg-[#FFF33D] text-black font-bold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Desktop (100% full width)"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden lg:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport("tablet")}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewport === "tablet"
                ? "bg-[#FFF33D] text-black font-bold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Tablet (768px width)"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden lg:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewport === "mobile"
                ? "bg-[#FFF33D] text-black font-bold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
            title="Mobile (390px width)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden lg:inline">Mobile</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
            title="Refresh preview frame"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleCopyUrl(liveUrl)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            title="Copy Public URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy URL"}</span>
          </button>

          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open Tab</span>
          </a>

          <button
            type="button"
            onClick={handleDeploy}
            disabled={deploying}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFF33D] text-black text-xs font-extrabold hover:bg-white transition-all disabled:opacity-50"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>{deploying ? "Deploying..." : "Deploy"}</span>
          </button>
        </div>
      </header>

      {deployMessage && (
        <div className="bg-emerald-500 text-black px-4 py-1.5 text-center text-xs font-bold">
          {deployMessage}
        </div>
      )}

      {/* Main Preview Sandbox Frame */}
      <main className="flex-1 bg-[#121212] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 flex flex-col bg-white overflow-hidden ${viewportStyles[viewport]}`}
        >
          <iframe
            key={iframeKey}
            src={liveUrl}
            title={`${project.projectName} live preview`}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </main>
    </div>
  );
}

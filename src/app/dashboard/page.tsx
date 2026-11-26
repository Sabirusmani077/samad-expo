"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Upload,
  Globe,
  ExternalLink,
  Eye,
  Trash2,
  RefreshCw,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  Copy,
  Check,
  Edit3,
  X,
  FileCode,
  Layers,
  Sparkles,
  LayoutDashboard,
  Menu,
  LogOut,
  ChevronRight,
  User as UserIcon,
  Lock,
  Mail,
  Phone,
  KeyRound,
} from "lucide-react";
import { HostedProject, PublicUser, ProjectVisibility } from "@/lib/types";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card3D } from "@/components/Card3D";
import { ThreeHeroCanvas } from "@/components/ThreeHeroCanvas";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"projects" | "upload" | "profile">("projects");
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<HostedProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Profile Form State
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "profile") {
      setActiveTab("profile");
    } else if (tab === "upload" || searchParams?.get("action") === "upload") {
      setActiveTab("upload");
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch {
      window.location.reload();
    }
  };

  // Upload Modal State
  const [uploadOpen, setUploadOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<ProjectVisibility>("public");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Modal State
  const [editingProject, setEditingProject] = useState<HostedProject | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editVisibility, setEditVisibility] = useState<ProjectVisibility>("public");
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Action status
  const [actionMessage, setActionMessage] = useState("");

  const fetchUserDataAndProjects = async () => {
    try {
      const userRes = await fetch("/api/auth/me");
      if (!userRes.ok) {
        setUser(null);
        setLoading(false);
        return;
      }
      const userData = await userRes.json();
      if (!userData.user) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(userData.user);
      setProfileName(userData.user.name || "");
      setProfilePhone(userData.user.phone || "");

      const projRes = await fetch("/api/projects");
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData.userProjects || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setProfileSaving(true);

    try {
      const payload: Record<string, string> = {
        name: profileName,
        phone: profilePhone,
      };

      if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword) {
          setProfileError("Please enter your current password to change password.");
          setProfileSaving(false);
          return;
        }
        if (newPassword.length < 8) {
          setProfileError("New password must be at least 8 characters long.");
          setProfileSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          setProfileError("New password and confirmation password do not match.");
          setProfileSaving(false);
          return;
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error || "Failed to update profile.");
        return;
      }

      setUser(data.user);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setProfileSuccess("Developer profile and credentials updated successfully!");
      setTimeout(() => setProfileSuccess(""), 4000);
    } catch {
      setProfileError("Network error. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  useEffect(() => {
    fetchUserDataAndProjects();
  }, []);

  const handleCopyUrl = (url: string, id: string) => {
    const full = window.location.origin + url;
    navigator.clipboard.writeText(full);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a website ZIP archive.");
      return;
    }
    setUploadError("");
    setUploadSuccess("");
    setUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("projectName", projectName);
    formData.append("description", description);
    formData.append("visibility", visibility);

    try {
      const interval = setInterval(() => {
        setUploadProgress((p) => (p < 85 ? p + 15 : p));
      }, 300);

      const res = await fetch("/api/projects/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Upload failed.");
        setUploading(false);
        return;
      }

      setUploadSuccess("Website uploaded and activated successfully!");
      setProjects((prev) => [data.project, ...prev]);
      setTimeout(() => {
        setUploadOpen(false);
        setActiveTab("projects");
        setProjectName("");
        setDescription("");
        setSelectedFile(null);
        setUploadSuccess("");
        setUploadProgress(0);
        setUploading(false);
      }, 1200);
    } catch {
      setUploadError("Network connection interrupted during upload.");
      setUploading(false);
    }
  };

  const handleRedeploy = async (projectId: string) => {
    setActionMessage("Redeploying project...");
    try {
      const res = await fetch(`/api/projects/${projectId}/deploy`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? data.project : p))
        );
        setActionMessage("Project redeployed and live!");
      } else {
        setActionMessage(`Error: ${data.error}`);
      }
    } catch {
      setActionMessage("Redeploy failed.");
    }
    setTimeout(() => setActionMessage(""), 3000);
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this website? All deployed static files will be permanently removed.")) {
      return;
    }
    setDeletingId(projectId);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        setActionMessage("Project deleted.");
      } else {
        const d = await res.json();
        alert(d.error || "Could not delete project.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setDeletingId(null);
      setTimeout(() => setActionMessage(""), 3000);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setSavingEdit(true);

    try {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: editName,
          description: editDesc,
          visibility: editVisibility,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProject.id ? data.project : p))
        );
        setEditingProject(null);
      } else {
        alert(data.error || "Failed to update project.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Filtered projects
  const filteredProjects = projects.filter(
    (p) =>
      p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalStorageBytes = projects.reduce((acc, p) => acc + (p.storageUsedBytes || 0), 0);
  const liveCount = projects.filter((p) => p.deploymentStatus === "live").length;
  const totalViews = projects.reduce((acc, p) => acc + (p.viewCount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060608] samad-hero-grid text-white flex items-center justify-center relative overflow-hidden">
        <ThreeHeroCanvas variant="dark" />
        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="w-10 h-10 border-4 border-[#FFF33D] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#FFF33D]">
            Loading Developer Workspace...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in view
  if (!user) {
    return (
      <div className="min-h-[85vh] bg-[#060608] samad-hero-grid text-white flex items-center justify-center p-4 relative overflow-hidden">
        <ThreeHeroCanvas variant="dark" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#FFF33D]/15 blur-[130px]" />

        <div className="max-w-md w-full relative z-10">
          <Card3D intensity={8}>
            <div className="samad-card text-center space-y-6 p-8 border-[#FFF33D]/35">
              <div className="mb-4 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/primary-logo.png"
                  alt="Samad Expo Logo"
                  className="h-16 w-16 rounded-2xl object-cover border border-[#FFF33D]/40 shadow-lg shadow-[#FFF33D]/15 select-none"
                />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">
                  Authentication Required
                </h1>
                <p className="mt-2 text-sm text-zinc-400">
                  Please sign in with your developer account to manage your hosted websites and deployments.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/login?next=/dashboard"
                  className="btn-3d-yellow flex-1 py-3 rounded-full text-xs uppercase tracking-wider"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-3d-black flex-1 py-3 rounded-full text-xs uppercase tracking-wider"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </Card3D>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#060608] samad-hero-grid text-white flex flex-col lg:flex-row">
      <ThreeHeroCanvas
        variant="dark"
        className="fixed inset-0 w-full h-full z-0 opacity-40 pointer-events-none"
      />
      <DashboardSidebar
        currentTab={activeTab}
        onTabChange={setActiveTab}
        onUploadClick={() => setUploadOpen(true)}
        projectCount={projects.length}
      />

      {/* Main Content Area (Offset for sidebar on desktop) */}
      <div className="relative z-10 flex-1 lg:pl-72 flex flex-col min-w-0">
        {actionMessage && (
          <div className="bg-[#FFF33D] text-black px-4 py-2 text-center text-xs font-bold animate-fade-in sticky top-0 z-20">
            {actionMessage}
          </div>
        )}

        {/* Main Container */}
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {activeTab === "upload" ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF33D]/10 text-[#FFF33D] text-[10px] font-bold uppercase tracking-wider border border-[#FFF33D]/20">
                      Instant ZIP Deployment
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Upload Website or Web App</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Deploy static HTML, CSS, JavaScript web applications in seconds with automatic sandboxing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("projects")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>← Back to My Projects ({projects.length})</span>
                </button>
              </div>

              {uploadError && (
                <div className="p-4 bg-red-950/50 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="p-4 bg-emerald-950/50 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form */}
                <div className="lg:col-span-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-xl">
                  <form onSubmit={handleUploadSubmit} className="space-y-6">
                    {/* File Dropzone */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                        Select Website ZIP Archive <span className="text-[#FFF33D]">*</span>
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-zinc-800 hover:border-[#FFF33D] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-zinc-900/40 group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".zip,application/zip"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedFile(e.target.files[0]);
                              if (!projectName) {
                                setProjectName(
                                  e.target.files[0].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
                                );
                              }
                            }
                          }}
                          className="hidden"
                        />
                        {selectedFile ? (
                          <div className="space-y-2">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFF33D]/10 border border-[#FFF33D]/30 flex items-center justify-center text-[#FFF33D]">
                              <FileCode className="w-7 h-7" />
                            </div>
                            <p className="text-sm font-extrabold text-white">{selectedFile.name}</p>
                            <p className="text-xs text-emerald-400 font-semibold">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB &bull; Ready to deploy
                            </p>
                            <span className="inline-block text-[11px] text-zinc-400 underline pt-1">
                              Click to choose a different ZIP file
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-[#FFF33D] group-hover:border-[#FFF33D]/40 transition-colors">
                              <Upload className="w-7 h-7" />
                            </div>
                            <p className="text-sm font-bold text-zinc-200">
                              Click to browse or drag &amp; drop ZIP archive
                            </p>
                            <p className="text-xs text-zinc-500">
                              Supports static sites, SPAs, landing pages (up to 50MB)
                            </p>
                            <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 mt-2">
                              Archive must contain <code className="text-[#FFF33D]">index.html</code>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Project Name <span className="text-[#FFF33D]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          placeholder="e.g. My Portfolio or Web App"
                          className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFF33D] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Visibility
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setVisibility("public")}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                              visibility === "public"
                                ? "border-[#FFF33D] bg-[#FFF33D]/10 text-[#FFF33D]"
                                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                            }`}
                          >
                            Public
                          </button>
                          <button
                            type="button"
                            onClick={() => setVisibility("private")}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                              visibility === "private"
                                ? "border-[#FFF33D] bg-[#FFF33D]/10 text-[#FFF33D]"
                                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                            }`}
                          >
                            Private
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Short Description (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Briefly describe what this website or web app does..."
                        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFF33D] transition-colors"
                      />
                    </div>

                    {uploading && (
                      <div className="space-y-1.5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                        <div className="flex justify-between text-xs text-zinc-300 font-bold">
                          <span>Extracting, verifying &amp; deploying files...</span>
                          <span className="text-[#FFF33D]">{uploadProgress}%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#FFF33D] transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={uploading || !selectedFile}
                        className="flex-1 py-3.5 rounded-xl bg-[#FFF33D] hover:bg-white text-black font-black text-xs uppercase tracking-wider transition-all disabled:opacity-40 shadow-lg cursor-pointer"
                      >
                        {uploading ? "Deploying Website..." : "Deploy Website Now"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("projects")}
                        className="py-3.5 px-5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>

                {/* Guidelines sidebar */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                      <Sparkles className="w-4 h-4 text-[#FFF33D]" />
                      <span>Deployment Guidelines</span>
                    </div>
                    <ul className="space-y-3 text-xs text-zinc-400">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FFF33D] shrink-0 mt-0.5" />
                        <span>Archive must contain an <strong>index.html</strong> file in the root directory.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FFF33D] shrink-0 mt-0.5" />
                        <span>Use relative asset paths (e.g. <code>./assets/style.css</code>) for CSS, JS, and images.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FFF33D] shrink-0 mt-0.5" />
                        <span>Static frameworks (Vite, React build, HTML5, Tailwind build) are fully supported.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FFF33D] shrink-0 mt-0.5" />
                        <span>Uploaded sites receive an instant production URL under <code>/sites/[username]/[project]</code>.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "profile" ? (
            <div className="space-y-6 animate-fade-in">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF33D]/10 text-[#FFF33D] text-[10px] font-bold uppercase tracking-wider border border-[#FFF33D]/20">
                      Developer Console &bull; Account Center
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Developer Profile &amp; Account</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage your developer identity, security credentials, and platform allocations.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("projects")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>&larr; Back to My Projects ({projects.length})</span>
                </button>
              </div>

              {profileError && (
                <div className="p-4 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              {profileSuccess && (
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Personal Info & Edit Form */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-6">
                    <div className="flex items-center gap-4 pb-5 border-b border-zinc-850">
                      <div className="w-16 h-16 rounded-2xl bg-[#FFF33D] text-black font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                        {user ? user.name.slice(0, 2).toUpperCase() : "SA"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-white truncate">{user?.name}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            Active
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">{user?.email}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-500">
                          <span>Role: <strong className="text-[#FFF33D] font-bold">{user?.role === "admin" ? "Platform Administrator" : "Active Developer"}</strong></span>
                          <span>&bull;</span>
                          <span>ID: <code className="text-zinc-400">{user?.id?.slice(0, 12)}...</code></span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                          Developer / Display Name
                        </label>
                        <div className="relative">
                          <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            required
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFF33D] transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                          Registered Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="email"
                            disabled
                            value={user?.email || ""}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-850 bg-zinc-900/50 text-xs font-medium text-zinc-400 cursor-not-allowed"
                          />
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          Email address is permanently bound to your developer hosting account.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                          Phone / Mobile Number (Optional)
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="tel"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFF33D] transition"
                          />
                        </div>
                      </div>

                      {/* Password Change Sub-section */}
                      <div className="pt-4 border-t border-zinc-850 space-y-3.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-white">
                          <KeyRound className="w-4 h-4 text-[#FFF33D]" />
                          <span>Change Security Password (Optional)</span>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          Leave these fields blank if you do not wish to change your password.
                        </p>

                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current password"
                            className="w-full px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFF33D] transition"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                              New Password (Min 8 chars)
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="New password"
                              className="w-full px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFF33D] transition"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                              className="w-full px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-[#FFF33D] transition"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-end">
                        <button
                          type="submit"
                          disabled={profileSaving}
                          className="px-5 py-2.5 rounded-xl bg-[#FFF33D] text-black text-xs font-extrabold hover:bg-white transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
                        >
                          {profileSaving ? "Saving Updates..." : "Save Profile Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Right Column: Resource Quota & Session */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Storage Quota Card */}
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                        <HardDrive className="w-4 h-4 text-[#FFF33D]" />
                        <span>Cloud Storage Quota</span>
                      </div>
                      <span className="text-xs font-bold text-[#FFF33D]">
                        {((projects.reduce((acc, p) => acc + (p.storageUsedBytes || 0), 0) / (1024 * 1024))).toFixed(1)} / 500 MB
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full bg-zinc-850 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#FFF33D] h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,243,61,0.5)]"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                ((projects.reduce((acc, p) => acc + (p.storageUsedBytes || 0), 0) / (1024 * 1024)) / 500) * 100,
                                2
                              ),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Includes ZIP files, HTML, CSS, JS assets</span>
                        <span>500 MB Fair Quota</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-xl border border-zinc-850 bg-zinc-900/50">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Websites</span>
                        <span className="text-lg font-black text-white">{projects.length} Deployed</span>
                      </div>
                      <div className="p-3 rounded-xl border border-zinc-850 bg-zinc-900/50">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Live Status</span>
                        <span className="text-lg font-black text-emerald-400">{projects.filter(p => p.deploymentStatus === "live").length} Online</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab("upload")}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white transition cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-[#FFF33D]" />
                        <span>Upload New Project (+ ZIP)</span>
                      </button>
                    </div>
                  </div>

                  {/* Account Security & Sign Out Card */}
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                      <ShieldCheck className="w-4 h-4 text-[#FFF33D]" />
                      <span>Session &amp; Security</span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Sessions are encrypted and protected by HTTP-only secure cookie tokens. You will be redirected to the homepage when logging out.
                    </p>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-900/60 bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 text-xs font-bold transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out / Log Out of Console</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 3D Metric Cards */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card3D intensity={5} className="samad-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Websites</span>
                    <Layers className="w-4 h-4 text-[#FFF33D]" />
                  </div>
                  <p className="mt-3 text-2xl sm:text-3xl font-black text-white">{projects.length}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">Under your account</p>
                </Card3D>

                <Card3D intensity={5} className="samad-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Deployments</span>
                    <Globe className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="mt-3 text-2xl sm:text-3xl font-black text-emerald-400">{liveCount}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">Publicly accessible</p>
                </Card3D>

                <Card3D intensity={5} className="samad-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Storage Usage</span>
                    <HardDrive className="w-4 h-4 text-[#FFF33D]" />
                  </div>
                  <p className="mt-3 text-2xl sm:text-3xl font-black text-white">
                    {(totalStorageBytes / (1024 * 1024)).toFixed(2)} <span className="text-sm font-normal text-zinc-400">MB</span>
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-500">Of 500 MB included</p>
                </Card3D>

                <Card3D intensity={5} className="samad-card p-4 sm:p-5">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Traffic</span>
                    <Eye className="w-4 h-4 text-[#FFF33D]" />
                  </div>
                  <p className="mt-3 text-2xl sm:text-3xl font-black text-white">{totalViews.toLocaleString()}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">Cumulative website views</p>
                </Card3D>
              </section>

              {/* Quick Upload Action Banner */}
              <Card3D intensity={3} className="samad-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF33D]/15 border border-[#FFF33D]/35 flex items-center justify-center text-[#FFF33D] shrink-0">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Deploy a New Website or Web App</h3>
                    <p className="text-xs text-zinc-400">
                      Upload a ZIP archive containing your static HTML, CSS, JS, and assets. Live in seconds.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className="btn-3d-yellow inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs shrink-0 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload File (ZIP)</span>
                </button>
              </Card3D>

              {/* Section Header & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">My Websites &amp; Deployments</h2>
                  <p className="text-xs text-zinc-400">
                    Manage your live sites, inspect real-time preview frames, and copy public URLs.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full sm:w-64 rounded-xl bg-zinc-900 border border-zinc-800 pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFF33D] transition-colors"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF33D] text-black font-extrabold text-xs border border-black/20 hover:bg-white transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload Website</span>
                    <span className="sm:hidden">Upload</span>
                  </button>
                </div>
              </div>

              {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-800 p-12 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FFF33D]">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No websites found</h3>
              <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
                {searchQuery
                  ? "No projects match your search query."
                  : "You haven't uploaded any websites yet. Upload a ZIP of your HTML, CSS, and JS to deploy instantly."}
              </p>
            </div>
            {!searchQuery && (
              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFF33D] text-black text-xs font-extrabold hover:bg-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Upload First Website</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const liveUrl = `/sites/${project.slug}`;
              const isCopied = copiedId === project.id;

              return (
                <Card3D
                  key={project.id}
                  intensity={5}
                  className="samad-card p-5 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Top Status & Visibility */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          project.deploymentStatus === "live"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : project.deploymentStatus === "building"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {project.deploymentStatus}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-semibold text-zinc-500">
                          {project.visibility}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(project);
                            setEditName(project.projectName);
                            setEditDesc(project.description || "");
                            setEditVisibility(project.visibility);
                          }}
                          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="Edit settings"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === project.id}
                          onClick={() => handleDelete(project.id)}
                          className="p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                          title="Delete website"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Project Title & Desc */}
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[#FFF33D] transition-colors truncate">
                        {project.projectName}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-400 line-clamp-2 min-h-[32px]">
                        {project.description || "Static website deployment running on Samad Expo hosting infrastructure."}
                      </p>
                    </div>

                    {/* URL Bar */}
                    <div className="rounded-xl bg-zinc-900 border border-zinc-800/80 p-2 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-zinc-300 truncate">
                        {liveUrl}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(liveUrl, project.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="Copy deployment URL"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="Open live site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Row */}
                  <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-[11px]">
                      {(project.storageUsedBytes / 1024).toFixed(0)} KB &bull; {project.viewCount || 0} views
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/preview/${project.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#FFF33D]" />
                        <span>Preview</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleRedeploy(project.id)}
                        className="btn-3d-yellow inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Redeploy</span>
                      </button>
                    </div>
                  </div>
                </Card3D>
              );
            })}
          </div>
        )}
            </>
          )}
        </main>
      </div>

      {/* Upload Website Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => !uploading && setUploadOpen(false)}
              className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFF33D] text-black font-extrabold mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Upload &amp; Deploy Website</h3>
              <p className="mt-1 text-xs text-zinc-400">
                Upload your static assets (HTML, CSS, JS, images). We will automatically detect <code className="text-[#FFF33D]">index.html</code> and provision your public live URL.
              </p>
            </div>

            {uploadError && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Project / Website Name
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. NextGen Web App"
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFF33D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of this website or platform..."
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFF33D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Visibility
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVisibility("public")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                      visibility === "public"
                        ? "border-[#FFF33D] bg-[#FFF33D]/10 text-[#FFF33D]"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Public (Searchable)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility("private")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                      visibility === "private"
                        ? "border-[#FFF33D] bg-[#FFF33D]/10 text-[#FFF33D]"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    Private (Owner Only)
                  </button>
                </div>
              </div>

              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Website Files (ZIP Archive)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-800 hover:border-[#FFF33D] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-zinc-900/40"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip,application/zip"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                        if (!projectName) {
                          setProjectName(
                            e.target.files[0].name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
                          );
                        }
                      }
                    }}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="space-y-1">
                      <FileCode className="w-8 h-8 mx-auto text-[#FFF33D]" />
                      <p className="text-xs font-bold text-white">{selectedFile.name}</p>
                      <p className="text-[11px] text-zinc-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB &bull; Ready to deploy
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-8 h-8 mx-auto text-zinc-500" />
                      <p className="text-xs font-semibold text-zinc-300">
                        Click or drag &amp; drop ZIP file
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Max 50MB &bull; Must contain index.html
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {uploading && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-zinc-400 font-semibold">
                    <span>Extracting &amp; Deploying...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFF33D] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full mt-2 py-3 rounded-xl bg-[#FFF33D] hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {uploading ? "Deploying Website..." : "Deploy Website"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setEditingProject(null)}
              className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-4">Edit Project Settings</h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFF33D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFF33D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Visibility
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditVisibility("public")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                      editVisibility === "public"
                        ? "border-[#FFF33D] bg-[#FFF33D]/10 text-[#FFF33D]"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditVisibility("private")}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                      editVisibility === "private"
                        ? "border-[#FFF33D] bg-[#FFF33D]/10 text-[#FFF33D]"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    Private
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingEdit}
                className="w-full mt-2 py-3 rounded-xl bg-[#FFF33D] hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#FFF33D] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Loading Dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </React.Suspense>
  );
}

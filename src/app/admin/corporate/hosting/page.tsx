import React from "react";
import Link from "next/link";
import { readDb } from "@/lib/db";
import {
  Globe2,
  HardDrive,
  Users,
  Layers,
  Eye,
  Trash2,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminHostingPage() {
  const db = readDb();
  const projects = db.hostedProjects || [];
  const deployments = db.hostedDeployments || [];
  const users = db.users || [];

  const totalBytes = projects.reduce((acc, p) => acc + (p.storageUsedBytes || 0), 0);
  const liveCount = projects.filter((p) => p.deploymentStatus === "live").length;
  const failedCount = deployments.filter((d) => d.deploymentStatus === "failed").length;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Website Hosting &amp; Deployment Engine
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Platform-wide multi-user hosting oversight, live deployments, developer quota tracking, and security controls.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/corporate/users"
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider group-hover:text-black">Registered Developers</span>
            <Users className="w-4 h-4 text-black" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950 group-hover:text-blue-600 transition-colors">{users.length}</p>
          <p className="mt-1 text-[11px] text-blue-600 font-semibold">View user accounts &amp; sign-ups →</p>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Hosted Sites</span>
            <Layers className="w-4 h-4 text-black" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950">{projects.length}</p>
          <p className="mt-1 text-[11px] text-slate-500">{liveCount} active &amp; accessible</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Disk Storage</span>
            <HardDrive className="w-4 h-4 text-black" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950">
            {(totalBytes / 1024 / 1024).toFixed(2)} <span className="text-sm font-normal text-slate-500">MB</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Isolated static assets</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Build Failures</span>
            <AlertCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-3 text-3xl font-black text-emerald-600">{failedCount}</p>
          <p className="mt-1 text-[11px] text-slate-500">All systems operational</p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              All Uploaded Websites ({projects.length})
            </h2>
            <p className="text-xs text-slate-500">
              Complete inventory of uploaded projects, disk allocation, and live links.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/api/admin/export-excel?type=all"
              download
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition shadow-xs"
              title="Download full database Excel file"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export All Data (.xlsx)</span>
            </a>

            <a
              href="/api/admin/export-excel?type=users"
              download
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition shadow-xs"
              title="Download user sign-ups Excel file"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Users (.xlsx)</span>
            </a>

            <Link
              href="/dashboard?action=upload"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-[#FFF33D] hover:bg-black transition shadow-xs"
            >
              Deploy New Website →
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">Owner / Developer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Traffic</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((p) => {
                const liveUrl = `/sites/${p.slug}`;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>
                        <span>{p.projectName}</span>
                        <p className="text-[11px] font-mono font-normal text-slate-400">/{p.slug}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-800">{p.userName || "Sabir Usmani"}</span>
                        <p className="text-[11px] text-slate-400">{p.userEmail || "sabirusmani159@gmail.com"}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                        {p.deploymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-semibold text-slate-700">{p.visibility}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {(p.storageUsedBytes / 1024).toFixed(0)} KB
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {p.viewCount || 0}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/preview/${p.id}`}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-black hover:border-black transition-colors"
                          title="Preview in frame"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-black hover:border-black transition-colors"
                          title="Open live URL"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deployments Log History */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Recent Platform Deployments ({deployments.length})
        </h2>
        {deployments.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No deployment events logged yet.</p>
        ) : (
          <div className="space-y-3">
            {deployments.slice(0, 10).map((d) => (
              <div
                key={d.id}
                className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{d.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {d.deploymentStatus}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    {d.storagePath} &bull; {d.fileCount} files &bull; {(d.totalSize / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  {new Date(d.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

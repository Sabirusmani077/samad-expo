"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Download,
  Search,
  ShieldCheck,
  Code2,
  Building,
  CheckCircle2,
  XCircle,
  Globe,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { User, HostedProject } from "@/lib/types";

interface UsersClientProps {
  users: User[];
  projects: HostedProject[];
}

export function UsersClient({ users, projects }: UsersClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const developerCount = users.filter((u) => u.role !== "admin" && u.role !== "vendor").length;
  const vendorCount = users.filter((u) => u.role === "vendor").length;
  const totalHostedProjects = projects.length;

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        roleFilter === "all"
          ? true
          : roleFilter === "admin"
          ? u.role === "admin"
          : roleFilter === "vendor"
          ? u.role === "vendor"
          : u.role !== "admin" && u.role !== "vendor";

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <Link href="/admin/corporate" className="hover:underline">
              Admin Console
            </Link>
            <span>/</span>
            <span className="text-black font-bold">User Sign-Ups &amp; Accounts</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>Registered Users &amp; Sign-Up Analytics</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-0.5 text-xs font-bold text-[#FFF33D]">
              {totalUsers} Accounts
            </span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Real-time audit of every registered user, authentication logs, role assignment, and hosted deployment metrics.
          </p>
        </div>

        {/* Excel Download Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/api/admin/export-excel?type=users"
            download
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-slate-100 hover:border-black active:scale-95"
            title="Download Users Excel Sheet (.xlsx)"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>Download Users Excel (.xlsx)</span>
          </a>

          <a
            href="/api/admin/export-excel?type=all"
            download
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#FFF33D] hover:text-black active:scale-95"
            title="Download Full Master Excel with all 11 sheets"
          >
            <Download className="h-4 w-4" />
            <span>Export All System Data (.xlsx)</span>
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sign-Ups</span>
            <Users className="w-4 h-4 text-slate-900" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950">{totalUsers}</p>
          <p className="mt-1 text-[11px] text-slate-500">All registered user accounts</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Developers / Users</span>
            <Code2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950">{developerCount}</p>
          <p className="mt-1 text-[11px] text-slate-500">Users with upload &amp; hosting access</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Hosted Sites</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950">{totalHostedProjects}</p>
          <p className="mt-1 text-[11px] text-slate-500">Websites deployed by users</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Administrators</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950">{adminCount}</p>
          <p className="mt-1 text-[11px] text-slate-500">{vendorCount} vendor/partner accounts</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: `All (${totalUsers})` },
            { id: "developer", label: `Developers (${developerCount})` },
            { id: "admin", label: `Admins (${adminCount})` },
            { id: "vendor", label: `Vendors (${vendorCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                roleFilter === tab.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Account Role</th>
                <th className="py-3.5 px-4">Sign-Up Date</th>
                <th className="py-3.5 px-4">Email Status</th>
                <th className="py-3.5 px-4">Hosted Websites</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                    No registered users match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => {
                  const userProjects = projects.filter((p) => p.userId === u.id);
                  const isUserAdmin = u.role === "admin";
                  const isUserVendor = u.role === "vendor";

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{index + 1}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-900 text-[#FFF33D] font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-[10px] font-mono text-slate-400">{u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={`mailto:${u.email}`}
                          className="font-medium text-slate-700 hover:text-black hover:underline"
                        >
                          {u.email}
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        {isUserAdmin ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-200">
                            <ShieldCheck className="h-3 w-3" />
                            Administrator
                          </span>
                        ) : isUserVendor ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-900 border border-purple-200">
                            <Building className="h-3 w-3" />
                            Vendor Partner
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-900 border border-blue-200">
                            <Code2 className="h-3 w-3" />
                            Developer / User
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(u.createdAt)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                            <XCircle className="w-3.5 h-3.5" />
                            Registered
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {userProjects.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-black text-white">
                              {userProjects.length} {userProjects.length === 1 ? "site" : "sites"}
                            </span>
                            {userProjects.slice(0, 2).map((p) => (
                              <Link
                                key={p.id}
                                href={`/sites/${p.slug}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-[#FFF33D] hover:text-black transition"
                              >
                                <span className="max-w-[80px] truncate">{p.projectName}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No websites yet</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`/api/admin/export-excel?type=users`}
                          download
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-black underline"
                          title="Export User Record"
                        >
                          <Download className="w-3 h-3" />
                          <span>Export</span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

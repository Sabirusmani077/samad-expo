import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { CorporateAdminSidebar } from "./CorporateAdminSidebar";

export default async function CorporateAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login?next=%2Fadmin%2Fcorporate");

  return (
    <div className="min-h-screen bg-[#060608] samad-hero-grid text-white">
      <CorporateAdminSidebar />
      <div className="lg:pl-72 admin-dark-shell">
        {children}
      </div>
    </div>
  );
}

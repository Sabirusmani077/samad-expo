import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { ReelhouseCorporateHome } from "@/components/ReelhouseCorporateHome";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Samad Expo — Parent Corporate Brand & Central Digital Headquarters",
  description:
    "Official corporate headquarters and digital gateway of Samad Expo. Parent brand for all our businesses, websites, web applications, products, and technology platforms.",
};

export default async function CorporateHeadquartersHome() {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    if (currentUser.role === "admin") {
      redirect("/admin/corporate");
    } else {
      redirect("/dashboard");
    }
  }

  const db = readDb();
  const profile = db.companyProfile
    ? {
        ...db.companyProfile,
        founderName: "",
        founderDesignation: "",
        founderPhoto: "",
        founderBio: "",
        founderMessage: "",
      }
    : null;
  const divisions = (db.businessDivisions || [])
    .filter((d) => d.status === "active")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const websites = (db.websiteListings || [])
    .filter(
      (w) =>
        w.isPublic !== false &&
        !w.slug.includes("sabir") &&
        !w.name.toLowerCase().includes("sabir")
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const services = (db.corporateServices || []).filter((s) => s.status === "active");
  const hostedProjects = (db.hostedProjects || [])
    .filter(
      (p) =>
        p.visibility === "public" &&
        p.deploymentStatus === "live" &&
        !p.projectName.toLowerCase().includes("automated test platform") &&
        !p.projectName.toLowerCase().includes("sabir") &&
        !p.slug.includes("sabir")
    )
    .map((p) => ({
      ...p,
      userId: "",
      userEmail: "",
      userName: "Samad Expo Studio",
    }));

  return (
    <ReelhouseCorporateHome
      profile={profile}
      websites={websites}
      divisions={divisions}
      services={services}
      team={[]}
      hostedProjects={hostedProjects}
    />
  );
}

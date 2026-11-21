import * as XLSX from "xlsx";
import { readDb } from "./db";
import {
  User,
  HostedProject,
  HostedDeployment,
  CorporateInquiry,
  BusinessDivision,
  CorporateService,
  TeamMember,
  PortfolioEntry,
  BlogPost,
  JobListing,
  Partnership,
} from "./types";

function formatDateIST(isoString?: string | null): string {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

function autoFitColumns(data: Record<string, unknown>[]): XLSX.ColInfo[] {
  if (!data || data.length === 0) return [];
  const keys = Object.keys(data[0]);
  return keys.map((key) => {
    let maxLen = key.length;
    for (const row of data) {
      const val = row[key];
      if (val !== undefined && val !== null) {
        const strVal = String(val);
        if (strVal.length > maxLen) {
          maxLen = Math.min(strVal.length, 60);
        }
      }
    }
    return { wch: Math.max(maxLen + 4, 12) };
  });
}

/**
 * Builds the Master Excel Workbook containing all platform data across multiple worksheets
 */
export function generateMasterExcel(): Buffer {
  const db = readDb();
  const wb = XLSX.utils.book_new();

  const users: User[] = db.users || [];
  const hostedProjects: HostedProject[] = db.hostedProjects || [];
  const hostedDeployments: HostedDeployment[] = db.hostedDeployments || [];
  const inquiries: CorporateInquiry[] = db.corporateInquiries || [];
  const divisions: BusinessDivision[] = db.businessDivisions || [];
  const services: CorporateService[] = db.corporateServices || [];
  const team: TeamMember[] = db.teamMembers || [];
  const portfolio: PortfolioEntry[] = db.portfolioEntries || [];
  const blog: BlogPost[] = db.blogPosts || [];
  const jobs: JobListing[] = db.jobListings || [];
  const partnerships: Partnership[] = db.partnerships || [];

  const totalBytes = hostedProjects.reduce((acc, p) => acc + (p.storageUsedBytes || 0), 0);
  const liveCount = hostedProjects.filter((p) => p.deploymentStatus === "live").length;
  const adminUsersCount = users.filter((u) => u.role === "admin").length;
  const developerUsersCount = users.filter((u) => u.role !== "admin" && u.role !== "vendor").length;
  const vendorUsersCount = users.filter((u) => u.role === "vendor").length;

  // ----------------------------------------------------
  // 1. EXECUTIVE SUMMARY & KPIS
  // ----------------------------------------------------
  const summaryRows = [
    { Metric: "Platform Name", Value: "Samad Expo Corporate Platform & Hosting Engine", Description: "Official enterprise ecosystem" },
    { Metric: "Report Generated At", Value: formatDateIST(new Date().toISOString()), Description: "IST Timezone (Asia/Kolkata)" },
    { Metric: "Total Registered Users", Value: users.length, Description: "Total signed up accounts across platform" },
    { Metric: "Developers / General Users", Value: developerUsersCount, Description: "Platform developers who can upload & host sites" },
    { Metric: "Platform Administrators", Value: adminUsersCount, Description: "Root administrator accounts" },
    { Metric: "Vendor / Partner Accounts", Value: vendorUsersCount, Description: "Specialized merchant accounts" },
    { Metric: "Total Hosted Websites", Value: hostedProjects.length, Description: "Total projects uploaded & managed" },
    { Metric: "Active / Live Websites", Value: liveCount, Description: "Websites currently live and publicly served" },
    { Metric: "Total Disk Storage Used", Value: `${(totalBytes / 1024 / 1024).toFixed(2)} MB`, Description: "Isolated production storage for websites" },
    { Metric: "Total Client Inquiries", Value: inquiries.length, Description: "Business inquiries, messages & RFPs" },
    { Metric: "New Unread Inquiries", Value: inquiries.filter((i) => i.status === "new").length, Description: "Pending review by corporate management" },
    { Metric: "Business Divisions", Value: divisions.length, Description: "Core conglomerate sectors" },
    { Metric: "Corporate Services", Value: services.length, Description: "Active digital & enterprise services" },
    { Metric: "Executive Team & Leadership", Value: team.length, Description: "Profiles on corporate roster" },
    { Metric: "Portfolio Showcase Entries", Value: portfolio.length, Description: "Published flagship projects" },
    { Metric: "News & Blog Articles", Value: blog.length, Description: "Published corporate thought leadership" },
    { Metric: "Job Openings", Value: jobs.length, Description: "Open careers across divisions" },
    { Metric: "Strategic Partnerships", Value: partnerships.length, Description: "Ecosystem alliances & partners" },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  wsSummary["!cols"] = autoFitColumns(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Executive_Summary");

  // ----------------------------------------------------
  // 2. USER SIGNUPS REGISTER (User Details & Counts)
  // ----------------------------------------------------
  const userRows = users.map((u, i) => {
    const userProjects = hostedProjects.filter((p) => p.userId === u.id);
    const roleLabel =
      u.role === "admin"
        ? "Platform Administrator"
        : u.role === "vendor"
        ? "Vendor Partner"
        : "Registered Developer";

    return {
      "S.No": i + 1,
      "User ID": u.id,
      "Full Name": u.name,
      "Email Address": u.email,
      "Role": roleLabel,
      "Sign-Up Date (IST)": formatDateIST(u.createdAt),
      "Email Verified": u.emailVerified ? "Yes" : "No",
      "Hosted Websites Count": userProjects.length,
      "Hosted Projects (Names)": userProjects.map((p) => p.projectName).join(", ") || "None yet",
      "Hosted Projects (Slugs)": userProjects.map((p) => p.slug).join(", ") || "None",
      "Phone Number": u.phone || "Not Provided",
      "Privacy Consent": u.privacyConsent ? "Accepted" : "No",
      "Last Account Update": formatDateIST(u.updatedAt),
    };
  });
  const wsUsers = XLSX.utils.json_to_sheet(userRows);
  wsUsers["!cols"] = autoFitColumns(userRows);
  XLSX.utils.book_append_sheet(wb, wsUsers, "Users_Signups_Register");

  // ----------------------------------------------------
  // 3. HOSTED WEBSITES & PROJECTS
  // ----------------------------------------------------
  const projectRows = hostedProjects.map((p, i) => {
    const ownerUser = users.find((u) => u.id === p.userId);
    const deployment = hostedDeployments.find((d) => d.id === p.activeDeploymentId || d.projectId === p.id);

    return {
      "S.No": i + 1,
      "Project ID": p.id,
      "Project Name": p.projectName,
      "Slug / Subdomain": p.slug,
      "Owner Name": p.userName || ownerUser?.name || "Unknown",
      "Owner Email": p.userEmail || ownerUser?.email || "Unknown",
      "Owner User ID": p.userId,
      "Deployment Status": (p.deploymentStatus || "draft").toUpperCase(),
      "Visibility": (p.visibility || "public").toUpperCase(),
      "Live Public URL": p.deploymentUrl || `/sites/${p.slug}`,
      "In-App Preview URL": `/preview/${p.id}`,
      "Entry File": deployment?.entryFile || "index.html",
      "Total File Count": deployment?.fileCount || 0,
      "Storage Used (MB)": ((p.storageUsedBytes || 0) / 1024 / 1024).toFixed(3),
      "Total Views": p.viewCount || 0,
      "Created At (IST)": formatDateIST(p.createdAt),
      "Last Deployed (IST)": formatDateIST(p.updatedAt),
      "Description": p.description || "",
    };
  });
  const wsProjects = XLSX.utils.json_to_sheet(projectRows);
  wsProjects["!cols"] = autoFitColumns(projectRows);
  XLSX.utils.book_append_sheet(wb, wsProjects, "Hosted_Websites");

  // ----------------------------------------------------
  // 4. CLIENT INQUIRIES & LEADS
  // ----------------------------------------------------
  const inquiryRows = inquiries.map((inq, i) => ({
    "S.No": i + 1,
    "Inquiry ID": inq.id,
    "Full Name": inq.name,
    "Email Address": inq.email,
    "Phone Number": inq.phone || "N/A",
    "Company / Organization": inq.company || "Individual",
    "Subject": inq.subject || "General Inquiry",
    "Inquiry Type": (inq.inquiryType || "general").toUpperCase(),
    "Message Details": inq.message,
    "Status": (inq.status || "new").toUpperCase(),
    "Submitted Date (IST)": formatDateIST(inq.createdAt),
  }));
  const wsInquiries = XLSX.utils.json_to_sheet(inquiryRows);
  wsInquiries["!cols"] = autoFitColumns(inquiryRows);
  XLSX.utils.book_append_sheet(wb, wsInquiries, "Client_Inquiries");

  // ----------------------------------------------------
  // 5. BUSINESS DIVISIONS
  // ----------------------------------------------------
  const divisionRows = divisions.map((d, i) => ({
    "S.No": i + 1,
    "Division ID": d.id,
    "Division Name": d.name,
    "Category": d.category || "",
    "Status": (d.status || "active").toUpperCase(),
    "Sort Order": d.sortOrder || i + 1,
    "Short Description": d.shortDescription || "",
    "Full Description": d.description || "",
    "Contact Email": d.contactEmail || "",
    "Contact Phone": d.contactPhone || "",
  }));
  const wsDivisions = XLSX.utils.json_to_sheet(divisionRows);
  wsDivisions["!cols"] = autoFitColumns(divisionRows);
  XLSX.utils.book_append_sheet(wb, wsDivisions, "Business_Divisions");

  // ----------------------------------------------------
  // 6. CORPORATE SERVICES
  // ----------------------------------------------------
  const serviceRows = services.map((s, i) => ({
    "S.No": i + 1,
    "Service ID": s.id,
    "Service Title": s.name,
    "Category": s.category || "",
    "Status": (s.status || "active").toUpperCase(),
    "Description": s.description || "",
  }));
  const wsServices = XLSX.utils.json_to_sheet(serviceRows);
  wsServices["!cols"] = autoFitColumns(serviceRows);
  XLSX.utils.book_append_sheet(wb, wsServices, "Corporate_Services");

  // ----------------------------------------------------
  // 7. LEADERSHIP & TEAM
  // ----------------------------------------------------
  const teamRows = team.map((t, i) => ({
    "S.No": i + 1,
    "Member ID": t.id,
    "Full Name": t.name,
    "Designation / Title": t.designation || "",
    "Is Founder": t.isFounder ? "Yes" : "No",
    "LinkedIn": t.socialLinks?.linkedin || "",
    "Twitter": t.socialLinks?.twitter || "",
    "Bio Summary": t.bio || "",
  }));
  const wsTeam = XLSX.utils.json_to_sheet(teamRows);
  wsTeam["!cols"] = autoFitColumns(teamRows);
  XLSX.utils.book_append_sheet(wb, wsTeam, "Leadership_Team");

  // ----------------------------------------------------
  // 8. PORTFOLIO SHOWCASE
  // ----------------------------------------------------
  const portfolioRows = portfolio.map((item, i) => ({
    "S.No": i + 1,
    "Project ID": item.id,
    "Project Title": item.title,
    "Category": item.category || "",
    "Live URL": item.url || "",
    "Summary": item.description || item.shortDescription || "",
    "Created Date (IST)": formatDateIST(item.createdAt),
  }));
  const wsPortfolio = XLSX.utils.json_to_sheet(portfolioRows);
  wsPortfolio["!cols"] = autoFitColumns(portfolioRows);
  XLSX.utils.book_append_sheet(wb, wsPortfolio, "Portfolio_Showcase");

  // ----------------------------------------------------
  // 9. BLOG & NEWS POSTS
  // ----------------------------------------------------
  const blogRows = blog.map((post, i) => ({
    "S.No": i + 1,
    "Post ID": post.id,
    "Title": post.title,
    "Slug": post.slug,
    "Category": post.category || "",
    "Author": post.author || "Samad Expo Editorial",
    "Published Date (IST)": formatDateIST(post.publishedAt),
    "Status": (post.status || "published").toUpperCase(),
  }));
  const wsBlog = XLSX.utils.json_to_sheet(blogRows);
  wsBlog["!cols"] = autoFitColumns(blogRows);
  XLSX.utils.book_append_sheet(wb, wsBlog, "News_Blog_Posts");

  // ----------------------------------------------------
  // 10. JOB OPENINGS
  // ----------------------------------------------------
  const jobRows = jobs.map((j, i) => ({
    "S.No": i + 1,
    "Job ID": j.id,
    "Job Title": j.title,
    "Department": j.department || "",
    "Location": j.location || "Remote / On-site",
    "Employment Type": (j.type || "full_time").replace("_", " ").toUpperCase(),
    "Salary Range": j.salaryRange || "Competitive",
    "Status": (j.status || "open").toUpperCase(),
  }));
  const wsJobs = XLSX.utils.json_to_sheet(jobRows);
  wsJobs["!cols"] = autoFitColumns(jobRows);
  XLSX.utils.book_append_sheet(wb, wsJobs, "Job_Openings");

  // ----------------------------------------------------
  // 11. PARTNERSHIPS
  // ----------------------------------------------------
  const partnerRows = partnerships.map((part, i) => ({
    "S.No": i + 1,
    "Partner ID": part.id,
    "Partner Name": part.partnerName,
    "Partnership Type": (part.partnerType || "technology").toUpperCase(),
    "Live URL": part.url || "",
    "Status": (part.status || "active").toUpperCase(),
    "Description": part.description || "",
  }));
  const wsPartners = XLSX.utils.json_to_sheet(partnerRows);
  wsPartners["!cols"] = autoFitColumns(partnerRows);
  XLSX.utils.book_append_sheet(wb, wsPartners, "Strategic_Partnerships");

  // Generate buffer
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

/**
 * Builds a focused User Signups Excel Workbook
 */
export function generateUsersExcel(): Buffer {
  const db = readDb();
  const wb = XLSX.utils.book_new();

  const users: User[] = db.users || [];
  const hostedProjects: HostedProject[] = db.hostedProjects || [];

  const summaryRows = [
    { Metric: "Total Signed Up Users", Value: users.length },
    { Metric: "Platform Administrators", Value: users.filter((u) => u.role === "admin").length },
    { Metric: "Developers / General Users", Value: users.filter((u) => u.role !== "admin" && u.role !== "vendor").length },
    { Metric: "Vendor / Partner Accounts", Value: users.filter((u) => u.role === "vendor").length },
    { Metric: "Users With Deployed Websites", Value: users.filter((u) => hostedProjects.some((p) => p.userId === u.id)).length },
    { Metric: "Export Generated At", Value: formatDateIST(new Date().toISOString()) },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  wsSummary["!cols"] = autoFitColumns(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Signups_Overview");

  const userRows = users.map((u, i) => {
    const userProjects = hostedProjects.filter((p) => p.userId === u.id);
    return {
      "S.No": i + 1,
      "User ID": u.id,
      "Full Name": u.name,
      "Email Address": u.email,
      "Role": u.role === "admin" ? "Platform Administrator" : u.role === "vendor" ? "Vendor Partner" : "Registered Developer",
      "Sign-Up Date (IST)": formatDateIST(u.createdAt),
      "Email Verified": u.emailVerified ? "Yes" : "No",
      "Websites Uploaded": userProjects.length,
      "Website Names": userProjects.map((p) => p.projectName).join(", ") || "None",
      "Website Slugs": userProjects.map((p) => p.slug).join(", ") || "None",
      "Phone": u.phone || "Not Provided",
      "Privacy Consent": u.privacyConsent ? "Accepted" : "No",
      "Last Account Update": formatDateIST(u.updatedAt),
    };
  });
  const wsUsers = XLSX.utils.json_to_sheet(userRows);
  wsUsers["!cols"] = autoFitColumns(userRows);
  XLSX.utils.book_append_sheet(wb, wsUsers, "Registered_Users");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

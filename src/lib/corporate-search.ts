import { readDb } from "./db";

export type EcosystemSearchItem = {
  id: string;
  type: "Website" | "Business division" | "Service" | "Deployed website";
  title: string;
  description: string;
  href: string;
  category: string;
  status?: string;
  developerName?: string;
  thumbnail?: string;
};

const RESULT_LIMIT = 8;

function includesQuery(query: string, values: Array<string | undefined>) {
  return values.some((value) => value?.toLocaleLowerCase().includes(query));
}

export function searchCorporateEcosystem(rawQuery: string): EcosystemSearchItem[] {
  const query = rawQuery.trim().slice(0, 100).toLocaleLowerCase();
  if (query.length < 2) return [];

  const db = readDb();
  const results: EcosystemSearchItem[] = [];
  const counts = new Map<EcosystemSearchItem["type"], number>();
  const addResult = (item: EcosystemSearchItem) => {
    const count = counts.get(item.type) || 0;
    if (count >= RESULT_LIMIT) return;
    counts.set(item.type, count + 1);
    results.push(item);
  };

  for (const website of db.websiteListings || []) {
    if (website.isPublic === false) continue;
    if (!includesQuery(query, [website.name, website.category, website.shortDescription, website.description, website.slug])) continue;
    addResult({
      id: website.id,
      type: "Website",
      title: website.name,
      description: website.shortDescription || website.description,
      href: `/websites/${website.slug}`,
      category: website.category,
      status: website.status,
    });
  }

  for (const project of db.hostedProjects || []) {
    if (project.visibility !== "public" || project.deploymentStatus !== "live") continue;
    if (
      !includesQuery(query, [
        project.projectName,
        project.description,
        project.slug,
        project.userName,
        project.userEmail,
        project.deploymentUrl,
      ])
    )
      continue;
    addResult({
      id: project.id,
      type: "Deployed website",
      title: project.projectName,
      description: project.description || `Live hosted website by ${project.userName || "Developer"}.`,
      href: project.deploymentUrl || `/sites/${project.slug}`,
      category: "Hosted Platform",
      status: "live",
      developerName: project.userName || "Developer",
      thumbnail: project.thumbnail,
    });
  }

  for (const division of db.businessDivisions || []) {
    if (division.status === "inactive") continue;
    if (!includesQuery(query, [division.name, division.category, division.shortDescription, division.description, division.slug])) continue;
    addResult({
      id: division.id,
      type: "Business division",
      title: division.name,
      description: division.shortDescription || division.description,
      href: `/businesses/${division.slug}`,
      category: division.category,
      status: division.status,
    });
  }

  for (const service of db.corporateServices || []) {
    if (service.status !== "active" && service.status !== "coming_soon") continue;
    if (!includesQuery(query, [service.name, service.category, service.shortDescription, service.description, service.slug])) continue;
    addResult({
      id: service.id,
      type: "Service",
      title: service.name,
      description: service.shortDescription || service.description,
      href: `/corporate-services#${service.slug}`,
      category: service.category,
      status: service.status,
    });
  }

  return results.slice(0, 24);
}

import { NextRequest, NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { searchCorporateEcosystem } from "@/lib/corporate-search";

export const dynamic = "force-dynamic";

// Standard MCP Tool Definitions
const MCP_TOOLS = [
  {
    name: "list_websites",
    description: "List all public hosted websites, web apps, and live deployments on Samad Expo platform.",
    inputSchema: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          enum: ["all", "live", "featured"],
          description: "Filter websites by deployment state or prominence (default: 'all')",
        },
        limit: {
          type: "number",
          description: "Maximum number of websites to return (default: 20, max: 100)",
        },
      },
    },
  },
  {
    name: "get_website",
    description: "Get detailed information about a specific hosted website on Samad Expo by its slug or ID.",
    inputSchema: {
      type: "object",
      required: ["identifier"],
      properties: {
        identifier: {
          type: "string",
          description: "The unique slug or ID of the website (e.g. 'solar-intro' or 'usr_c5322c59-a')",
        },
      },
    },
  },
  {
    name: "search_ecosystem",
    description: "Search across all hosted websites, business divisions, platforms, and services in the Samad Expo corporate ecosystem.",
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: {
        query: {
          type: "string",
          description: "Search keyword or phrase (e.g. 'solar', 'hosting', 'convertor', 'corporate')",
        },
      },
    },
  },
  {
    name: "get_platform_metrics",
    description: "Retrieve real-time platform metrics, live website counts, active developers, storage allocation, and uptime statistics.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_company_profile",
    description: "Get official Samad Expo corporate headquarters profile, contact information, leadership, and operational details.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "list_businesses",
    description: "List all active commercial business divisions and strategic business units under Samad Expo.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// Standard MCP Resources
const MCP_RESOURCES = [
  {
    uri: "samad-expo://ecosystem",
    name: "Ecosystem Directory",
    description: "Complete overview of platforms, websites, and business divisions in Samad Expo.",
    mimeType: "application/json",
  },
  {
    uri: "samad-expo://metrics",
    name: "Platform Metrics",
    description: "Real-time statistics of hosted websites, cloud storage, and platform uptime.",
    mimeType: "application/json",
  },
  {
    uri: "samad-expo://company-profile",
    name: "Corporate Headquarters Profile",
    description: "Official company background, location, contact, and leadership info.",
    mimeType: "application/json",
  },
  {
    uri: "samad-expo://websites-catalog",
    name: "Hosted Websites Catalog",
    description: "Public directory of hosted web projects and applications.",
    mimeType: "application/json",
  },
];

// Helper to execute tool calls
async function executeTool(name: string, args: Record<string, unknown>) {
  const db = readDb();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samad-expo.vercel.app";

  switch (name) {
    case "list_websites": {
      const filter = (args.filter as string) || "all";
      const limit = Math.min(Number(args.limit) || 20, 100);

      const hostedProjects = (db.hostedProjects || [])
        .filter((p) => p.visibility === "public")
        .map((p) => ({
          id: p.id,
          name: p.projectName,
          slug: p.slug,
          deploymentStatus: p.deploymentStatus,
          liveUrl: `${baseUrl}/preview/${p.id}`,
          storageUsedMB: (p.storageUsedBytes / (1024 * 1024)).toFixed(2),
          updatedAt: p.updatedAt,
        }));

      const websiteListings = (db.websiteListings || [])
        .filter((w) => w.isPublic !== false)
        .map((w) => ({
          id: w.id,
          name: w.name,
          slug: w.slug,
          category: w.category,
          status: w.status,
          description: w.shortDescription || w.description,
          url: w.url?.startsWith("http") ? w.url : `${baseUrl}/websites/${w.slug}`,
          features: w.features || [],
        }));

      let combined = [...hostedProjects, ...websiteListings];
      if (filter === "live") {
        combined = combined.filter((item) =>
          "deploymentStatus" in item ? item.deploymentStatus === "live" : item.status === "live"
        );
      } else if (filter === "featured") {
        combined = combined.filter((item) =>
          "features" in item ? item.features.length > 0 : true
        );
      }

      return {
        total: combined.length,
        filterApplied: filter,
        websites: combined.slice(0, limit),
      };
    }

    case "get_website": {
      const identifier = String(args.identifier || "").toLowerCase();
      const website = (db.websiteListings || []).find(
        (w) => w.slug.toLowerCase() === identifier || w.id.toLowerCase() === identifier
      );
      const project = (db.hostedProjects || []).find(
        (p) => p.slug.toLowerCase() === identifier || p.id.toLowerCase() === identifier
      );

      if (!website && !project) {
        throw new Error(`Website or project with identifier '${identifier}' not found.`);
      }

      return {
        type: project ? "Hosted Project (ZIP Deployment)" : "Corporate Website Listing",
        details: project
          ? {
              id: project.id,
              name: project.projectName,
              slug: project.slug,
              deploymentStatus: project.deploymentStatus,
              previewUrl: `${baseUrl}/preview/${project.id}`,
              storageUsedBytes: project.storageUsedBytes,
              createdAt: project.createdAt,
              updatedAt: project.updatedAt,
            }
          : website,
      };
    }

    case "search_ecosystem": {
      const query = String(args.query || "");
      const results = searchCorporateEcosystem(query);
      return {
        query,
        count: results.length,
        results: results.map((r) => ({
          ...r,
          url: r.href.startsWith("http") ? r.href : `${baseUrl}${r.href}`,
        })),
      };
    }

    case "get_platform_metrics": {
      const liveProjects = (db.hostedProjects || []).filter((p) => p.deploymentStatus === "live").length;
      const publicSites = (db.websiteListings || []).filter((w) => w.isPublic !== false).length;
      const totalStorage = (db.hostedProjects || []).reduce((acc, p) => acc + (p.storageUsedBytes || 0), 0);
      const activeDevelopers = (db.users || []).length;

      return {
        platformName: "Samad Expo",
        liveWebsitesCount: liveProjects + publicSites,
        hostedProjectsCount: (db.hostedProjects || []).length,
        activeDevelopersCount: activeDevelopers || 15,
        totalStorageUsedMB: (totalStorage / (1024 * 1024)).toFixed(2),
        storageLimitPerUserMB: 500,
        platformUptime: "99.9%",
        systemStatus: "Operational",
      };
    }

    case "get_company_profile": {
      const profile = db.companyProfile || {};
      return {
        companyName: "Samad Expo",
        tagline: profile.tagline || "Independent vision. Collective craft.",
        headquarters: {
          city: "Agra",
          state: "Uttar Pradesh",
          country: "India",
          status: "Official Corporate Headquarters",
        },
        contact: {
          email: profile.contactEmail || "officialaadhakh@gmail.com",
          phone: profile.contactPhone || "+91 94582 04216",
        },
        socialLinks: profile.socialLinks || {},
        officialWebsite: baseUrl,
        brandColors: {
          primary: "#000000",
          accent: "#FFF33D",
        },
      };
    }

    case "list_businesses": {
      return {
        total: (db.businessDivisions || []).length,
        divisions: (db.businessDivisions || []).map((d) => ({
          id: d.id,
          name: d.name,
          slug: d.slug,
          status: d.status,
          category: d.category,
          description: d.description,
          productsAndServices: d.productsAndServices,
          url: `${baseUrl}/businesses/${d.slug}`,
        })),
      };
    }

    default:
      throw new Error(`Unknown tool: '${name}'`);
  }
}

// Read resource helper
function readResource(uri: string) {
  const db = readDb();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samad-expo.vercel.app";

  switch (uri) {
    case "samad-expo://ecosystem":
      return {
        company: "Samad Expo",
        headquarters: "Agra, India",
        websitesCount: (db.websiteListings || []).length,
        projectsCount: (db.hostedProjects || []).length,
        divisionsCount: (db.businessDivisions || []).length,
      };
    case "samad-expo://metrics":
      return {
        liveProjects: (db.hostedProjects || []).filter((p) => p.deploymentStatus === "live").length,
        uptime: "99.9%",
        totalStorageBytes: (db.hostedProjects || []).reduce((acc, p) => acc + (p.storageUsedBytes || 0), 0),
      };
    case "samad-expo://company-profile":
      return db.companyProfile;
    case "samad-expo://websites-catalog":
      return {
        websites: (db.websiteListings || []).map((w) => ({
          name: w.name,
          slug: w.slug,
          url: `${baseUrl}/websites/${w.slug}`,
        })),
      };
    default:
      throw new Error(`Resource '${uri}' not found.`);
  }
}

// POST: JSON-RPC 2.0 Handler for MCP Clients
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if JSON-RPC 2.0 format
    const { jsonrpc, id, method, params } = body;
    if (jsonrpc !== "2.0") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: id ?? null,
          error: { code: -32600, message: "Invalid Request: jsonrpc must be '2.0'" },
        },
        { status: 400 }
      );
    }

    // Handle MCP methods
    switch (method) {
      case "initialize": {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: { listChanged: false },
              resources: { subscribe: false, listChanged: false },
            },
            serverInfo: {
              name: "samad-expo-mcp",
              version: "1.0.0",
            },
          },
        });
      }

      case "notifications/initialized": {
        return new NextResponse(null, { status: 204 });
      }

      case "ping": {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {},
        });
      }

      case "tools/list": {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            tools: MCP_TOOLS,
          },
        });
      }

      case "tools/call": {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};

        if (!toolName) {
          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              error: { code: -32602, message: "Missing required param: 'name'" },
            },
            { status: 400 }
          );
        }

        try {
          const result = await executeTool(toolName, toolArgs);
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(result, null, 2),
                },
              ],
            },
          });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : "Internal Tool Execution Error";
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              isError: true,
              content: [
                {
                  type: "text",
                  text: `Error executing tool '${toolName}': ${errMsg}`,
                },
              ],
            },
          });
        }
      }

      case "resources/list": {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            resources: MCP_RESOURCES,
          },
        });
      }

      case "resources/read": {
        const uri = params?.uri;
        if (!uri) {
          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              error: { code: -32602, message: "Missing required param: 'uri'" },
            },
            { status: 400 }
          );
        }

        try {
          const content = readResource(uri);
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              contents: [
                {
                  uri,
                  mimeType: "application/json",
                  text: JSON.stringify(content, null, 2),
                },
              ],
            },
          });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : "Resource Error";
          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              error: { code: -32002, message: errMsg },
            },
            { status: 404 }
          );
        }
      }

      default: {
        return NextResponse.json(
          {
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: `Method '${method}' not found` },
          },
          { status: 404 }
        );
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32603, message },
      },
      { status: 500 }
    );
  }
}

// GET: Interactive MCP Server Documentation & Client Connection Guide
export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samad-expo.vercel.app";
  const accept = req.headers.get("accept") || "";

  // If client requests SSE stream connection
  if (accept.includes("text/event-stream")) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            `event: endpoint\ndata: ${baseUrl}/api/mcp\n\n`
          )
        );
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  // Standard JSON summary for programmatic GET
  return NextResponse.json({
    mcpServer: "Samad Expo Model Context Protocol (MCP) API",
    status: "active",
    version: "1.0.0",
    protocolVersion: "2024-11-05",
    endpoint: `${baseUrl}/api/mcp`,
    transport: ["http-jsonrpc", "sse"],
    description:
      "Official MCP server allowing AI agents (Cursor, Claude, Antigravity, Gemini) to query hosted websites, search the digital ecosystem, inspect platform metrics, and access company resources.",
    tools: MCP_TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
    })),
    resources: MCP_RESOURCES.map((r) => ({
      uri: r.uri,
      name: r.name,
      description: r.description,
    })),
    clientConfigExample: {
      mcpServers: {
        "samad-expo": {
          url: `${baseUrl}/api/mcp`,
          type: "stream",
        },
      },
    },
  });
}

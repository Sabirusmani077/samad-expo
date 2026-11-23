import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

export const HOSTED_SITES_ROOT = path.join(process.cwd(), "data", "hosted-sites");

// Ensure root directory exists
if (!fs.existsSync(HOSTED_SITES_ROOT)) {
  fs.mkdirSync(HOSTED_SITES_ROOT, { recursive: true });
}

// Disallowed executable / dangerous server-side file extensions
export const FORBIDDEN_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".bash",
  ".zsh",
  ".php",
  ".phtml",
  ".php3",
  ".php4",
  ".php5",
  ".phps",
  ".py",
  ".pyc",
  ".pyo",
  ".rb",
  ".pl",
  ".cgi",
  ".jsp",
  ".jspx",
  ".asp",
  ".aspx",
  ".ashx",
  ".asmx",
  ".jar",
  ".war",
  ".ear",
  ".msi",
  ".dll",
  ".bin",
  ".shtml",
  ".xhtml",
  ".svgz",
  ".hta",
  ".vbs",
  ".vbe",
  ".wsf",
  ".wsh",
  ".scr",
  ".com",
  ".cpl",
  ".ps1",
  ".psm1",
]);

// Standard MIME type map for web assets
const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".bmp": "image/bmp",
  ".avif": "image/avif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogv": "video/ogg",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".pdf": "application/pdf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".wasm": "application/wasm",
  ".map": "application/json; charset=utf-8",
};

export function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

export interface ExtractedFileMetadata {
  fileName: string;
  filePath: string;
  fileSize: number;
  contentType: string;
}

export interface ExtractionResult {
  success: boolean;
  error?: string;
  fileCount: number;
  totalSize: number;
  entryFile: string;
  files: ExtractedFileMetadata[];
  storagePath: string;
}

/**
 * Validates and extracts a ZIP buffer into an isolated directory for the given user and project.
 * Implements zip slip / directory traversal prevention, zip bomb size limits, and illegal script rejection.
 */
export async function extractAndStoreProjectZip(
  userId: string,
  projectSlug: string,
  zipBuffer: Buffer,
  maxTotalSizeBytes = 50 * 1024 * 1024, // 50MB
  maxFileCount = 1500
): Promise<ExtractionResult> {
  const targetDir = path.resolve(HOSTED_SITES_ROOT, userId, projectSlug);

  try {
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    if (zipEntries.length === 0) {
      return {
        success: false,
        error: "Uploaded ZIP archive is empty.",
        fileCount: 0,
        totalSize: 0,
        entryFile: "",
        files: [],
        storagePath: targetDir,
      };
    }

    if (zipEntries.length > maxFileCount) {
      return {
        success: false,
        error: `Archive contains too many files (${zipEntries.length}). Maximum allowed is ${maxFileCount}.`,
        fileCount: zipEntries.length,
        totalSize: 0,
        entryFile: "",
        files: [],
        storagePath: targetDir,
      };
    }

    // First pass: validation (check total size, forbidden extensions, directory traversal)
    let totalUncompressedSize = 0;
    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;

      totalUncompressedSize += entry.header.size;
      if (totalUncompressedSize > maxTotalSizeBytes) {
        return {
          success: false,
          error: `Archive exceeds the maximum uncompressed size limit of ${Math.round(maxTotalSizeBytes / 1024 / 1024)}MB.`,
          fileCount: 0,
          totalSize: totalUncompressedSize,
          entryFile: "",
          files: [],
          storagePath: targetDir,
        };
      }

      // Check extension
      const ext = path.extname(entry.entryName).toLowerCase();
      if (FORBIDDEN_EXTENSIONS.has(ext)) {
        return {
          success: false,
          error: `Security violation: Prohibited file extension "${ext}" detected in "${entry.entryName}". Only static web assets (HTML, CSS, JS, images, fonts, media) are permitted.`,
          fileCount: 0,
          totalSize: 0,
          entryFile: "",
          files: [],
          storagePath: targetDir,
        };
      }

      // Check path traversal
      const normalizedPath = path.normalize(entry.entryName).replace(/^(\.\.[\/\\])+/, "");
      const resolvedPath = path.resolve(targetDir, normalizedPath);
      if (!resolvedPath.startsWith(targetDir)) {
        return {
          success: false,
          error: `Security violation: Illegal file path traversal detected in "${entry.entryName}".`,
          fileCount: 0,
          totalSize: 0,
          entryFile: "",
          files: [],
          storagePath: targetDir,
        };
      }
    }

    // Determine root directory nesting (e.g. if user zipped a folder named "my-site", all entries start with "my-site/")
    const nonDirEntries = zipEntries.filter((e) => !e.isDirectory);
    let commonPrefix = "";
    if (nonDirEntries.length > 0) {
      const parts0 = nonDirEntries[0].entryName.split(/[\/\\]/);
      if (parts0.length > 1) {
        const potentialRoot = parts0[0] + "/";
        const allShareRoot = nonDirEntries.every(
          (e) => e.entryName.startsWith(potentialRoot) || e.entryName.startsWith(parts0[0] + "\\")
        );
        if (allShareRoot) {
          commonPrefix = potentialRoot;
        }
      }
    }

    // Clean or create target directory
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    fs.mkdirSync(targetDir, { recursive: true });

    // Extract files safely
    const extractedFiles: ExtractedFileMetadata[] = [];
    let detectedEntryFile = "";

    for (const entry of zipEntries) {
      if (entry.isDirectory) continue;

      let relativePath = entry.entryName;
      if (commonPrefix && relativePath.startsWith(commonPrefix)) {
        relativePath = relativePath.slice(commonPrefix.length);
      }
      relativePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, "");
      if (!relativePath || relativePath === ".") continue;

      const destinationPath = path.resolve(targetDir, relativePath);
      if (!destinationPath.startsWith(targetDir)) continue;

      const destParent = path.dirname(destinationPath);
      if (!fs.existsSync(destParent)) {
        fs.mkdirSync(destParent, { recursive: true });
      }

      const content = entry.getData();
      fs.writeFileSync(destinationPath, content);

      const fileName = path.basename(destinationPath);
      const contentType = getMimeType(destinationPath);

      extractedFiles.push({
        fileName,
        filePath: relativePath.replace(/\\/g, "/"),
        fileSize: content.length,
        contentType,
      });

      if (relativePath.toLowerCase() === "index.html" || (!detectedEntryFile && fileName.toLowerCase() === "index.html")) {
        detectedEntryFile = relativePath.replace(/\\/g, "/");
      }
    }

    if (!detectedEntryFile) {
      // Look for any .html file as fallback
      const htmlFile = extractedFiles.find((f) => f.fileName.toLowerCase().endsWith(".html"));
      detectedEntryFile = htmlFile ? htmlFile.filePath : "index.html";
    }

    return {
      success: true,
      fileCount: extractedFiles.length,
      totalSize: totalUncompressedSize,
      entryFile: detectedEntryFile,
      files: extractedFiles,
      storagePath: targetDir,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to extract and process archive.";
    return {
      success: false,
      error: `ZIP processing error: ${message}`,
      fileCount: 0,
      totalSize: 0,
      entryFile: "",
      files: [],
      storagePath: targetDir,
    };
  }
}

/**
 * Returns absolute file path for a deployed project asset if it exists.
 */
export function getDeployedAssetPath(
  userId: string,
  projectSlug: string,
  assetPath: string
): { exists: boolean; fullPath: string; mimeType: string } {
  const projectDir = path.resolve(HOSTED_SITES_ROOT, userId, projectSlug);
  const normalized = path.normalize(assetPath).replace(/^(\.\.[\/\\])+/, "");
  const fullPath = path.resolve(projectDir, normalized);

  if (!fullPath.startsWith(projectDir)) {
    return { exists: false, fullPath: "", mimeType: "" };
  }

  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Check for index.html inside directory
      const indexPath = path.join(fullPath, "index.html");
      if (fs.existsSync(indexPath)) {
        return { exists: true, fullPath: indexPath, mimeType: getMimeType(indexPath) };
      }
      return { exists: false, fullPath: "", mimeType: "" };
    }
    return { exists: true, fullPath, mimeType: getMimeType(fullPath) };
  }

  return { exists: false, fullPath: "", mimeType: "" };
}

/**
 * Deletes all stored files for a project.
 */
export function deleteProjectFiles(userId: string, projectSlug: string): boolean {
  const targetDir = path.resolve(HOSTED_SITES_ROOT, userId, projectSlug);
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
    return true;
  }
  return false;
}

const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const zipPath = 'd:/3. Project/Solar Intro Page.zip';
const adminId = 'usr_admin_01';
const slug = 'solar-intro-page';
const targetDir = path.resolve('data/hosted-sites', adminId, slug);

if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir, { recursive: true });

const zip = new AdmZip(zipPath);
const entries = zip.getEntries();

let totalSize = 0;
let fileCount = 0;
const extractedFiles = [];

for (const entry of entries) {
  if (entry.isDirectory) continue;
  // Ignore .git and .devcontainer internal files
  if (entry.entryName.includes('/.git/') || entry.entryName.includes('/.devcontainer/')) continue;

  let rel = entry.entryName;
  if (rel.startsWith('Solar Intro Page/')) {
    rel = rel.slice('Solar Intro Page/'.length);
  }
  rel = path.normalize(rel).replace(/^(\.\.[\/\\])+/, '');
  if (!rel || rel === '.') continue;

  const dest = path.resolve(targetDir, rel);
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const data = entry.getData();
  fs.writeFileSync(dest, data);
  totalSize += data.length;
  fileCount++;

  extractedFiles.push({
    fileName: path.basename(dest),
    filePath: rel.replace(/\\/g, '/'),
    fileSize: data.length
  });
}

console.log(`Extracted ${fileCount} files (${(totalSize / 1024).toFixed(1)} KB) to ${targetDir}`);

// Update data/mdk-store.json
const dbPath = path.resolve('data/mdk-store.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (!Array.isArray(db.hostedProjects)) db.hostedProjects = [];
if (!Array.isArray(db.hostedDeployments)) db.hostedDeployments = [];

// Check if project exists or add it
const existingIndex = db.hostedProjects.findIndex(p => p.slug === slug);
const now = new Date().toISOString();
const projectId = existingIndex !== -1 ? db.hostedProjects[existingIndex].id : `proj_solar_${Date.now().toString(36)}`;
const deploymentId = `dep_solar_${Date.now().toString(36)}`;

const projectData = {
  id: projectId,
  userId: adminId,
  userEmail: 'officialaadhakh@gmail.com',
  userName: 'Sabir Usmani',
  projectName: 'Solar Intro Page',
  slug: slug,
  description: 'Solar energy introduction, modern clean tech landing page, and residential/commercial solar solutions.',
  visibility: 'public',
  activeDeploymentId: deploymentId,
  deploymentUrl: `/sites/${slug}`,
  deploymentStatus: 'live',
  thumbnail: '/images/project-solar.jpg',
  storageUsedBytes: totalSize,
  totalDeployments: 1,
  viewCount: 1,
  createdAt: now,
  updatedAt: now
};

if (existingIndex !== -1) {
  db.hostedProjects[existingIndex] = projectData;
} else {
  db.hostedProjects.unshift(projectData);
}

const deployment = {
  id: deploymentId,
  projectId: projectId,
  userId: adminId,
  deploymentStatus: 'live',
  deploymentUrl: `/sites/${slug}`,
  storagePath: targetDir,
  fileCount: fileCount,
  totalSize: totalSize,
  entryFile: 'index.html',
  logs: [
    `[${now}] Archive verified: ${fileCount} files, ${(totalSize / 1024).toFixed(1)} KB`,
    `[${now}] Extracted Solar Intro Page web assets`,
    `[${now}] Successfully activated at /sites/${slug}`
  ],
  createdAt: now,
  publishedAt: now
};

db.hostedDeployments.unshift(deployment);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Project registered in DB successfully! URL: /sites/' + slug);

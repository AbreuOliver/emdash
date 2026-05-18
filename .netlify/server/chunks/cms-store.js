import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
const defaultWeeklyHours = [
  { label: "Monday", opens: "11:00", closes: "21:00", closed: false },
  { label: "Tuesday", opens: "11:00", closes: "21:00", closed: false },
  { label: "Wednesday", opens: "11:00", closes: "21:00", closed: false },
  { label: "Thursday", opens: "11:00", closes: "21:00", closed: false },
  { label: "Friday", opens: "11:00", closes: "22:00", closed: false },
  { label: "Saturday", opens: "11:00", closes: "22:00", closed: false },
  { label: "Sunday", opens: "10:00", closes: "20:00", closed: false }
];
const defaultCmsData = {
  site: {
    title: "Symballo Brasserie",
    tagline: "Regional ingredients. Memorable evenings.",
    phone: "(555) 123-4567",
    email: "hello@symballo.agency",
    address: "123 Main Street, Your Town, ST 00000",
    hours: defaultWeeklyHours,
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com"
  },
  posts: [
    {
      slug: "welcome",
      title: "Welcome to Symballo Brasserie",
      excerpt: "A quick intro to the template and how to update it.",
      publishedAt: "2026-04-21",
      body: "Replace this post content with your business updates, events, or announcements.",
      seoTitle: "Welcome to Symballo Brasserie",
      seoDescription: "A quick intro to the template and how to update it.",
      seoKeywords: "local business, brasserie, restaurant",
      seoNoIndex: false,
      bannerEnabled: false,
      bannerStartDate: "",
      bannerEndDate: ""
    }
  ],
  pages: [
    {
      slug: "contact",
      title: "Contact",
      body: "Add your booking details, map, and contact form instructions here.",
      seoTitle: "Contact",
      seoDescription: "Get in touch and plan your next visit.",
      seoKeywords: "contact, reservations, location",
      seoNoIndex: false
    }
  ]
};
const cmsPath = resolve(process.cwd(), "data", "cms.json");
const cmsDriver = process.env.CMS_DRIVER ?? "file";
const allowPlaceholderServices = process.env.ALLOW_PLACEHOLDER_SERVICES === "1";
function normalizeHours(value) {
  if (!Array.isArray(value)) {
    return defaultWeeklyHours.map((entry) => ({ ...entry }));
  }
  const parsed = value.map((entry) => {
    if (!entry || typeof entry !== "object") return null;
    const row = entry;
    return {
      label: typeof row.label === "string" ? row.label : "Day",
      opens: typeof row.opens === "string" ? row.opens : "",
      closes: typeof row.closes === "string" ? row.closes : "",
      closed: Boolean(row.closed)
    };
  }).filter((entry) => entry !== null);
  const fallback = defaultWeeklyHours.map((entry) => ({ ...entry }));
  if (parsed.length >= 7) {
    return parsed;
  }
  return [...parsed, ...fallback.slice(parsed.length)];
}
function normalizePosts(value) {
  if (!Array.isArray(value)) return [...defaultCmsData.posts];
  return value.map((entry) => {
    if (!entry || typeof entry !== "object") return null;
    const post = entry;
    return {
      slug: typeof post.slug === "string" ? post.slug : `post-${Date.now()}`,
      title: typeof post.title === "string" ? post.title : "Untitled",
      excerpt: typeof post.excerpt === "string" ? post.excerpt : "",
      publishedAt: typeof post.publishedAt === "string" ? post.publishedAt : (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      body: typeof post.body === "string" ? post.body : "",
      seoTitle: typeof post.seoTitle === "string" ? post.seoTitle : "",
      seoDescription: typeof post.seoDescription === "string" ? post.seoDescription : "",
      seoKeywords: typeof post.seoKeywords === "string" ? post.seoKeywords : "",
      seoNoIndex: Boolean(post.seoNoIndex),
      bannerEnabled: Boolean(post.bannerEnabled),
      bannerStartDate: typeof post.bannerStartDate === "string" ? post.bannerStartDate : "",
      bannerEndDate: typeof post.bannerEndDate === "string" ? post.bannerEndDate : ""
    };
  }).filter((entry) => entry !== null);
}
function normalizePages(value) {
  if (!Array.isArray(value)) return [...defaultCmsData.pages];
  const parsed = value.map((entry) => {
    if (!entry || typeof entry !== "object") return null;
    const page = entry;
    if (typeof page.slug !== "string" || typeof page.title !== "string") return null;
    return {
      slug: page.slug,
      title: page.title,
      body: typeof page.body === "string" ? page.body : "",
      seoTitle: typeof page.seoTitle === "string" ? page.seoTitle : "",
      seoDescription: typeof page.seoDescription === "string" ? page.seoDescription : "",
      seoKeywords: typeof page.seoKeywords === "string" ? page.seoKeywords : "",
      seoNoIndex: Boolean(page.seoNoIndex)
    };
  }).filter((entry) => entry !== null);
  return parsed.length > 0 ? parsed : [...defaultCmsData.pages];
}
function normalizeCmsData(raw) {
  if (!raw || typeof raw !== "object") {
    return structuredClone(defaultCmsData);
  }
  const data = raw;
  const site = data.site ?? {};
  return {
    site: {
      title: typeof site.title === "string" ? site.title : defaultCmsData.site.title,
      tagline: typeof site.tagline === "string" ? site.tagline : defaultCmsData.site.tagline,
      phone: typeof site.phone === "string" ? site.phone : defaultCmsData.site.phone,
      email: typeof site.email === "string" ? site.email : defaultCmsData.site.email,
      address: typeof site.address === "string" ? site.address : defaultCmsData.site.address,
      hours: normalizeHours(site.hours),
      facebookUrl: typeof site.facebookUrl === "string" ? site.facebookUrl : defaultCmsData.site.facebookUrl,
      instagramUrl: typeof site.instagramUrl === "string" ? site.instagramUrl : defaultCmsData.site.instagramUrl
    },
    posts: normalizePosts(data.posts),
    pages: normalizePages(data.pages)
  };
}
async function readCmsData() {
  if (cmsDriver === "turso") {
    if (!allowPlaceholderServices) {
      throw new Error("CMS_DRIVER=turso is selected but Turso integration is not wired yet.");
    }
    return structuredClone(defaultCmsData);
  }
  try {
    const raw = await readFile(cmsPath, "utf8");
    return normalizeCmsData(JSON.parse(raw));
  } catch {
    return structuredClone(defaultCmsData);
  }
}
async function writeCmsData(data) {
  if (cmsDriver === "turso") {
    if (!allowPlaceholderServices) {
      throw new Error("CMS_DRIVER=turso is selected but Turso integration is not wired yet.");
    }
    return;
  }
  await mkdir(dirname(cmsPath), { recursive: true });
  await writeFile(cmsPath, JSON.stringify(normalizeCmsData(data), null, 2), "utf8");
}
export {
  readCmsData as r,
  writeCmsData as w
};

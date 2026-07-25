import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type WorkMeta = {
  slug: string;
  title: string;
  summary: string;
  category: "product" | "client";
  year: string;
  status: "live" | "in-progress" | "archived";
  url?: string;
  image?: string;
  tags: string[];
  featured?: boolean;
};

const workDir = path.join(process.cwd(), "content/work");

function readMdxFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      return { slug, data, content };
    });
}

export function getAllWork(): WorkMeta[] {
  return readMdxFiles(workDir)
    .map(({ slug, data }) => ({
      slug,
      title: String(data.title ?? slug),
      summary: String(data.summary ?? ""),
      category: (data.category as WorkMeta["category"]) ?? "product",
      year: String(data.year ?? ""),
      status: (data.status as WorkMeta["status"]) ?? "live",
      url: data.url ? String(data.url) : undefined,
      image: data.image ? String(data.image) : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      featured: Boolean(data.featured),
    }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

export function getFeaturedWork(): WorkMeta[] {
  const all = getAllWork();
  const featured = all.filter((item) => item.featured);
  return featured.length ? featured : all.slice(0, 2);
}

export function getWorkBySlug(slug: string) {
  const file = path.join(workDir, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: String(data.title ?? slug),
      summary: String(data.summary ?? ""),
      category: (data.category as WorkMeta["category"]) ?? "product",
      year: String(data.year ?? ""),
      status: (data.status as WorkMeta["status"]) ?? "live",
      url: data.url ? String(data.url) : undefined,
      image: data.image ? String(data.image) : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      featured: Boolean(data.featured),
    } satisfies WorkMeta,
    content,
  };
}

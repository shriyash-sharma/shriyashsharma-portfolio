export const siteConfig = {
  name: "Shriyash Sharma",
  title: "Shriyash Sharma — Senior Software Engineer & AI Engineer",
  description:
    "Shriyash Sharma — Senior Software Engineer and AI Engineer building RAG systems, semantic search, FastAPI backends, and scalable Next.js applications.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shriyashsharma.com",
  ogImage: "/ShriyashLogo.png",
  brand: {
    logo: "/ShriyashLogo.png",
    wordmark: "/ShriyashWordmark.svg",
  },
  author: {
    name: "Shriyash Sharma",
    email: "hello@shriyashsharma.com",
    twitter: "@shriyashsharma",
    github: "https://github.com/shriyash-sharma",
    linkedin: "https://www.linkedin.com/in/shriyash-sharma-3b2b27119/",
  },
  links: {
    github: "https://github.com/shriyash-sharma",
    linkedin: "https://www.linkedin.com/in/shriyash-sharma-3b2b27119/",
  },
} as const;

export type SiteConfig = typeof siteConfig;

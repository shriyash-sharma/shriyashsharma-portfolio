export const siteConfig = {
  name: "Shriyash Sharma",
  title: "Shriyash Sharma — Senior Software Engineer",
  description:
    "Senior Software Engineer at Globant building scalable web applications with React, Next.js, FastAPI, and AI/RAG systems.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shriyashsharma.com",
  ogImage: "/ShriyashLogo.png",
  brand: {
    logo: "/ShriyashLogo.png",
    wordmark: "/ShriyashWordmark.svg",
  },
  author: {
    name: "Shriyash Sharma",
    email: "hello@shriyashsharma.dev",
    twitter: "@shriyashsharma",
    github: "https://github.com/shriyashsharma",
    linkedin: "https://linkedin.com/in/shriyashsharma",
  },
  links: {
    github: "https://github.com/shriyashsharma",
    linkedin: "https://linkedin.com/in/shriyashsharma",
  },
} as const;

export type SiteConfig = typeof siteConfig;

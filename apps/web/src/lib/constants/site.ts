export const siteConfig = {
  name: "Shriyash Sharma",
  title: "Shriyash Sharma — AI Engineer & GenAI Full-Stack Engineer",
  description:
    "Shriyash Sharma — AI Engineer and GenAI full-stack engineer building RAG systems, semantic search, and production React and Next.js platforms.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shriyashsharma.com",
  themeColor: "#080808",
  ogImage: {
    url: "/og.jpg",
    width: 1200,
    height: 630,
    alt: "Shriyash Sharma — AI Engineer | GenAI Full-Stack (React, Next.js, RAG)",
  },
  brand: {
    logo: "/ShriyashLogo.webp",
    wordmark: "/ShriyashWordmark.svg",
    portrait: "/ShriyashProfilePhotoV3.webp",
  },
  resume: "/resume/Shriyash-Sharma-Resume.pdf",
  author: {
    name: "Shriyash Sharma",
    email: "hello@shriyashsharma.com",
    twitter: "@ShriyashSharma",
    github: "https://github.com/shriyash-sharma",
    linkedin: "https://www.linkedin.com/in/shriyash-sharma-3b2b27119/",
  },
  links: {
    github: "https://github.com/shriyash-sharma",
    linkedin: "https://www.linkedin.com/in/shriyash-sharma-3b2b27119/",
    x: "https://x.com/ShriyashSharma",
  },
} as const;

export type SiteConfig = typeof siteConfig;

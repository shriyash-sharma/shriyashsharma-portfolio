export const siteConfig = {
  name: "Shriyash Sharma",
  title: "Shriyash Sharma — Software Engineer",
  description:
    "Software engineer specializing in scalable frontend systems, AI integration, and modern product engineering.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shriyashsharma.dev",
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

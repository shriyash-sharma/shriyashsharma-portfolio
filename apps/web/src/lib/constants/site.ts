export const siteConfig = {
  name: "Shriyash Sharma",
  title: "Shriyash Sharma — Senior Software Engineer",
  description:
    "Senior Software Engineer building scalable web applications and evolving AI-powered engineering systems.",
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

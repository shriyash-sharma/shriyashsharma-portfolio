export type NavItem = {
  key: "projects" | "caseStudies" | "aiLab" | "blog" | "about" | "contact";
  label: string;
  href: string;
  external?: boolean;
};

export const navItems: NavItem[] = [
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "caseStudies", label: "Case Studies", href: "/case-studies" },
  { key: "aiLab", label: "AI Lab", href: "/ai-lab" },
  { key: "blog", label: "Blog", href: "/blog" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
];

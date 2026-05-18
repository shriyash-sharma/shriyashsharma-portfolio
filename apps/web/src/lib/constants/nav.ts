export type NavItem = {
  key: "projects" | "caseStudies" | "blog" | "speaking" | "about" | "contact";
  label: string;
  href: string;
  external?: boolean;
};

export const navItems: NavItem[] = [
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "caseStudies", label: "Case Studies", href: "/case-studies" },
  { key: "blog", label: "Blog", href: "/blog" },
  { key: "speaking", label: "Speaking", href: "/speaking" },
  { key: "about", label: "About", href: "/about" },
  { key: "contact", label: "Contact", href: "/contact" },
];

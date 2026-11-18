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

/** Primary nav items; Blog is hidden until at least one post is published. */
export function getNavItems(showBlog: boolean): NavItem[] {
  return showBlog ? navItems : navItems.filter((item) => item.key !== "blog");
}

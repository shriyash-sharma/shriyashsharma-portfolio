import type { Locale } from "./config";

type Dictionary = {
  nav: {
    projects: string;
    caseStudies: string;
    blog: string;
    about: string;
    contact: string;
  };
  a11y: {
    primaryNavigation: string;
    mobileNavigation: string;
    openNavigation: string;
    closeNavigation: string;
    home: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      projects: "Projects",
      caseStudies: "Case Studies",
      blog: "Blog",
      about: "About",
      contact: "Contact",
    },
    a11y: {
      primaryNavigation: "Primary navigation",
      mobileNavigation: "Mobile navigation",
      openNavigation: "Open navigation",
      closeNavigation: "Close navigation",
      home: "home",
    },
  },
  hi: {
    nav: {
      projects: "प्रोजेक्ट्स",
      caseStudies: "केस स्टडीज़",
      blog: "ब्लॉग",
      about: "परिचय",
      contact: "संपर्क",
    },
    a11y: {
      primaryNavigation: "मुख्य नेविगेशन",
      mobileNavigation: "मोबाइल नेविगेशन",
      openNavigation: "नेविगेशन खोलें",
      closeNavigation: "नेविगेशन बंद करें",
      home: "होम",
    },
  },
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}

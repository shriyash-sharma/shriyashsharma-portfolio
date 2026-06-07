import type { Locale } from "./config";

type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    projects: string;
    caseStudies: string;
    aiLab: string;
    blog: string;
    speaking: string;
    about: string;
    contact: string;
  };
  a11y: {
    primaryNavigation: string;
    mobileNavigation: string;
    openNavigation: string;
    closeNavigation: string;
    home: string;
    languageSwitcher: string;
    changeLanguage: string;
    currentLanguage: string;
  };
  home: {
    status: string;
    byline: string;
    heading: string;
    headingAccent: string;
    intro: string;
    primaryCta: string;
    secondaryCta: string;
    meta: [string, string, string];
    contactHeading: string;
    contactCopy: string;
    contactPrimary: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    meta: {
      title:
        "Shriyash Sharma | AI Engineering Portfolio | RAG, FastAPI & Next.js",
      description:
        "Shriyash Sharma — Senior Software Engineer and AI Engineer. Personal portfolio covering RAG systems, semantic search, FastAPI, PostgreSQL, pgvector, Next.js, and production system design.",
    },
    nav: {
      projects: "Projects",
      caseStudies: "Case Studies",
      aiLab: "AI Lab",
      blog: "Blog",
      speaking: "Speaking",
      about: "About",
      contact: "Contact",
    },
    a11y: {
      primaryNavigation: "Primary navigation",
      mobileNavigation: "Mobile navigation",
      openNavigation: "Open navigation",
      closeNavigation: "Close navigation",
      home: "home",
      languageSwitcher: "Language selector",
      changeLanguage: "Change language",
      currentLanguage: "Current language",
    },
    home: {
      status: "Open to engineering roles, platform-focused product work, and selected consulting collaborations",
      byline: "Shriyash Sharma · Senior Software Engineer · AI Engineering",
      heading:
        "Building scalable systems with modern web architecture, AI-assisted workflows, and practical backend infrastructure.",
      headingAccent: "",
      intro:
        "I'm Shriyash Sharma, a Senior Software Engineer building scalable frontend and full-stack systems focused on modern web architecture, operational platforms, and practical AI integration. My recent work includes Next.js applications, FastAPI backend services, semantic search, PostgreSQL with pgvector, RAG pipelines, and AI-powered workflows for real-world use cases.",
      primaryCta: "View work",
      secondaryCta: "About me",
      meta: [
        "7+ years building production software",
        "React · Next.js · FastAPI · RAG",
        "Pune, India",
      ],
      contactHeading: "Open to senior engineering roles and consulting collaborations.",
      contactCopy:
        "I am most useful where product work and engineering depth meet: frontend architecture, platform-quality UI systems, full-stack coordination, and AI-assisted product workflows that need to stay grounded in real delivery constraints.",
      contactPrimary: "Get in touch",
    },
  },
  es: {
    meta: {
      title: "Shriyash Sharma — Ingeniero de software",
      description:
        "Ingeniero de software especializado en sistemas frontend escalables, integración de IA e ingeniería de producto moderna.",
    },
    nav: {
      projects: "Proyectos",
      caseStudies: "Casos",
      aiLab: "AI Lab",
      blog: "Blog",
      speaking: "Charlas",
      about: "Perfil",
      contact: "Contacto",
    },
    a11y: {
      primaryNavigation: "Navegación principal",
      mobileNavigation: "Navegación móvil",
      openNavigation: "Abrir navegación",
      closeNavigation: "Cerrar navegación",
      home: "inicio",
      languageSwitcher: "Selector de idioma",
      changeLanguage: "Cambiar idioma",
      currentLanguage: "Idioma actual",
    },
    home: {
      status: "Disponible para nuevos roles",
      byline: "Shriyash Sharma · Ingeniero de software senior · Ingeniería de IA",
      heading: "Ingeniero senior de software",
      headingAccent: "construyendo sistemas duraderos",
      intro:
        "Construyo software de producción con cuidado: diseño de APIs, sistemas frontend y decisiones de arquitectura que se acumulan con el tiempo. Prefiero decisiones fiables y claras antes que complejidad innecesaria.",
      primaryCta: "Ver trabajo",
      secondaryCta: "Sobre mí",
      meta: [
        "5+ años en software de producción",
        "Frontend · Fullstack · Sistemas",
        "India · Remoto primero",
      ],
      contactHeading: "Abierto a la oportunidad adecuada",
      contactCopy:
        "Busco roles senior de ingeniería, consultoría de arquitectura o trabajo por contrato. Si estás construyendo algo técnicamente ambicioso, hablemos.",
      contactPrimary: "Contactar",
    },
  },
  ar: {
    meta: {
      title: "شرياش شارما — مهندس برمجيات",
      description:
        "مهندس برمجيات متخصص في أنظمة الواجهات القابلة للتوسع، وتكامل الذكاء الاصطناعي، وهندسة المنتجات الحديثة.",
    },
    nav: {
      projects: "المشاريع",
      caseStudies: "دراسات الحالة",
      aiLab: "AI Lab",
      blog: "المدونة",
      speaking: "محاضرات",
      about: "نبذة",
      contact: "تواصل",
    },
    a11y: {
      primaryNavigation: "التنقل الرئيسي",
      mobileNavigation: "تنقل الهاتف",
      openNavigation: "فتح التنقل",
      closeNavigation: "إغلاق التنقل",
      home: "الرئيسية",
      languageSwitcher: "محدد اللغة",
      changeLanguage: "تغيير اللغة",
      currentLanguage: "اللغة الحالية",
    },
    home: {
      status: "متاح لأدوار جديدة",
      byline: "Shriyash Sharma · مهندس برمجيات أول · هندسة الذكاء الاصطناعي",
      heading: "مهندس برمجيات أول",
      headingAccent: "يبني أنظمة تدوم",
      intro:
        "أبني برمجيات إنتاجية بعناية: تصميم واجهات البرمجة، أنظمة الواجهة الأمامية، وقرارات الهندسة التي تتراكم قيمتها مع الوقت. أفضّل الخيارات الواضحة والموثوقة قبل إضافة التعقيد.",
      primaryCta: "عرض الأعمال",
      secondaryCta: "نبذة عني",
      meta: [
        "أكثر من 5 سنوات في برمجيات الإنتاج",
        "واجهة أمامية · Fullstack · أنظمة",
        "الهند · عمل عن بُعد أولاً",
      ],
      contactHeading: "منفتح على الفرصة المناسبة",
      contactCopy:
        "أبحث عن أدوار هندسية أولى، أو استشارات معمارية، أو عمل تعاقدي. إذا كنت تبني منتجاً طموحاً تقنياً، فلنتحدث.",
      contactPrimary: "تواصل معي",
    },
  },
  hi: {
    meta: {
      title: "Shriyash Sharma — सॉफ्टवेयर इंजीनियर",
      description:
        "स्केलेबल frontend systems, AI integration, और modern product engineering में विशेषज्ञ सॉफ्टवेयर इंजीनियर।",
    },
    nav: {
      projects: "प्रोजेक्ट्स",
      caseStudies: "केस स्टडीज़",
      aiLab: "AI Lab",
      blog: "ब्लॉग",
      speaking: "वार्ता",
      about: "परिचय",
      contact: "संपर्क",
    },
    a11y: {
      primaryNavigation: "मुख्य नेविगेशन",
      mobileNavigation: "मोबाइल नेविगेशन",
      openNavigation: "नेविगेशन खोलें",
      closeNavigation: "नेविगेशन बंद करें",
      home: "होम",
      languageSwitcher: "भाषा चयन",
      changeLanguage: "भाषा बदलें",
      currentLanguage: "वर्तमान भाषा",
    },
    home: {
      status: "नए roles के लिए उपलब्ध",
      byline: "Shriyash Sharma · सीनियर सॉफ्टवेयर इंजीनियर · AI Engineering",
      heading: "सीनियर सॉफ्टवेयर इंजीनियर",
      headingAccent: "लंबे समय तक चलने वाले सिस्टम बनाता हूँ",
      intro:
        "मैं production software सावधानी से बनाता हूँ — API design, frontend systems, और architecture decisions जो समय के साथ value बनाते हैं। मैं complexity से पहले भरोसेमंद और साफ़ structure को प्राथमिकता देता हूँ।",
      primaryCta: "काम देखें",
      secondaryCta: "मेरे बारे में",
      meta: [
        "5+ साल production software",
        "Frontend · Fullstack · Systems",
        "India · Remote-first",
      ],
      contactHeading: "सही अवसर के लिए उपलब्ध",
      contactCopy:
        "Senior engineering roles, architecture consulting, या contract work के लिए खुला हूँ। अगर आप technically ambitious product बना रहे हैं, बात करते हैं।",
      contactPrimary: "संपर्क करें",
    },
  },
  pt: {
    meta: {
      title: "Shriyash Sharma — Engenheiro de software",
      description:
        "Engenheiro de software especializado em sistemas frontend escaláveis, integração de IA e engenharia moderna de produto.",
    },
    nav: {
      projects: "Projetos",
      caseStudies: "Estudos",
      aiLab: "AI Lab",
      blog: "Blog",
      speaking: "Palestras",
      about: "Sobre",
      contact: "Contato",
    },
    a11y: {
      primaryNavigation: "Navegação principal",
      mobileNavigation: "Navegação móvel",
      openNavigation: "Abrir navegação",
      closeNavigation: "Fechar navegação",
      home: "início",
      languageSwitcher: "Seletor de idioma",
      changeLanguage: "Alterar idioma",
      currentLanguage: "Idioma atual",
    },
    home: {
      status: "Disponível para novos papéis",
      byline: "Shriyash Sharma · Engenheiro sênior de software · Engenharia de IA",
      heading: "Engenheiro sênior de software",
      headingAccent: "construindo sistemas duráveis",
      intro:
        "Construo software de produção com cuidado: design de APIs, sistemas frontend e decisões de arquitetura que ganham valor com o tempo. Prefiro escolhas confiáveis e simples antes de adicionar complexidade.",
      primaryCta: "Ver trabalho",
      secondaryCta: "Sobre mim",
      meta: [
        "5+ anos em software de produção",
        "Frontend · Fullstack · Sistemas",
        "Índia · Remoto primeiro",
      ],
      contactHeading: "Aberto à oportunidade certa",
      contactCopy:
        "Busco posições sênior de engenharia, consultoria de arquitetura ou trabalho contratado. Se você está construindo algo tecnicamente ambicioso, vamos conversar.",
      contactPrimary: "Entrar em contato",
    },
  },
  de: {
    meta: {
      title: "Shriyash Sharma — Software Engineer",
      description:
        "Software Engineer mit Fokus auf skalierbare Frontend-Systeme, KI-Integration und moderne Produktentwicklung.",
    },
    nav: {
      projects: "Projekte",
      caseStudies: "Fallstudien",
      aiLab: "AI Lab",
      blog: "Blog",
      speaking: "Vorträge",
      about: "Profil",
      contact: "Kontakt",
    },
    a11y: {
      primaryNavigation: "Hauptnavigation",
      mobileNavigation: "Mobile Navigation",
      openNavigation: "Navigation öffnen",
      closeNavigation: "Navigation schließen",
      home: "Startseite",
      languageSwitcher: "Sprachauswahl",
      changeLanguage: "Sprache ändern",
      currentLanguage: "Aktuelle Sprache",
    },
    home: {
      status: "Offen für neue Rollen",
      byline: "Shriyash Sharma · Senior Software Engineer · AI Engineering",
      heading: "Senior Software Engineer",
      headingAccent: "für langlebige Systeme",
      intro:
        "Ich entwickle Produktionssoftware mit Sorgfalt: API-Design, Frontend-Systeme und Architekturentscheidungen, die langfristig Wirkung haben. Ich bevorzuge verlässliche, klare Lösungen vor unnötiger Komplexität.",
      primaryCta: "Arbeiten ansehen",
      secondaryCta: "Über mich",
      meta: [
        "5+ Jahre Produktionssoftware",
        "Frontend · Fullstack · Systeme",
        "Indien · Remote-first",
      ],
      contactHeading: "Offen für die passende Gelegenheit",
      contactCopy:
        "Ich suche Senior-Engineering-Rollen, Architekturberatung oder Projektarbeit. Wenn du etwas technisch Anspruchsvolles baust, lass uns sprechen.",
      contactPrimary: "Kontakt aufnehmen",
    },
  },
  fr: {
    meta: {
      title: "Shriyash Sharma — Ingénieur logiciel",
      description:
        "Ingénieur logiciel spécialisé dans les systèmes frontend scalables, l’intégration IA et l’ingénierie produit moderne.",
    },
    nav: {
      projects: "Projets",
      caseStudies: "Études",
      aiLab: "AI Lab",
      blog: "Blog",
      speaking: "Conférences",
      about: "Profil",
      contact: "Contact",
    },
    a11y: {
      primaryNavigation: "Navigation principale",
      mobileNavigation: "Navigation mobile",
      openNavigation: "Ouvrir la navigation",
      closeNavigation: "Fermer la navigation",
      home: "accueil",
      languageSwitcher: "Sélecteur de langue",
      changeLanguage: "Changer de langue",
      currentLanguage: "Langue actuelle",
    },
    home: {
      status: "Disponible pour de nouveaux rôles",
      byline: "Shriyash Sharma · Ingénieur logiciel senior · Ingénierie IA",
      heading: "Ingénieur logiciel senior",
      headingAccent: "construire des systèmes durables",
      intro:
        "Je construis des logiciels de production avec soin : conception d’API, systèmes frontend et décisions d’architecture qui prennent de la valeur avec le temps. Je privilégie les choix fiables et clairs avant la complexité.",
      primaryCta: "Voir le travail",
      secondaryCta: "À propos",
      meta: [
        "5+ ans en logiciel de production",
        "Frontend · Fullstack · Systèmes",
        "Inde · Remote-first",
      ],
      contactHeading: "Ouvert à la bonne opportunité",
      contactCopy:
        "Je recherche des rôles senior en ingénierie, du conseil en architecture ou des missions. Si vous construisez quelque chose de techniquement ambitieux, parlons-en.",
      contactPrimary: "Me contacter",
    },
  },
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  categorySlug: string;
  plays: number;
  questionsCount: number;
  type: "personality" | "trivia";
  trending: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  quizCount: number;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Προσωπικότητα",
    slug: "prosopikotita",
    description: "Ανακάλυψε ποιος είσαι πραγματικά",
    icon: "✨",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop",
    color: "quiz-purple",
    quizCount: 24,
  },
  {
    id: "2",
    name: "Διασημότητες",
    slug: "diasimotites",
    description: "Πόσο καλά ξέρεις τα αγαπημένα σου αστέρια;",
    icon: "⭐",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop",
    color: "quiz-pink",
    quizCount: 18,
  },
  {
    id: "3",
    name: "Ταινίες & Σειρές",
    slug: "tainies-seires",
    description: "Quiz για κινηματογράφο και τηλεόραση",
    icon: "🎬",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop",
    color: "primary",
    quizCount: 31,
  },
  {
    id: "4",
    name: "Αθλητικά",
    slug: "athlitika",
    description: "Δοκίμασε τις γνώσεις σου στον αθλητισμό",
    icon: "⚽",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
    color: "quiz-green",
    quizCount: 15,
  },
  {
    id: "5",
    name: "Μουσική",
    slug: "mousiki",
    description: "Από pop μέχρι rock, πόσο καλά τα πας;",
    icon: "🎵",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    color: "quiz-orange",
    quizCount: 22,
  },
  {
    id: "6",
    name: "Γενικές Γνώσεις",
    slug: "genikes-gnoseis",
    description: "Τεστ ευφυΐας και γενικών γνώσεων",
    icon: "🧠",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop",
    color: "quiz-teal",
    quizCount: 27,
  },
];

export const sampleQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Ποιος χαρακτήρας από τα Friends είσαι;",
    description: "Απάντησε σε 10 ερωτήσεις και μάθε αν είσαι ο Ross, η Rachel, ο Joey ή κάποιος άλλος!",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=400&fit=crop",
    category: "Ταινίες & Σειρές",
    categorySlug: "tainies-seires",
    plays: 34521,
    questionsCount: 10,
    type: "personality",
    trending: true,
    createdAt: "2026-03-01",
  },
  {
    id: "2",
    title: "Πόσο καλά ξέρεις τον Messi;",
    description: "10 ερωτήσεις για τον καλύτερο ποδοσφαιριστή όλων των εποχών",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
    category: "Αθλητικά",
    categorySlug: "athlitika",
    plays: 28943,
    questionsCount: 10,
    type: "trivia",
    trending: true,
    createdAt: "2026-03-02",
  },
  {
    id: "3",
    title: "Τι τύπος προσωπικότητας είσαι;",
    description: "Ανακάλυψε αν είσαι εσωστρεφής ή εξωστρεφής με αυτό το quiz!",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=400&fit=crop",
    category: "Προσωπικότητα",
    categorySlug: "prosopikotita",
    plays: 52103,
    questionsCount: 12,
    type: "personality",
    trending: true,
    createdAt: "2026-02-28",
  },
  {
    id: "4",
    title: "Ποιος τραγουδιστής σου μοιάζει;",
    description: "Από Taylor Swift μέχρι Bad Bunny — ποιος σου ταιριάζει;",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    category: "Μουσική",
    categorySlug: "mousiki",
    plays: 19832,
    questionsCount: 8,
    type: "personality",
    trending: true,
    createdAt: "2026-03-03",
  },
  {
    id: "5",
    title: "Μπορείς να αναγνωρίσεις τον διάσημο από παιδί;",
    description: "Σου δείχνουμε παιδικές φωτογραφίες — εσύ μαντεύεις!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    category: "Διασημότητες",
    categorySlug: "diasimotites",
    plays: 41205,
    questionsCount: 15,
    type: "trivia",
    trending: true,
    createdAt: "2026-03-04",
  },
  {
    id: "6",
    title: "Πόσο έξυπνος είσαι; Τεστ IQ",
    description: "20 ερωτήσεις που θα δοκιμάσουν τα όριά σου",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop",
    category: "Γενικές Γνώσεις",
    categorySlug: "genikes-gnoseis",
    plays: 67890,
    questionsCount: 20,
    type: "trivia",
    trending: false,
    createdAt: "2026-02-25",
  },
  {
    id: "7",
    title: "Ποιος χαρακτήρας της Marvel είσαι;",
    description: "Iron Man, Spider-Man ή Captain America; Πάρε το quiz!",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=400&fit=crop",
    category: "Ταινίες & Σειρές",
    categorySlug: "tainies-seires",
    plays: 45123,
    questionsCount: 10,
    type: "personality",
    trending: false,
    createdAt: "2026-02-20",
  },
  {
    id: "8",
    title: "Ποια χώρα ταιριάζει στην προσωπικότητά σου;",
    description: "Αν ήσουν χώρα, ποια θα ήσουν;",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop",
    category: "Προσωπικότητα",
    categorySlug: "prosopikotita",
    plays: 31456,
    questionsCount: 12,
    type: "personality",
    trending: false,
    createdAt: "2026-02-18",
  },
  {
    id: "9",
    title: "Πόσο καλά ξέρεις τον Harry Potter;",
    description: "Μόνο αληθινοί Potterheads θα βγάλουν 10/10",
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=600&h=400&fit=crop",
    category: "Ταινίες & Σειρές",
    categorySlug: "tainies-seires",
    plays: 58234,
    questionsCount: 10,
    type: "trivia",
    trending: false,
    createdAt: "2026-02-15",
  },
  {
    id: "10",
    title: "Ποιος παίκτης του NBA σου μοιάζει;",
    description: "LeBron, Curry ή Giannis; Μάθε τώρα!",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop",
    category: "Αθλητικά",
    categorySlug: "athlitika",
    plays: 22341,
    questionsCount: 8,
    type: "personality",
    trending: false,
    createdAt: "2026-03-05",
  },
];

export const getTrendingQuizzes = () => sampleQuizzes.filter((q) => q.trending);
export const getQuizzesByCategory = (slug: string) => sampleQuizzes.filter((q) => q.categorySlug === slug);
export const getPopularQuizzes = () => [...sampleQuizzes].sort((a, b) => b.plays - a.plays).slice(0, 6);
export const getQuizById = (id: string) => sampleQuizzes.find((q) => q.id === id);
export const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

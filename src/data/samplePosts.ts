export interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  postType: "article" | "shopping" | "celebrity" | "trending_news";
  views: number;
  reactions: Record<string, number>;
  createdAt: string;
}

export interface BuzzChat {
  id: string;
  question: string;
  image?: string;
  repliesCount: number;
  createdAt: string;
}

export const samplePosts: Post[] = [
  {
    id: "p1",
    title: "15 Πράγματα που μόνο όσοι μεγάλωσαν στα 90s θα καταλάβουν",
    description: "Nostalgia alert! Από τα Tamagotchi μέχρι τις κασέτες VHS.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    postType: "trending_news",
    views: 125000,
    reactions: { "👍": 3420, "❤️": 1890, "😂": 5200, "😭": 890 },
    createdAt: "2026-03-07",
  },
  {
    id: "p2",
    title: "Η Zendaya εμφανίστηκε στα Oscars με φόρεμα που έσπασε το internet",
    description: "Δες τη viral εμφάνιση που σχολιάζουν όλοι.",
    image: "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=600&h=400&fit=crop",
    postType: "celebrity",
    views: 230000,
    reactions: { "❤️": 8900, "🤯": 4200, "👍": 2100 },
    createdAt: "2026-03-06",
  },
  {
    id: "p3",
    title: "20 Προϊόντα από Amazon που θα αλλάξουν τη ζωή σου",
    description: "Gadgets, skincare και πράγματα που δεν ήξερες ότι χρειαζόσουν.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    postType: "shopping",
    views: 87000,
    reactions: { "👍": 2100, "❤️": 1500, "🤯": 800 },
    createdAt: "2026-03-05",
  },
  {
    id: "p4",
    title: "Ο Timothée Chalamet και η Kylie Jenner χώρισαν — τι ξέρουμε",
    description: "Τα πάντα για τον χωρισμό της χρονιάς.",
    image: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=600&h=400&fit=crop",
    postType: "celebrity",
    views: 345000,
    reactions: { "😭": 12000, "🤯": 3400, "😬": 5600 },
    createdAt: "2026-03-07",
  },
  {
    id: "p5",
    title: "Αυτό το TikTok hack για καθαρισμό σπιτιού είναι genius",
    description: "3 εκατομμύρια views σε 24 ώρες — δες γιατί.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    postType: "trending_news",
    views: 192000,
    reactions: { "👍": 4500, "🤯": 7800, "😂": 2300 },
    createdAt: "2026-03-08",
  },
  {
    id: "p6",
    title: "10 Sneakers κάτω από 100€ που φοράνε οι influencers",
    description: "Style tips χωρίς να σπάσεις τον κουμπαρά.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop",
    postType: "shopping",
    views: 65000,
    reactions: { "❤️": 3200, "👍": 1800, "🤯": 900 },
    createdAt: "2026-03-04",
  },
  {
    id: "p7",
    title: "Η Taylor Swift ανακοίνωσε νέο album — οι fans τρελάθηκαν",
    description: "Όλες οι πληροφορίες για το πολυαναμενόμενο νέο album.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    postType: "celebrity",
    views: 510000,
    reactions: { "❤️": 25000, "🤯": 8900, "👍": 6700 },
    createdAt: "2026-03-08",
  },
  {
    id: "p8",
    title: "Viral: Σκύλος κάνει skateboard και γίνεται αστέρι του internet",
    description: "Το βίντεο που χαλαρώνει ολόκληρο το internet.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
    postType: "trending_news",
    views: 890000,
    reactions: { "❤️": 45000, "😂": 32000, "👍": 12000 },
    createdAt: "2026-03-08",
  },
];

export const sampleBuzzChats: BuzzChat[] = [
  {
    id: "bc1",
    question: "Ποια ταινία έχεις δει τις περισσότερες φορές;",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop",
    repliesCount: 1243,
    createdAt: "2026-03-07",
  },
  {
    id: "bc2",
    question: "Αν μπορούσες να ζήσεις σε μια χώρα για πάντα, ποια θα ήταν;",
    repliesCount: 876,
    createdAt: "2026-03-06",
  },
  {
    id: "bc3",
    question: "Ποιο είναι το guilty pleasure φαγητό σου;",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
    repliesCount: 2341,
    createdAt: "2026-03-08",
  },
  {
    id: "bc4",
    question: "Ποιο τραγούδι ακούς σε repeat αυτή τη στιγμή;",
    repliesCount: 567,
    createdAt: "2026-03-05",
  },
];

export const getPostsByType = (type: Post["postType"]) =>
  samplePosts.filter((p) => p.postType === type);

export const getTrendingPosts = () =>
  [...samplePosts].sort((a, b) => b.views - a.views).slice(0, 5);

export const formatViews = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
};

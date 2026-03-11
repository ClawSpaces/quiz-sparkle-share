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
    name: "Personality",
    slug: "personality",
    description: "Discover who you really are",
    icon: "✨",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=300&fit=crop",
    color: "quiz-purple",
    quizCount: 24,
  },
  {
    id: "2",
    name: "Celebrities",
    slug: "celebrities",
    description: "How well do you know your favorite stars?",
    icon: "⭐",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&h=300&fit=crop",
    color: "quiz-pink",
    quizCount: 18,
  },
  {
    id: "3",
    name: "Movies & TV",
    slug: "movies-tv",
    description: "Quizzes about cinema and television",
    icon: "🎬",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop",
    color: "primary",
    quizCount: 31,
  },
  {
    id: "4",
    name: "Sports",
    slug: "sports",
    description: "Test your sports knowledge",
    icon: "⚽",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop",
    color: "quiz-green",
    quizCount: 15,
  },
  {
    id: "5",
    name: "Music",
    slug: "music",
    description: "From pop to rock, how well do you know it?",
    icon: "🎵",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    color: "quiz-orange",
    quizCount: 22,
  },
  {
    id: "6",
    name: "General Knowledge",
    slug: "general-knowledge",
    description: "IQ tests and general knowledge quizzes",
    icon: "🧠",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop",
    color: "quiz-teal",
    quizCount: 27,
  },
];

export const sampleQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Which Friends Character Are You?",
    description: "Answer 10 questions and find out if you're Ross, Rachel, Joey, or someone else!",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=400&fit=crop",
    category: "Movies & TV",
    categorySlug: "movies-tv",
    plays: 34521,
    questionsCount: 10,
    type: "personality",
    trending: true,
    createdAt: "2026-03-01",
  },
  {
    id: "2",
    title: "How Well Do You Know Messi?",
    description: "10 questions about the greatest footballer of all time",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
    category: "Sports",
    categorySlug: "sports",
    plays: 28943,
    questionsCount: 10,
    type: "trivia",
    trending: true,
    createdAt: "2026-03-02",
  },
  {
    id: "3",
    title: "What Personality Type Are You?",
    description: "Find out if you're an introvert or extrovert with this quiz!",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=400&fit=crop",
    category: "Personality",
    categorySlug: "personality",
    plays: 52103,
    questionsCount: 12,
    type: "personality",
    trending: true,
    createdAt: "2026-02-28",
  },
  {
    id: "4",
    title: "Which Singer Matches Your Vibe?",
    description: "From Taylor Swift to Bad Bunny — who's your match?",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    category: "Music",
    categorySlug: "music",
    plays: 19832,
    questionsCount: 8,
    type: "personality",
    trending: true,
    createdAt: "2026-03-03",
  },
  {
    id: "5",
    title: "Can You Recognize the Celebrity as a Kid?",
    description: "We show you childhood photos — you guess who it is!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    category: "Celebrities",
    categorySlug: "celebrities",
    plays: 41205,
    questionsCount: 15,
    type: "trivia",
    trending: true,
    createdAt: "2026-03-04",
  },
  {
    id: "6",
    title: "How Smart Are You? IQ Test",
    description: "20 questions that will push your limits",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop",
    category: "General Knowledge",
    categorySlug: "general-knowledge",
    plays: 67890,
    questionsCount: 20,
    type: "trivia",
    trending: false,
    createdAt: "2026-02-25",
  },
  {
    id: "7",
    title: "Which Marvel Character Are You?",
    description: "Iron Man, Spider-Man, or Captain America? Take the quiz!",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=400&fit=crop",
    category: "Movies & TV",
    categorySlug: "movies-tv",
    plays: 45123,
    questionsCount: 10,
    type: "personality",
    trending: false,
    createdAt: "2026-02-20",
  },
  {
    id: "8",
    title: "Which Country Matches Your Personality?",
    description: "If you were a country, which one would you be?",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop",
    category: "Personality",
    categorySlug: "personality",
    plays: 31456,
    questionsCount: 12,
    type: "personality",
    trending: false,
    createdAt: "2026-02-18",
  },
  {
    id: "9",
    title: "How Well Do You Know Harry Potter?",
    description: "Only true Potterheads will score 10/10",
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=600&h=400&fit=crop",
    category: "Movies & TV",
    categorySlug: "movies-tv",
    plays: 58234,
    questionsCount: 10,
    type: "trivia",
    trending: false,
    createdAt: "2026-02-15",
  },
  {
    id: "10",
    title: "Which NBA Player Are You Like?",
    description: "LeBron, Curry, or Giannis? Find out now!",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop",
    category: "Sports",
    categorySlug: "sports",
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

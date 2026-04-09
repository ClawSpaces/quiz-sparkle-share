import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";

// Core pages (loaded immediately)
import Index from "./pages/Index";
import QuizPage from "./pages/QuizPage";
import PostPage from "./pages/PostPage";
import NotFound from "./pages/NotFound";

// Lazy-loaded pages (loaded on demand)
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const TrendingPage = lazy(() => import("./pages/TrendingPage"));
const ShoppingPage = lazy(() => import("./pages/ShoppingPage"));
const CelebrityPage = lazy(() => import("./pages/CelebrityPage"));
const BuzzChatPage = lazy(() => import("./pages/BuzzChatPage"));
const QuizzesPage = lazy(() => import("./pages/QuizzesPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AuthorPage = lazy(() => import("./pages/AuthorPage"));
const TopicHubPage = lazy(() => import("./pages/TopicHubPage"));

// Admin pages (lazy - rarely accessed)
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminPosts = lazy(() => import("./pages/admin/AdminPosts"));
const AdminPostForm = lazy(() => import("./pages/admin/AdminPostForm"));
const AdminQuizzes = lazy(() => import("./pages/admin/AdminQuizzes"));
const AdminQuizForm = lazy(() => import("./pages/admin/AdminQuizForm"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminBuzzChats = lazy(() => import("./pages/admin/AdminBuzzChats"));
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CookieConsent />
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/quiz/:idOrSlug" element={<QuizPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/celebrity" element={<CelebrityPage />} />
          <Route path="/buzzchat" element={<BuzzChatPage />} />
          <Route path="/article/:slug" element={<PostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/author/:slug" element={<AuthorPage />} />
          <Route path="/topic/:slug" element={<TopicHubPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="posts/:id" element={<AdminPostForm />} />
            <Route path="quizzes" element={<AdminQuizzes />} />
            <Route path="quizzes/:id" element={<AdminQuizForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="buzzchat" element={<AdminBuzzChats />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;

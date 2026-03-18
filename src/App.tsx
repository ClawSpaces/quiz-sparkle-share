import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import TrendingPage from "./pages/TrendingPage";
import ShoppingPage from "./pages/ShoppingPage";
import CelebrityPage from "./pages/CelebrityPage";
import BuzzChatPage from "./pages/BuzzChatPage";
import QuizzesPage from "./pages/QuizzesPage";
import QuizPage from "./pages/QuizPage";
import PostPage from "./pages/PostPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminPostForm from "./pages/admin/AdminPostForm";
import AdminQuizzes from "./pages/admin/AdminQuizzes";
import AdminQuizForm from "./pages/admin/AdminQuizForm";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminBuzzChats from "./pages/admin/AdminBuzzChats";
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
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import TrendingPage from "./pages/TrendingPage";
import ShoppingPage from "./pages/ShoppingPage";
import CelebrityPage from "./pages/CelebrityPage";
import BuzzChatPage from "./pages/BuzzChatPage";
import PostPage from "./pages/PostPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/celebrity" element={<CelebrityPage />} />
          <Route path="/buzzchat" element={<BuzzChatPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

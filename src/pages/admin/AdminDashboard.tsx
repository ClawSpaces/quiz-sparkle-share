import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, HelpCircle, FolderOpen, MessageCircle, Eye, Gamepad2 } from "lucide-react";

export default function AdminDashboard() {
  const { data: postCount } = useQuery({
    queryKey: ["admin-post-count"],
    queryFn: async () => {
      const { count } = await supabase.from("posts").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: quizCount } = useQuery({
    queryKey: ["admin-quiz-count"],
    queryFn: async () => {
      const { count } = await supabase.from("quizzes").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: categoryCount } = useQuery({
    queryKey: ["admin-category-count"],
    queryFn: async () => {
      const { count } = await supabase.from("categories").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: buzzChatCount } = useQuery({
    queryKey: ["admin-buzzchat-count"],
    queryFn: async () => {
      const { count } = await supabase.from("buzz_chats").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const stats = [
    { label: "Posts", value: postCount, icon: FileText, color: "text-blue-500" },
    { label: "Quizzes", value: quizCount, icon: HelpCircle, color: "text-green-500" },
    { label: "Categories", value: categoryCount, icon: FolderOpen, color: "text-orange-500" },
    { label: "FizzChats", value: buzzChatCount, icon: MessageCircle, color: "text-purple-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value ?? "—"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

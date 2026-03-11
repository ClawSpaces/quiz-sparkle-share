import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/types";

type QuizType = Database["public"]["Enums"]["quiz_type"];

interface QuestionForm {
  id?: string;
  text: string;
  image_url: string;
  sort_order: number;
  answers: AnswerForm[];
}

interface AnswerForm {
  id?: string;
  text: string;
  image_url: string;
  is_correct: boolean;
  result_id: string;
  sort_order: number;
}

interface ResultForm {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
}

export default function AdminQuizForm() {
  const { id } = useParams();
  const isEdit = id && id !== "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [quizType, setQuizType] = useState<QuizType>("personality");
  const [categoryId, setCategoryId] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [results, setResults] = useState<ResultForm[]>([]);

  const { data: categories } = useQuery({
    queryKey: ["admin-categories-list"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id, name").order("name");
      return data ?? [];
    },
  });

  const { data: quiz } = useQuery({
    queryKey: ["admin-quiz-full", id],
    enabled: !!isEdit,
    queryFn: async () => {
      const { data: quizData, error } = await supabase.from("quizzes").select("*").eq("id", id!).single();
      if (error) throw error;

      const { data: questionsData } = await supabase
        .from("questions")
        .select("*, answers(*)")
        .eq("quiz_id", id!)
        .order("sort_order");

      const { data: resultsData } = await supabase
        .from("results")
        .select("*")
        .eq("quiz_id", id!)
        .order("sort_order");

      return { ...quizData, questions: questionsData ?? [], results: resultsData ?? [] };
    },
  });

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title);
      setDescription(quiz.description ?? "");
      setImageUrl(quiz.image_url ?? "");
      setQuizType(quiz.type);
      setCategoryId(quiz.category_id ?? "");
      setIsPublished(quiz.is_published);
      setIsTrending(quiz.is_trending);
      setResults(
        quiz.results.map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description ?? "",
          image_url: r.image_url ?? "",
          sort_order: r.sort_order ?? 0,
        }))
      );
      setQuestions(
        quiz.questions.map((q: any) => ({
          id: q.id,
          text: q.text,
          image_url: q.image_url ?? "",
          sort_order: q.sort_order,
          answers: (q.answers ?? [])
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((a: any) => ({
              id: a.id,
              text: a.text,
              image_url: a.image_url ?? "",
              is_correct: a.is_correct ?? false,
              result_id: a.result_id ?? "",
              sort_order: a.sort_order,
            })),
        }))
      );
    }
  }, [quiz]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      let quizId = id;

      const quizPayload = {
        title,
        description: description || null,
        image_url: imageUrl || null,
        type: quizType,
        category_id: categoryId || null,
        is_published: isPublished,
        is_trending: isTrending,
      };

      if (isEdit) {
        const { error } = await supabase.from("quizzes").update(quizPayload).eq("id", id!);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("quizzes").insert(quizPayload).select("id").single();
        if (error) throw error;
        quizId = data.id;
      }

      // Save results
      if (isEdit) {
        await supabase.from("results").delete().eq("quiz_id", quizId!);
      }
      const resultMap = new Map<string, string>();
      for (const r of results) {
        const { data, error } = await supabase
          .from("results")
          .insert({ quiz_id: quizId!, title: r.title, description: r.description || null, image_url: r.image_url || null, sort_order: r.sort_order })
          .select("id")
          .single();
        if (error) throw error;
        if (r.id) resultMap.set(r.id, data.id);
        else resultMap.set(`temp-${r.sort_order}`, data.id);
      }

      // Save questions & answers
      if (isEdit) {
        const { data: existingQs } = await supabase.from("questions").select("id").eq("quiz_id", quizId!);
        for (const q of existingQs ?? []) {
          await supabase.from("answers").delete().eq("question_id", q.id);
        }
        await supabase.from("questions").delete().eq("quiz_id", quizId!);
      }

      for (const q of questions) {
        const { data: qData, error: qError } = await supabase
          .from("questions")
          .insert({ quiz_id: quizId!, text: q.text, image_url: q.image_url || null, sort_order: q.sort_order })
          .select("id")
          .single();
        if (qError) throw qError;

        for (const a of q.answers) {
          const mappedResultId = a.result_id ? (resultMap.get(a.result_id) || null) : null;
          const { error: aError } = await supabase.from("answers").insert({
            question_id: qData.id,
            text: a.text,
            image_url: a.image_url || null,
            is_correct: a.is_correct,
            result_id: mappedResultId,
            sort_order: a.sort_order,
          });
          if (aError) throw aError;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-quizzes"] });
      toast({ title: isEdit ? "Updated" : "Created" });
      navigate("/admin/quizzes");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const addResult = () => {
    setResults([...results, { title: "", description: "", image_url: "", sort_order: results.length }]);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", image_url: "", sort_order: questions.length, answers: [] }]);
  };

  const addAnswer = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].answers.push({ text: "", image_url: "", is_correct: false, result_id: "", sort_order: updated[qIndex].answers.length });
    setQuestions(updated);
  };

  return (
    <div className="max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin/quizzes")}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Quiz" : "New Quiz"}</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Basic Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={quizType} onValueChange={(v) => setQuizType(v as QuizType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personality">Personality</SelectItem>
                    <SelectItem value="trivia">Trivia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                <Label>Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isTrending} onCheckedChange={setIsTrending} />
                <Label>Trending</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Results</CardTitle>
            <Button size="sm" variant="outline" onClick={addResult}>
              <Plus className="h-4 w-4 mr-1" /> Result
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Input placeholder="Result title" value={r.title} onChange={(e) => {
                    const u = [...results]; u[i].title = e.target.value; setResults(u);
                  }} />
                  <Input placeholder="Description" value={r.description} onChange={(e) => {
                    const u = [...results]; u[i].description = e.target.value; setResults(u);
                  }} />
                </div>
                <Button variant="ghost" size="icon" onClick={() => setResults(results.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Questions</CardTitle>
            <Button size="sm" variant="outline" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-1" /> Question
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q, qi) => (
              <Card key={qi} className="bg-muted/50">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Input placeholder={`Question ${qi + 1}`} value={q.text} onChange={(e) => {
                        const u = [...questions]; u[qi].text = e.target.value; setQuestions(u);
                      }} />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setQuestions(questions.filter((_, j) => j !== qi))}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="pl-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-muted-foreground">Answers</Label>
                      <Button size="sm" variant="ghost" onClick={() => addAnswer(qi)}>
                        <Plus className="h-3 w-3 mr-1" /> Answer
                      </Button>
                    </div>
                    {q.answers.map((a, ai) => (
                      <div key={ai} className="flex gap-2 items-center">
                        <Input className="flex-1" placeholder={`Answer ${ai + 1}`} value={a.text} onChange={(e) => {
                          const u = [...questions]; u[qi].answers[ai].text = e.target.value; setQuestions(u);
                        }} />
                        {quizType === "trivia" ? (
                          <div className="flex items-center gap-1">
                            <Switch checked={a.is_correct} onCheckedChange={(v) => {
                              const u = [...questions]; u[qi].answers[ai].is_correct = v; setQuestions(u);
                            }} />
                            <span className="text-xs text-muted-foreground">Correct</span>
                          </div>
                        ) : (
                          <Select value={a.result_id} onValueChange={(v) => {
                            const u = [...questions]; u[qi].answers[ai].result_id = v; setQuestions(u);
                          }}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="Result" /></SelectTrigger>
                            <SelectContent>
                              {results.map((r, ri) => (
                                <SelectItem key={ri} value={r.id || `temp-${ri}`}>{r.title || `Result ${ri + 1}`}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => {
                          const u = [...questions]; u[qi].answers = u[qi].answers.filter((_, j) => j !== ai); setQuestions(u);
                        }}>
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Button onClick={() => saveMutation.mutate()} disabled={!title || saveMutation.isPending} className="w-full">
          {saveMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}

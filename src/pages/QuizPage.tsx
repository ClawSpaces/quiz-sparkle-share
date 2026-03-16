import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContentSidebar from "@/components/ContentSidebar";
import AdSlot from "@/components/AdSlot";
import ReadyForMore from "@/components/ReadyForMore";
import MoreFromSite from "@/components/MoreFromSite";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Share2, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import CommentsSection from "@/components/CommentsSection";
import { format } from "date-fns";

interface QuizData {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  instructions: string | null;
  type: "personality" | "trivia";
  plays_count: number;
  category_id: string | null;
  created_at: string;
  categories: { name: string; slug: string } | null;
  profiles: { name: string; title: string | null; avatar_url: string | null } | null;
}

interface Question {
  id: string;
  text: string;
  image_url: string | null;
  sort_order: number;
  answers: Answer[];
}

interface Answer {
  id: string;
  text: string;
  image_url: string | null;
  is_correct: boolean | null;
  result_id: string | null;
  sort_order: number;
}

interface Result {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showTrivia, setShowTrivia] = useState<Record<string, boolean>>({});
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalResult, setFinalResult] = useState<Result | null>(null);
  const [playsIncremented, setPlaysIncremented] = useState(false);

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchQuiz = async () => {
      const [quizRes, questionsRes, resultsRes] = await Promise.all([
        supabase.from("quizzes").select("*, categories(name, slug), profiles(name, title, avatar_url)").eq("id", id).single(),
        supabase.from("questions").select("*, answers(*)").eq("quiz_id", id).order("sort_order"),
        supabase.from("results").select("*").eq("quiz_id", id).order("sort_order"),
      ]);

      if (quizRes.data) setQuiz(quizRes.data as any);
      if (questionsRes.data) {
        const qs = (questionsRes.data as any[]).map((q) => ({
          ...q,
          answers: q.answers.sort((a: Answer, b: Answer) => a.sort_order - b.sort_order),
        }));
        setQuestions(qs);
      }
      if (resultsRes.data) setResults(resultsRes.data);
      setLoading(false);
    };
    fetchQuiz();
  }, [id]);

  const answeredCount = Object.keys(answers).length;

  const handleAnswer = useCallback((question: Question, answer: Answer) => {
    if (answers[question.id]) return;

    if (!playsIncremented) {
      supabase.rpc("increment_plays", { quiz_id_param: id! });
      setPlaysIncremented(true);
    }

    const newAnswers = { ...answers, [question.id]: answer.id };
    setAnswers(newAnswers);

    if (quiz?.type === "trivia") {
      if (answer.is_correct) setScore((s) => s + 1);
      setShowTrivia((prev) => ({ ...prev, [question.id]: true }));
    }

    const totalAnswered = Object.keys(newAnswers).length;

    if (totalAnswered < questions.length) {
      const nextQ = questions.find((q) => !newAnswers[q.id]);
      if (nextQ) {
        setTimeout(() => {
          questionRefs.current[nextQ.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, quiz?.type === "trivia" ? 800 : 400);
      }
    } else {
      setTimeout(() => computeResult(newAnswers, answer), quiz?.type === "trivia" ? 800 : 400);
    }
  }, [answers, questions, quiz, id, playsIncremented]);

  const computeResult = (allAnswers: Record<string, string>, lastAnswer: Answer) => {
    let resultId: string | null = null;
    let finalScore = score;

    if (quiz?.type === "trivia") {
      finalScore = score + (lastAnswer.is_correct ? 1 : 0);
      setScore(finalScore);
      const pct = finalScore / questions.length;
      if (pct >= 0.9) setFinalResult(results[0] || null);
      else if (pct >= 0.5) setFinalResult(results[1] || null);
      else setFinalResult(results[2] || results[results.length - 1] || null);
    } else {
      const tally: Record<string, number> = {};
      questions.forEach((q) => {
        const selectedId = allAnswers[q.id];
        const ans = q.answers.find((a) => a.id === selectedId);
        if (ans?.result_id) {
          tally[ans.result_id] = (tally[ans.result_id] || 0) + 1;
        }
      });
      let maxCount = 0;
      for (const [rid, count] of Object.entries(tally)) {
        if (count > maxCount) { maxCount = count; resultId = rid; }
      }
      const found = results.find((r) => r.id === resultId);
      setFinalResult(found || results[0] || null);
    }

    supabase.from("quiz_attempts").insert({
      quiz_id: id!,
      score: quiz?.type === "trivia" ? finalScore : null,
      result_id: resultId,
    });

    setFinished(true);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const resetQuiz = () => {
    setAnswers({});
    setShowTrivia({});
    setScore(0);
    setFinished(false);
    setFinalResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = () => {
    const text = quiz?.type === "personality"
      ? `I got "${finalResult?.title}" on the quiz "${quiz.title}"! Try it yourself!`
      : `I scored ${score}/${questions.length} on the quiz "${quiz?.title}"! Try it yourself!`;
    if (navigator.share) {
      navigator.share({ title: quiz?.title || "Quiz", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-lg text-muted-foreground">Quiz not found.</p>
          <Link to="/quizzes"><Button>Back to Quizzes</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const hasImageAnswers = questions.some((q) => q.answers.some((a) => a.image_url));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container py-6 md:py-10 md:flex md:gap-8">
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="default" className="uppercase text-[10px] tracking-wider">Quiz</Badge>
                {quiz.categories && (
                  <Link to={`/category/${quiz.categories.slug}`}>
                    <Badge variant="secondary" className="uppercase text-[10px] tracking-wider">
                      {quiz.categories.name}
                    </Badge>
                  </Link>
                )}
                {quiz.type === "trivia" && (
                  <Badge variant="outline" className="uppercase text-[10px] tracking-wider">Trivia</Badge>
                )}
              </div>

              <h1 className="font-display text-2xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl">
                {quiz.title}
              </h1>

              {quiz.description && (
                <p className="mt-3 text-base text-muted-foreground md:text-lg leading-relaxed">
                  {quiz.description}
                </p>
              )}

              <div className="mt-4 flex items-center gap-3">
                {quiz.profiles && (
                  <>
                    <div className="h-9 w-9 overflow-hidden rounded-full bg-muted">
                      {quiz.profiles.avatar_url ? (
                        <img src={quiz.profiles.avatar_url} alt={quiz.profiles.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
                          {quiz.profiles.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">{quiz.profiles.name}</span>
                      {quiz.profiles.title && (
                        <span className="text-muted-foreground">, {quiz.profiles.title}</span>
                      )}
                    </div>
                    <span className="text-muted-foreground">·</span>
                  </>
                )}
                <span className="text-sm text-muted-foreground">
                  {format(new Date(quiz.created_at), "d MMM yyyy")}
                </span>
              </div>

              <ShareButtons
                text={quiz.title}
                imageUrl={quiz.image_url || undefined}
                className="mt-4"
              />

              {quiz.image_url && (
                <div className="mt-6 overflow-hidden rounded-xl">
                  <img src={quiz.image_url} alt={quiz.title} className="w-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                </div>
              )}

              {quiz.instructions && (
                <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
                  <p className="text-sm font-medium text-foreground">{quiz.instructions}</p>
                </div>
              )}
            </div>

            <AdSlot format="leaderboard" ezoicId={107} className="mb-8" />

            <div className="space-y-8">
              {questions.map((q, qIdx) => {
                const isAnswered = !!answers[q.id];
                const selectedId = answers[q.id];
                const hasImages = q.answers.some((a) => a.image_url);
                const isTriviaFeedback = isAnswered && quiz.type === "trivia" && showTrivia[q.id];

                return (
                  <div key={q.id}>
                    <div
                      ref={(el) => { questionRefs.current[q.id] = el; }}
                      className={`rounded-xl border border-border bg-card p-5 md:p-6 transition-opacity ${isAnswered ? "opacity-80" : ""}`}
                    >
                      <div className="mb-4 flex items-start gap-3">
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {qIdx + 1}
                        </span>
                        <h2 className="font-display text-lg font-bold text-foreground md:text-xl">
                          {q.text}
                        </h2>
                      </div>

                      {q.image_url && (
                        <div className="mb-4 overflow-hidden rounded-lg">
                          <img src={q.image_url} alt="" className="w-full object-cover max-h-80" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                        </div>
                      )}

                      {hasImages ? (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                          {q.answers.map((ans) => {
                            const isSelected = selectedId === ans.id;
                            const isCorrect = ans.is_correct;

                            let borderClass = "border-border hover:border-primary";
                            if (isAnswered) {
                              if (isTriviaFeedback) {
                                if (isCorrect) borderClass = "border-green-500 ring-2 ring-green-500/30";
                                else if (isSelected && !isCorrect) borderClass = "border-destructive ring-2 ring-destructive/30";
                                else borderClass = "border-border";
                              } else if (isSelected) {
                                borderClass = "border-primary ring-2 ring-primary/30";
                              } else {
                                borderClass = "border-border";
                              }
                            }

                            return (
                              <button
                                key={ans.id}
                                onClick={() => handleAnswer(q, ans)}
                                disabled={isAnswered}
                                className={`group overflow-hidden rounded-xl border-2 bg-card transition-all ${borderClass} ${isAnswered && !isSelected && !isCorrect ? "opacity-50" : ""}`}
                              >
                                {ans.image_url && (
                                  <div className="aspect-square overflow-hidden">
                                    <img src={ans.image_url} alt={ans.text} className="h-full w-full object-cover transition-transform group-hover:scale-105" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                                  </div>
                                )}
                                <div className="flex items-center justify-between p-2.5">
                                  <span className="text-xs font-semibold text-foreground md:text-sm">{ans.text}</span>
                                  {isTriviaFeedback && isCorrect && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-600" />}
                                  {isTriviaFeedback && isSelected && !isCorrect && <XCircle className="h-4 w-4 flex-shrink-0 text-destructive" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid gap-2.5">
                          {q.answers.map((ans) => {
                            const isSelected = selectedId === ans.id;
                            const isCorrect = ans.is_correct;

                            let cls = "w-full rounded-xl border-2 border-border bg-card p-3.5 text-left text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 md:text-base";

                            if (isAnswered) {
                              if (isTriviaFeedback) {
                                if (isCorrect) cls = "w-full rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-950 p-3.5 text-left text-sm font-medium md:text-base";
                                else if (isSelected) cls = "w-full rounded-xl border-2 border-destructive bg-destructive/10 p-3.5 text-left text-sm font-medium md:text-base";
                                else cls = "w-full rounded-xl border-2 border-border bg-card p-3.5 text-left text-sm font-medium opacity-50 md:text-base";
                              } else if (isSelected) {
                                cls = "w-full rounded-xl border-2 border-primary bg-primary/10 p-3.5 text-left text-sm font-medium md:text-base";
                              } else {
                                cls = "w-full rounded-xl border-2 border-border bg-card p-3.5 text-left text-sm font-medium opacity-50 md:text-base";
                              }
                            }

                            return (
                              <button key={ans.id} onClick={() => handleAnswer(q, ans)} disabled={isAnswered} className={cls}>
                                <div className="flex items-center gap-3">
                                  <span className="flex-1">{ans.text}</span>
                                  {isTriviaFeedback && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                  {isTriviaFeedback && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {qIdx < questions.length - 1 && (
                  <AdSlot format="rectangle" ezoicId={108} className="mt-8" />
                    )}
                  </div>
                );
              })}
            </div>

            {!finished && answeredCount > 0 && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {answeredCount}/{questions.length} questions answered
              </div>
            )}

            {finished && finalResult && (
              <div ref={resultRef} className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div
                  className="relative overflow-hidden rounded-2xl p-6 md:p-10"
                  style={{
                    background: `
                      repeating-conic-gradient(
                        hsl(var(--primary)) 0deg 10deg,
                        hsl(var(--primary) / 0.7) 10deg 20deg
                      ),
                      hsl(var(--primary))
                    `,
                  }}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary-foreground/80" />
                    <span
                      className="text-xs font-black tracking-[0.3em] text-primary-foreground/80 uppercase"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                      Quiz Result
                    </span>
                    <Sparkles className="h-4 w-4 text-primary-foreground/80" />
                  </div>

                  <div className="relative mx-auto max-w-lg rounded-xl bg-card p-6 shadow-xl md:ml-12">
                    {quiz.type === "trivia" ? (
                      <>
                        <div className="mb-3 text-6xl font-black text-primary">{score}/{questions.length}</div>
                        <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{finalResult.title}</h2>
                        {finalResult.description && <p className="mt-3 text-muted-foreground">{finalResult.description}</p>}
                      </>
                    ) : (
                      <>
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Your result:</p>
                        <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{finalResult.title}</h2>
                        {finalResult.image_url && (
                          <div className="mt-4 overflow-hidden rounded-lg">
                            <img src={finalResult.image_url} alt={finalResult.title} className="w-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
                          </div>
                        )}
                        {finalResult.description && <p className="mt-4 text-muted-foreground leading-relaxed">{finalResult.description}</p>}
                      </>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Share</span>
                      <ShareButtons
                        text={
                          quiz.type === "personality"
                            ? `I got "${finalResult.title}" on the quiz "${quiz.title}"! Try it yourself!`
                            : `I scored ${score}/${questions.length} on the quiz "${quiz.title}"! Try it yourself!`
                        }
                        imageUrl={finalResult.image_url || quiz.image_url || undefined}
                      />
                    </div>
                  </div>

                  <div className="absolute -bottom-2 -right-2 md:bottom-4 md:right-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg rotate-12">
                    <span className="text-[10px] font-black uppercase leading-tight text-center">Share<br />with<br />friends!</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button onClick={resetQuiz} variant="outline" className="gap-2">
                    <RotateCcw className="h-4 w-4" /> Try Again
                  </Button>
                  <Button onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            )}

            <CommentsSection contentType="quiz" contentId={id!} />

            <div className="mt-12 space-y-10">
              <ReadyForMore currentId={id!} type="quiz" categoryId={quiz.category_id} />
              <MoreFromSite currentId={id!} currentType="quiz" />
            </div>
          </div>

          <ContentSidebar />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;

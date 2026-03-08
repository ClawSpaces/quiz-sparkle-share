import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, Share2, CheckCircle2, XCircle } from "lucide-react";

interface QuizData {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  type: "personality" | "trivia";
  plays_count: number;
  categories: { name: string; slug: string } | null;
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

type Phase = "intro" | "playing" | "result";

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [resultTally, setResultTally] = useState<Record<string, number>>({});
  const [finalResult, setFinalResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchQuiz = async () => {
      const [quizRes, questionsRes, resultsRes] = await Promise.all([
        supabase.from("quizzes").select("*, categories(name, slug)").eq("id", id).single(),
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

  const startQuiz = () => {
    setPhase("playing");
    setCurrentQ(0);
    setScore(0);
    setResultTally({});
    setSelectedAnswer(null);
    setShowFeedback(false);
    supabase.rpc("increment_plays", { quiz_id_param: id! });
  };

  const handleAnswer = (answer: Answer) => {
    if (showFeedback) return;
    setSelectedAnswer(answer.id);

    if (quiz?.type === "trivia") {
      if (answer.is_correct) setScore((s) => s + 1);
      setShowFeedback(true);
      setTimeout(() => advanceOrFinish(answer), 1200);
    } else {
      // personality — tally result_id
      if (answer.result_id) {
        setResultTally((prev) => ({
          ...prev,
          [answer.result_id!]: (prev[answer.result_id!] || 0) + 1,
        }));
      }
      setTimeout(() => advanceOrFinish(answer), 600);
    }
  };

  const advanceOrFinish = (lastAnswer: Answer) => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      finishQuiz(lastAnswer);
    }
  };

  const finishQuiz = (lastAnswer: Answer) => {
    let resultId: string | null = null;

    if (quiz?.type === "personality") {
      // include last answer in tally
      const finalTally = { ...resultTally };
      if (lastAnswer.result_id) {
        finalTally[lastAnswer.result_id] = (finalTally[lastAnswer.result_id] || 0) + 1;
      }
      // find most common result
      let maxCount = 0;
      for (const [rid, count] of Object.entries(finalTally)) {
        if (count > maxCount) {
          maxCount = count;
          resultId = rid;
        }
      }
      const found = results.find((r) => r.id === resultId);
      setFinalResult(found || results[0] || null);
    } else {
      // trivia — find matching score-based result
      const finalScore = score + (lastAnswer.is_correct ? 1 : 0);
      // Use score thresholds based on results count
      const total = questions.length;
      const pct = finalScore / total;
      if (pct >= 0.9) setFinalResult(results[0] || null);
      else if (pct >= 0.5) setFinalResult(results[1] || null);
      else setFinalResult(results[2] || results[results.length - 1] || null);
      setScore(finalScore);
      resultId = finalResult?.id ?? null;
    }

    // Save attempt
    supabase.from("quiz_attempts").insert({
      quiz_id: id!,
      score: quiz?.type === "trivia" ? score + (lastAnswer.is_correct ? 1 : 0) : null,
      result_id: resultId,
    });

    setPhase("result");
  };

  const handleShare = () => {
    const text = quiz?.type === "personality"
      ? `Πήρα "${finalResult?.title}" στο quiz "${quiz.title}"! Δοκίμασε κι εσύ!`
      : `Πήρα ${score}/${questions.length} στο quiz "${quiz?.title}"! Δοκίμασε κι εσύ!`;
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
          <p className="text-lg text-muted-foreground">Το quiz δεν βρέθηκε.</p>
          <Link to="/quizzes">
            <Button>Πίσω στα Quizzes</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // INTRO
  if (phase === "intro") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="relative">
            <div className="aspect-[21/9] overflow-hidden md:aspect-[3/1]">
              <img
                src={quiz.image_url || "/placeholder.svg"}
                alt={quiz.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              {quiz.categories && (
                <span className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase text-primary-foreground">
                  {quiz.categories.name}
                </span>
              )}
              <h1 className="font-display text-2xl font-black leading-tight text-primary-foreground md:text-4xl">
                {quiz.title}
              </h1>
              {quiz.description && (
                <p className="mt-2 max-w-xl text-sm text-primary-foreground/80 md:text-base">
                  {quiz.description}
                </p>
              )}
              <div className="mt-3 text-sm text-primary-foreground/70">
                {questions.length} ερωτήσεις · {quiz.type === "trivia" ? "Trivia" : "Personality"}
              </div>
            </div>
          </div>

          <div className="container py-8 text-center">
            <Button size="lg" onClick={startQuiz} className="gap-2 text-lg">
              Ξεκίνα το Quiz <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // PLAYING
  if (phase === "playing") {
    const q = questions[currentQ];
    const progress = ((currentQ) / questions.length) * 100;

    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <div className="container max-w-2xl py-6 md:py-10">
            {/* Progress */}
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Ερώτηση {currentQ + 1}/{questions.length}</span>
              <span>{quiz.title}</span>
            </div>
            <Progress value={progress} className="mb-8 h-2" />

            {/* Question */}
            {q.image_url && (
              <div className="mb-4 overflow-hidden rounded-xl">
                <img src={q.image_url} alt="" className="h-48 w-full object-cover md:h-64" />
              </div>
            )}
            <h2 className="mb-6 font-display text-xl font-bold text-foreground md:text-2xl">
              {q.text}
            </h2>

            {/* Answers */}
            <div className="grid gap-3">
              {q.answers.map((ans) => {
                let btnClass =
                  "w-full rounded-xl border-2 border-border bg-card p-4 text-left text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 md:text-base";

                if (selectedAnswer === ans.id) {
                  if (quiz.type === "trivia" && showFeedback) {
                    btnClass = ans.is_correct
                      ? "w-full rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-950 p-4 text-left text-sm font-medium md:text-base"
                      : "w-full rounded-xl border-2 border-destructive bg-destructive/10 p-4 text-left text-sm font-medium md:text-base";
                  } else {
                    btnClass =
                      "w-full rounded-xl border-2 border-primary bg-primary/10 p-4 text-left text-sm font-medium md:text-base";
                  }
                } else if (showFeedback && quiz.type === "trivia" && ans.is_correct) {
                  btnClass =
                    "w-full rounded-xl border-2 border-green-500 bg-green-50 dark:bg-green-950 p-4 text-left text-sm font-medium md:text-base";
                }

                return (
                  <button
                    key={ans.id}
                    onClick={() => handleAnswer(ans)}
                    disabled={showFeedback || (quiz.type === "personality" && !!selectedAnswer)}
                    className={btnClass}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-1">{ans.text}</span>
                      {showFeedback && quiz.type === "trivia" && ans.is_correct && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                      {showFeedback && quiz.type === "trivia" && selectedAnswer === ans.id && !ans.is_correct && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // RESULT
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container max-w-2xl py-8 md:py-12">
          <div className="rounded-2xl bg-card p-6 shadow-lg md:p-10 text-center">
            {quiz.type === "trivia" ? (
              <>
                <div className="mb-4 text-6xl font-black text-primary">
                  {score}/{questions.length}
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  {finalResult?.title || "Αποτέλεσμα"}
                </h2>
                {finalResult?.description && (
                  <p className="mt-3 text-muted-foreground">{finalResult.description}</p>
                )}
              </>
            ) : (
              <>
                {finalResult?.image_url && (
                  <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full">
                    <img src={finalResult.image_url} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
                <p className="mb-1 text-sm text-muted-foreground">Το αποτέλεσμά σου:</p>
                <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                  {finalResult?.title || "Δεν βρέθηκε αποτέλεσμα"}
                </h2>
                {finalResult?.description && (
                  <p className="mt-3 text-muted-foreground">{finalResult.description}</p>
                )}
              </>
            )}

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button onClick={startQuiz} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" /> Δοκίμασε ξανά
              </Button>
              <Button onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" /> Μοιράσου το
              </Button>
            </div>

            <div className="mt-6">
              <Link to="/quizzes" className="text-sm font-medium text-primary hover:underline">
                ← Πίσω στα Quizzes
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CATEGORY_IDS: Record<string, string> = {
  prosopikotita: "bdd4f991-5183-4f7a-96ea-0fe2c34bfc01",
  diasimotites: "be22ca94-6583-4ded-9a13-0f8f3dafc224",
  tainies: "f8b86b33-ebcd-4c5a-b8d8-affb650a1eec",
  athlitika: "502d0599-dc01-44bd-a65c-e444240dc752",
  mousiki: "2e760a3d-00df-4d22-ad10-93b033ad8dc0",
  genikes: "89ec286a-38ce-4ff6-b973-5a25dec23fb1",
};

const AUTHOR_ID = "8c272f0d-9852-48c0-ae62-b422d49f8d30";

// Batch definitions: each batch has a category + quiz themes
const BATCHES: Record<number, { category: string; type: "personality" | "trivia"; themes: string[] }> = {
  1: {
    category: "prosopikotita",
    type: "personality",
    themes: [
      "Ποιο ανοιξιάτικο λουλούδι είσαι; (Επέλεξε εικόνες με γλυκά, τοπία, ρούχα)",
      "Τι χρώμα αντιπροσωπεύει την ψυχή σου; (Επέλεξε αποχρώσεις, αισθητικές, outfits)",
      "Ποιο ελληνικό νησί σου ταιριάζει; (Φαγητά, δραστηριότητες, τοπία)",
      "Σχεδίασε το ιδανικό σπίτι σου και θα σου πω την aura σου (Δωμάτια, έπιπλα, χρώματα)",
      "Τι είδους φίλος/η είσαι; (Σενάρια, αντιδράσεις, επιλογές)",
    ],
  },
  2: {
    category: "prosopikotita",
    type: "personality",
    themes: [
      "Διάλεξε ανοιξιάτικα γλυκά και θα σου πω τι πεταλούδα είσαι",
      "Φτιάξε την τέλεια ανοιξιάτικη μέρα και θα μάθεις τι τύπος ενέργειας έχεις",
      "Ποιο ζώο σε εκφράζει; (Επέλεξε φαγητά, χόμπι, μουσική)",
      "Ποιος Disney χαρακτήρας είσαι; (Σενάρια και αντιδράσεις)",
      "Τι dessert ταιριάζει στην προσωπικότητά σου;",
    ],
  },
  3: {
    category: "diasimotites",
    type: "personality",
    themes: [
      "Ποιος Έλληνας διάσημος σου μοιάζει; (Στυλ, μουσική, φαγητό)",
      "Θα επιβίωνες μια μέρα ως celebrity; (Σενάρια, πίεση, ρούχα)",
      "Ποιο celebrity couple σου ταιριάζει; (Ρομαντικές επιλογές)",
      "Αναγνώρισε τον Έλληνα celebrity από την περιγραφή",
      "Ποιος pop star θα ήταν ο κολλητός σου;",
    ],
  },
  4: {
    category: "tainies",
    type: "personality",
    themes: [
      "Ποιος χαρακτήρας Stranger Things είσαι; (Σενάρια, αντιδράσεις)",
      "Συμπλήρωσε τους στίχους Disney τραγουδιών (ελληνικά)",
      "Ποιος χαρακτήρας Friends είσαι; (Επιλογές και σενάρια)",
      "Netflix Μαρτίου 2026: Πόσο καλά ξέρεις τις νέες σειρές;",
      "Ποια ταινία του 2026 πρέπει να δεις πρώτα;",
    ],
  },
  5: {
    category: "athlitika",
    type: "trivia",
    themes: [
      "Champions League 2025-26: Πόσο καλά τα ξέρεις;",
      "Ολυμπιακοί Αγώνες: Trivia από όλες τις εποχές",
      "Formula 1 2026: Νέοι κανονισμοί και ομάδες",
      "Ελληνικό ποδόσφαιρο: Πόσο superfan είσαι;",
      "NBA 2025-26 season trivia",
    ],
  },
  6: {
    category: "mousiki",
    type: "trivia",
    themes: [
      "Eurovision 2026: Πόσο καλά ξέρεις τους υποψήφιους;",
      "90s Greek hits: Συμπλήρωσε τον στίχο",
      "K-pop quiz: Πόσο ARMY/BLINK είσαι;",
      "Αναγνώρισε το τραγούδι από ένα emoji sequence",
      "2026 Top Hits: Ποιος τραγουδάει αυτόν τον στίχο;",
    ],
  },
  7: {
    category: "genikes",
    type: "trivia",
    themes: [
      "St. Patrick's Day trivia: Πόσα ξέρεις για την Ιρλανδία;",
      "Παγκόσμια γεωγραφία: Αναγνώρισε τη χώρα από τον χάρτη",
      "Ιστορία της Ελλάδας: Μόνο 10% βγάζει 10/10",
      "Spring Equinox: Επιστημονικά facts για την Άνοιξη",
      "Φαγητά του κόσμου: Από ποια χώρα είναι;",
    ],
  },
  8: {
    category: "genikes",
    type: "trivia",
    themes: [
      "Ελληνική μυθολογία: Πόσο καλά την ξέρεις;",
      "Viral trends 2026: Τι θυμάσαι;",
      "Τεχνολογία 2026: AI, gadgets και νέα trends",
      "Ζώα και φύση: Αληθινά ή ψεύτικα facts;",
      "Πρωτεύουσες του κόσμου: Μόνο genius βρίσκει 10/10",
    ],
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { batch, theme_index } = await req.json();
    const batchConfig = BATCHES[batch];
    if (!batchConfig) {
      return new Response(JSON.stringify({ error: "Invalid batch (1-8)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // If theme_index specified, only generate that one quiz from the batch
    const themes = theme_index != null 
      ? [batchConfig.themes[theme_index]].filter(Boolean)
      : batchConfig.themes;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const categoryId = CATEGORY_IDS[batchConfig.category];
    const quizType = batchConfig.type;

    const createdQuizIds: string[] = [];

    // Generate each quiz one by one to avoid timeout
    for (const theme of themes) {
      const isPersonality = quizType === "personality";

      const systemPrompt = `You are a BuzzFeed-style quiz content creator writing in GREEK (ελληνικά). 
You create fun, engaging, viral quizzes. Current date: March 9, 2026.
All text MUST be in Greek. Quiz titles should be catchy and clickable.
For image_url fields, use real Unsplash URLs in format: https://images.unsplash.com/photo-{ID}?w=600&h=400&fit=crop
Use diverse, relevant photo IDs for each answer/question.`;

      const userPrompt = `Create a ${isPersonality ? "personality" : "trivia"} quiz about: "${theme}"

Requirements:
- Title: catchy, in Greek
- Description: 1-2 sentences in Greek
- ${isPersonality ? "4 personality results with title, description, and image_url" : "No results needed for trivia"}
- 8 questions, each with 6 answer options
- ${isPersonality ? "Each answer must link to a result (result_index 0-3)" : "Each answer must have is_correct true/false (exactly 1 correct per question)"}
- Every answer should have an image_url from Unsplash
- Questions should have image_url too when relevant
- Make it fun, engaging, BuzzFeed-style!`;

      const toolDef = {
        type: "function" as const,
        function: {
          name: "create_quiz",
          description: "Create a complete quiz with questions and answers",
          parameters: {
            type: "object",
            properties: {
              title: { type: "string", description: "Quiz title in Greek" },
              description: { type: "string", description: "Quiz description in Greek" },
              image_url: { type: "string", description: "Main quiz image from Unsplash" },
              instructions: { type: "string", description: "Short instructions in Greek" },
              results: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    image_url: { type: "string" },
                  },
                  required: ["title", "description"],
                },
              },
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    text: { type: "string" },
                    image_url: { type: "string" },
                    answers: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          text: { type: "string" },
                          image_url: { type: "string" },
                          is_correct: { type: "boolean" },
                          result_index: { type: "integer" },
                        },
                        required: ["text"],
                      },
                    },
                  },
                  required: ["text", "answers"],
                },
              },
            },
            required: ["title", "description", "questions"],
          },
        },
      };

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [toolDef],
          tool_choice: { type: "function", function: { name: "create_quiz" } },
        }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error(`AI error for "${theme}":`, aiResponse.status, errText);
        continue; // skip this quiz, try next
      }

      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) {
        console.error(`No tool call for "${theme}"`);
        continue;
      }

      let quizData: any;
      try {
        quizData = JSON.parse(toolCall.function.arguments);
      } catch {
        console.error(`Invalid JSON for "${theme}"`);
        continue;
      }

      // Insert quiz
      const { data: quiz, error: quizErr } = await supabase
        .from("quizzes")
        .insert({
          title: quizData.title,
          description: quizData.description,
          image_url: quizData.image_url || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop`,
          instructions: quizData.instructions || null,
          type: quizType,
          category_id: categoryId,
          author_id: AUTHOR_ID,
          is_published: true,
          is_trending: false,
        })
        .select("id")
        .single();

      if (quizErr) {
        console.error(`Quiz insert error:`, quizErr);
        continue;
      }

      // Insert results (personality only)
      const resultIds: string[] = [];
      if (isPersonality && quizData.results?.length) {
        for (let ri = 0; ri < quizData.results.length; ri++) {
          const r = quizData.results[ri];
          const { data: result, error: resErr } = await supabase
            .from("results")
            .insert({
              quiz_id: quiz.id,
              title: r.title,
              description: r.description || "",
              image_url: r.image_url || null,
              sort_order: ri,
            })
            .select("id")
            .single();

          if (resErr) {
            console.error(`Result insert error:`, resErr);
          } else {
            resultIds.push(result.id);
          }
        }
      }

      // Insert questions and answers
      for (let qi = 0; qi < (quizData.questions || []).length; qi++) {
        const q = quizData.questions[qi];
        const { data: question, error: qErr } = await supabase
          .from("questions")
          .insert({
            quiz_id: quiz.id,
            text: q.text,
            image_url: q.image_url || null,
            sort_order: qi,
          })
          .select("id")
          .single();

        if (qErr) {
          console.error(`Question insert error:`, qErr);
          continue;
        }

        // Insert answers
        const answers = (q.answers || []).slice(0, 8); // max 8 answers
        for (let ai = 0; ai < answers.length; ai++) {
          const a = answers[ai];
          const answerData: any = {
            question_id: question.id,
            text: a.text,
            image_url: a.image_url || null,
            sort_order: ai,
          };

          if (isPersonality && resultIds.length > 0) {
            const rIdx = (a.result_index != null && a.result_index < resultIds.length)
              ? a.result_index
              : ai % resultIds.length;
            answerData.result_id = resultIds[rIdx];
            answerData.is_correct = false;
          } else {
            answerData.is_correct = a.is_correct === true;
          }

          const { error: aErr } = await supabase.from("answers").insert(answerData);
          if (aErr) console.error(`Answer insert error:`, aErr);
        }
      }

      createdQuizIds.push(quiz.id);
      console.log(`✅ Created quiz: ${quizData.title} (${quiz.id})`);
    }

    return new Response(
      JSON.stringify({ success: true, created: createdQuizIds.length, ids: createdQuizIds }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

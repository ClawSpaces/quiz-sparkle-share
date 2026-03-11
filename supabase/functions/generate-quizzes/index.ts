import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CATEGORY_IDS: Record<string, string> = {
  personality: "bdd4f991-5183-4f7a-96ea-0fe2c34bfc01",
  celebrities: "be22ca94-6583-4ded-9a13-0f8f3dafc224",
  movies: "f8b86b33-ebcd-4c5a-b8d8-affb650a1eec",
  sports: "502d0599-dc01-44bd-a65c-e444240dc752",
  music: "2e760a3d-00df-4d22-ad10-93b033ad8dc0",
  general: "89ec286a-38ce-4ff6-b973-5a25dec23fb1",
};

const AUTHOR_ID = "8c272f0d-9852-48c0-ae62-b422d49f8d30";

const BATCHES: Record<number, { category: string; type: "personality" | "trivia"; themes: string[] }> = {
  1: {
    category: "personality",
    type: "personality",
    themes: [
      "Which spring flower are you? (Pick sweets, landscapes, outfits)",
      "What color represents your soul? (Pick shades, aesthetics, outfits)",
      "Which Greek island suits you best? (Food, activities, landscapes)",
      "Design your dream home and we'll tell you your aura (Rooms, furniture, colors)",
      "What kind of friend are you? (Scenarios, reactions, choices)",
    ],
  },
  2: {
    category: "personality",
    type: "personality",
    themes: [
      "Pick spring desserts and we'll tell you what butterfly you are",
      "Build the perfect spring day and discover your energy type",
      "Which animal represents you? (Pick food, hobbies, music)",
      "Which Disney character are you? (Scenarios and reactions)",
      "What dessert matches your personality?",
    ],
  },
  3: {
    category: "celebrities",
    type: "personality",
    themes: [
      "Which celebrity do you resemble? (Style, music, food)",
      "Could you survive a day as a celebrity? (Scenarios, pressure, outfits)",
      "Which celebrity couple suits you? (Romantic choices)",
      "Guess the celebrity from the description",
      "Which pop star would be your BFF?",
    ],
  },
  4: {
    category: "movies",
    type: "personality",
    themes: [
      "Which Stranger Things character are you? (Scenarios, reactions)",
      "Complete the Disney song lyrics",
      "Which Friends character are you? (Choices and scenarios)",
      "Netflix March 2026: How well do you know the new shows?",
      "Which 2026 movie should you watch first?",
    ],
  },
  5: {
    category: "sports",
    type: "trivia",
    themes: [
      "Champions League 2025-26: How well do you know it?",
      "Olympics: Trivia from all eras",
      "Formula 1 2026: New regulations and teams",
      "Football trivia: How big of a superfan are you?",
      "NBA 2025-26 season trivia",
    ],
  },
  6: {
    category: "music",
    type: "trivia",
    themes: [
      "Eurovision 2026: How well do you know the contestants?",
      "90s pop hits: Complete the lyric",
      "K-pop quiz: How ARMY/BLINK are you?",
      "Guess the song from an emoji sequence",
      "2026 Top Hits: Who sings this lyric?",
    ],
  },
  7: {
    category: "general",
    type: "trivia",
    themes: [
      "St. Patrick's Day trivia: How much do you know about Ireland?",
      "World geography: Guess the country from the map",
      "Ancient history: Only 10% score 10/10",
      "Spring Equinox: Scientific facts about Spring",
      "World cuisine: Which country is this from?",
    ],
  },
  8: {
    category: "general",
    type: "trivia",
    themes: [
      "Greek mythology: How well do you know it?",
      "Viral trends 2026: What do you remember?",
      "Technology 2026: AI, gadgets and new trends",
      "Animals & nature: Real or fake facts?",
      "World capitals: Only a genius scores 10/10",
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

    for (const theme of themes) {
      const isPersonality = quizType === "personality";

      const systemPrompt = `You are a BuzzFeed-style quiz content creator writing in ENGLISH. 
You create fun, engaging, viral quizzes. Current date: March 11, 2026.
All text MUST be in English. Quiz titles should be catchy and clickable.
For image_url fields, use real Unsplash URLs in format: https://images.unsplash.com/photo-{ID}?w=600&h=400&fit=crop
Use diverse, relevant photo IDs for each answer/question.`;

      const userPrompt = `Create a ${isPersonality ? "personality" : "trivia"} quiz about: "${theme}"

Requirements:
- Title: catchy, in English
- Description: 1-2 sentences in English
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
              title: { type: "string", description: "Quiz title in English" },
              description: { type: "string", description: "Quiz description in English" },
              image_url: { type: "string", description: "Main quiz image from Unsplash" },
              instructions: { type: "string", description: "Short instructions in English" },
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
        continue;
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

        const answers = (q.answers || []).slice(0, 8);
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

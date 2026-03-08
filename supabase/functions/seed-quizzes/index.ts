import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // 1. Insert categories
  const categoriesData = [
    { name: "Προσωπικότητα", slug: "prosopikotita", description: "Ανακάλυψε ποιος είσαι πραγματικά", icon: "✨", color: "quiz-purple" },
    { name: "Διασημότητες", slug: "diasimotites", description: "Πόσο καλά ξέρεις τα αγαπημένα σου αστέρια;", icon: "⭐", color: "quiz-pink" },
    { name: "Ταινίες & Σειρές", slug: "tainies-seires", description: "Quiz για κινηματογράφο και τηλεόραση", icon: "🎬", color: "primary" },
    { name: "Αθλητικά", slug: "athlitika", description: "Δοκίμασε τις γνώσεις σου στον αθλητισμό", icon: "⚽", color: "quiz-green" },
    { name: "Μουσική", slug: "mousiki", description: "Από pop μέχρι rock, πόσο καλά τα πας;", icon: "🎵", color: "quiz-orange" },
    { name: "Γενικές Γνώσεις", slug: "genikes-gnoseis", description: "Τεστ ευφυΐας και γενικών γνώσεων", icon: "🧠", color: "quiz-teal" },
  ];

  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .upsert(categoriesData, { onConflict: "slug" })
    .select();

  if (catErr) return new Response(JSON.stringify({ error: catErr }), { status: 500, headers: corsHeaders });

  const catMap: Record<string, string> = {};
  for (const c of cats!) catMap[c.slug] = c.id;

  // 2. Insert quizzes
  const quizzesData = [
    { title: "Ποιος χαρακτήρας από τα Friends είσαι;", description: "Απάντησε σε 10 ερωτήσεις και μάθε αν είσαι ο Ross, η Rachel, ο Joey ή κάποιος άλλος!", image_url: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=400&fit=crop", category_id: catMap["tainies-seires"], plays_count: 34521, type: "personality", is_trending: true, is_published: true },
    { title: "Πόσο καλά ξέρεις τον Messi;", description: "10 ερωτήσεις για τον καλύτερο ποδοσφαιριστή όλων των εποχών", image_url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop", category_id: catMap["athlitika"], plays_count: 28943, type: "trivia", is_trending: true, is_published: true },
    { title: "Τι τύπος προσωπικότητας είσαι;", description: "Ανακάλυψε αν είσαι εσωστρεφής ή εξωστρεφής με αυτό το quiz!", image_url: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&h=400&fit=crop", category_id: catMap["prosopikotita"], plays_count: 52103, type: "personality", is_trending: true, is_published: true },
    { title: "Ποιος τραγουδιστής σου μοιάζει;", description: "Από Taylor Swift μέχρι Bad Bunny — ποιος σου ταιριάζει;", image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop", category_id: catMap["mousiki"], plays_count: 19832, type: "personality", is_trending: true, is_published: true },
    { title: "Μπορείς να αναγνωρίσεις τον διάσημο από παιδί;", description: "Σου δείχνουμε παιδικές φωτογραφίες — εσύ μαντεύεις!", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", category_id: catMap["diasimotites"], plays_count: 41205, type: "trivia", is_trending: true, is_published: true },
    { title: "Πόσο έξυπνος είσαι; Τεστ IQ", description: "20 ερωτήσεις που θα δοκιμάσουν τα όριά σου", image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop", category_id: catMap["genikes-gnoseis"], plays_count: 67890, type: "trivia", is_trending: false, is_published: true },
    { title: "Ποιος χαρακτήρας της Marvel είσαι;", description: "Iron Man, Spider-Man ή Captain America; Πάρε το quiz!", image_url: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=600&h=400&fit=crop", category_id: catMap["tainies-seires"], plays_count: 45123, type: "personality", is_trending: false, is_published: true },
    { title: "Ποια χώρα ταιριάζει στην προσωπικότητά σου;", description: "Αν ήσουν χώρα, ποια θα ήσουν;", image_url: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=400&fit=crop", category_id: catMap["prosopikotita"], plays_count: 31456, type: "personality", is_trending: false, is_published: true },
    { title: "Πόσο καλά ξέρεις τον Harry Potter;", description: "Μόνο αληθινοί Potterheads θα βγάλουν 10/10", image_url: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=600&h=400&fit=crop", category_id: catMap["tainies-seires"], plays_count: 58234, type: "trivia", is_trending: false, is_published: true },
    { title: "Ποιος παίκτης του NBA σου μοιάζει;", description: "LeBron, Curry ή Giannis; Μάθε τώρα!", image_url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop", category_id: catMap["athlitika"], plays_count: 22341, type: "personality", is_trending: false, is_published: true },
  ];

  const { data: quizzes, error: quizErr } = await supabase
    .from("quizzes")
    .insert(quizzesData)
    .select();

  if (quizErr) return new Response(JSON.stringify({ error: quizErr }), { status: 500, headers: corsHeaders });

  // Helper to build quiz content
  const allResults: any[] = [];
  const allQuestions: any[] = [];
  const pendingAnswers: { quizIndex: number; questionIndex: number; answers: any[] }[] = [];

  // Quiz 0: Friends (personality)
  const q0 = quizzes![0].id;
  allResults.push(
    { quiz_id: q0, title: "Ross Geller", description: "Είσαι ο εγκεφαλικός και κάπως αδέξιος Ross! Αγαπάς την επιστήμη και τους δεινόσαυρους.", sort_order: 0 },
    { quiz_id: q0, title: "Rachel Green", description: "Είσαι η κομψή και φιλόδοξη Rachel! Σου αρέσει η μόδα και οι νέες αρχές.", sort_order: 1 },
    { quiz_id: q0, title: "Joey Tribbiani", description: "Είσαι ο αγαπητός Joey! Food is life και η φιλία είναι τα πάντα.", sort_order: 2 },
    { quiz_id: q0, title: "Monica Geller", description: "Είσαι η τελειομανής Monica! Οργάνωση, μαγειρική και ανταγωνιστικότητα.", sort_order: 3 },
  );

  // Quiz 1: Messi (trivia)
  const q1 = quizzes![1].id;
  allResults.push(
    { quiz_id: q1, title: "10/10 — Expert!", description: "Ξέρεις τα πάντα για τον Messi!", sort_order: 0 },
    { quiz_id: q1, title: "7-9/10 — Πολύ καλά!", description: "Σχεδόν τέλειος! Μικρές λεπτομέρειες σου ξέφυγαν.", sort_order: 1 },
    { quiz_id: q1, title: "4-6/10 — Μέτρια", description: "Ξέρεις τα βασικά αλλά υπάρχουν κενά.", sort_order: 2 },
    { quiz_id: q1, title: "0-3/10 — Αρχάριος", description: "Ώρα να δεις περισσότερο ποδόσφαιρο!", sort_order: 3 },
  );

  // Quiz 2: Personality type (personality)
  const q2 = quizzes![2].id;
  allResults.push(
    { quiz_id: q2, title: "Εξωστρεφής", description: "Παίρνεις ενέργεια από τους ανθρώπους! Σου αρέσουν οι κοινωνικές εκδηλώσεις.", sort_order: 0 },
    { quiz_id: q2, title: "Εσωστρεφής", description: "Προτιμάς τη γαλήνη και τον προσωπικό χρόνο. Βαθιά σκέψη!", sort_order: 1 },
    { quiz_id: q2, title: "Αμφιστρεφής", description: "Κινείσαι ανάμεσα στα δύο! Ευέλικτος/η σε κάθε κατάσταση.", sort_order: 2 },
  );

  // Quiz 3: Singer (personality)
  const q3 = quizzes![3].id;
  allResults.push(
    { quiz_id: q3, title: "Taylor Swift", description: "Ρομαντικός/ή, αφηγηματικός/ή, με πάθος για λεπτομέρειες!", sort_order: 0 },
    { quiz_id: q3, title: "Bad Bunny", description: "Αυθεντικός/ή, τολμηρός/ή, πάντα στο δικό σου beat!", sort_order: 1 },
    { quiz_id: q3, title: "Adele", description: "Βαθιά συναισθηματικός/ή με δυνατή φωνή. Η ψυχή σου τραγουδάει.", sort_order: 2 },
  );

  // Quiz 4: Celebrity from childhood (trivia)
  const q4 = quizzes![4].id;
  allResults.push(
    { quiz_id: q4, title: "10/10 — Αψεγάδιαστος!", description: "Κανείς δεν σου ξεφεύγει!", sort_order: 0 },
    { quiz_id: q4, title: "5-9/10 — Καλό μάτι!", description: "Αναγνωρίζεις τους περισσότερους!", sort_order: 1 },
    { quiz_id: q4, title: "0-4/10 — Ανάγκη εξάσκησης", description: "Δεν πειράζει, δοκίμασε ξανά!", sort_order: 2 },
  );

  // Quiz 5: IQ Test (trivia)
  const q5 = quizzes![5].id;
  allResults.push(
    { quiz_id: q5, title: "Ιδιοφυΐα!", description: "Εντυπωσιακό! Σκέφτεσαι σαν Einstein.", sort_order: 0 },
    { quiz_id: q5, title: "Πάνω από τον μέσο όρο", description: "Πολύ καλές γνώσεις!", sort_order: 1 },
    { quiz_id: q5, title: "Μέσος όρος", description: "Δεν είναι κακό! Μπορείς να βελτιωθείς.", sort_order: 2 },
  );

  // Quiz 6: Marvel (personality)
  const q6 = quizzes![6].id;
  allResults.push(
    { quiz_id: q6, title: "Iron Man", description: "Ευφυής, χαρισματικός και λίγο εγωιστής. Λύνεις τα πάντα με τεχνολογία!", sort_order: 0 },
    { quiz_id: q6, title: "Spider-Man", description: "Νεανικός, αστείος και υπεύθυνος. Μεγάλη δύναμη = μεγάλη ευθύνη!", sort_order: 1 },
    { quiz_id: q6, title: "Captain America", description: "Ηθικός, γενναίος και αφοσιωμένος. Πάντα κάνεις το σωστό!", sort_order: 2 },
  );

  // Quiz 7: Country (personality)
  const q7 = quizzes![7].id;
  allResults.push(
    { quiz_id: q7, title: "Ιταλία", description: "Πάθος, φαγητό, τέχνη — η ζωή σου είναι γιορτή!", sort_order: 0 },
    { quiz_id: q7, title: "Ιαπωνία", description: "Πειθαρχημένος/η, τεχνολογικός/ή με αγάπη για τις λεπτομέρειες.", sort_order: 1 },
    { quiz_id: q7, title: "Βραζιλία", description: "Χαρούμενος/η, κοινωνικός/ή, ζεις τη ζωή στο φουλ!", sort_order: 2 },
  );

  // Quiz 8: Harry Potter (trivia)
  const q8 = quizzes![8].id;
  allResults.push(
    { quiz_id: q8, title: "True Potterhead!", description: "Ξέρεις τα πάντα. Hogwarts σε περιμένει!", sort_order: 0 },
    { quiz_id: q8, title: "Muggle+", description: "Κάτι ξέρεις αλλά μπορείς καλύτερα!", sort_order: 1 },
    { quiz_id: q8, title: "Muggle", description: "Ώρα για rewatch!", sort_order: 2 },
  );

  // Quiz 9: NBA (personality)
  const q9 = quizzes![9].id;
  allResults.push(
    { quiz_id: q9, title: "LeBron James", description: "Leader, δυνατός, πολυμήχανος. King σε κάθε γήπεδο!", sort_order: 0 },
    { quiz_id: q9, title: "Stephen Curry", description: "Ταχύτατος, ακριβής, παιχνιδιάρης. Τρίποντο από παντού!", sort_order: 1 },
    { quiz_id: q9, title: "Giannis Antetokounmpo", description: "Αθλητικός, αποφασισμένος, ταπεινός. Greek Freak!", sort_order: 2 },
  );

  // Insert results
  const { data: resultsData, error: resErr } = await supabase
    .from("results")
    .insert(allResults)
    .select();

  if (resErr) return new Response(JSON.stringify({ error: resErr }), { status: 500, headers: corsHeaders });

  // Build result maps per quiz
  const resultsByQuiz: Record<string, any[]> = {};
  for (const r of resultsData!) {
    if (!resultsByQuiz[r.quiz_id]) resultsByQuiz[r.quiz_id] = [];
    resultsByQuiz[r.quiz_id].push(r);
  }

  // Define questions & answers for each quiz
  type QA = { text: string; answers: { text: string; is_correct?: boolean; resultIndex?: number }[] };

  const quizQA: Record<number, QA[]> = {
    // Quiz 0: Friends (personality) - resultIndex maps to result sort_order
    0: [
      { text: "Πώς περνάς ένα Σαββατοκύριακο;", answers: [
        { text: "Διαβάζω ένα βιβλίο ή βλέπω ντοκιμαντέρ", resultIndex: 0 },
        { text: "Shopping therapy!", resultIndex: 1 },
        { text: "Τρώω πίτσα στον καναπέ", resultIndex: 2 },
        { text: "Καθαρίζω και οργανώνω το σπίτι", resultIndex: 3 },
      ]},
      { text: "Ποιο είναι το ιδανικό πρώτο ραντεβού;", answers: [
        { text: "Μουσείο ή έκθεση", resultIndex: 0 },
        { text: "Fancy εστιατόριο", resultIndex: 1 },
        { text: "Πίτσα και ταινία", resultIndex: 2 },
        { text: "Μαγειρεύω εγώ!", resultIndex: 3 },
      ]},
      { text: "Πώς αντιδράς σε μια κρίση;", answers: [
        { text: "Αναλύω λογικά", resultIndex: 0 },
        { text: "Παίρνω τηλ. τη φίλη μου", resultIndex: 1 },
        { text: "Τρώω τα συναισθήματά μου", resultIndex: 2 },
        { text: "Οργανώνω σχέδιο δράσης", resultIndex: 3 },
      ]},
      { text: "Τι σε εκνευρίζει περισσότερο;", answers: [
        { text: "Η αμάθεια", resultIndex: 0 },
        { text: "Η αδικία", resultIndex: 1 },
        { text: "Να μη μοιράζονται φαγητό μαζί μου", resultIndex: 2 },
        { text: "Η ακαταστασία", resultIndex: 3 },
      ]},
    ],
    // Quiz 1: Messi (trivia)
    1: [
      { text: "Σε ποια πόλη γεννήθηκε ο Messi;", answers: [
        { text: "Μπουένος Άιρες", is_correct: false },
        { text: "Ροσάριο", is_correct: true },
        { text: "Κόρδοβα", is_correct: false },
        { text: "Μεντόσα", is_correct: false },
      ]},
      { text: "Πόσα Ballon d'Or έχει κερδίσει;", answers: [
        { text: "6", is_correct: false },
        { text: "7", is_correct: false },
        { text: "8", is_correct: true },
        { text: "5", is_correct: false },
      ]},
      { text: "Σε ποια ηλικία ξεκίνησε στην Μπαρτσελόνα;", answers: [
        { text: "11", is_correct: false },
        { text: "13", is_correct: true },
        { text: "15", is_correct: false },
        { text: "10", is_correct: false },
      ]},
      { text: "Ποιο ήταν το πρώτο του Μουντιάλ;", answers: [
        { text: "2002", is_correct: false },
        { text: "2006", is_correct: true },
        { text: "2010", is_correct: false },
        { text: "2004", is_correct: false },
      ]},
    ],
    // Quiz 2: Personality type
    2: [
      { text: "Πώς γεμίζεις τις μπαταρίες σου;", answers: [
        { text: "Πάρτι με φίλους!", resultIndex: 0 },
        { text: "Μια ήσυχη βραδιά σπίτι", resultIndex: 1 },
        { text: "Εξαρτάται τη μέρα", resultIndex: 2 },
        { text: "Βόλτα μόνος/η στη φύση", resultIndex: 1 },
      ]},
      { text: "Σε μια ομαδική εργασία:", answers: [
        { text: "Αναλαμβάνω τη παρουσίαση", resultIndex: 0 },
        { text: "Δουλεύω πίσω από τις κουλίσες", resultIndex: 1 },
        { text: "Κάνω λίγο απ' όλα", resultIndex: 2 },
        { text: "Οργανώνω αλλά δεν μιλάω", resultIndex: 1 },
      ]},
      { text: "Πώς αντιμετωπίζεις ένα πρόβλημα;", answers: [
        { text: "Μιλάω με πολλούς για γνώμες", resultIndex: 0 },
        { text: "Σκέφτομαι μόνος/η πρώτα", resultIndex: 1 },
        { text: "Μιλάω σε 1-2 κοντινούς ανθρώπους", resultIndex: 2 },
        { text: "Γράφω τις σκέψεις μου", resultIndex: 1 },
      ]},
    ],
    // Quiz 3: Singer
    3: [
      { text: "Ποιο μουσικό στυλ σε εκφράζει;", answers: [
        { text: "Country-Pop", resultIndex: 0 },
        { text: "Reggaeton/Latin", resultIndex: 1 },
        { text: "Soul/Ballads", resultIndex: 2 },
        { text: "Indie", resultIndex: 0 },
      ]},
      { text: "Πώς εκφράζεις τα συναισθήματά σου;", answers: [
        { text: "Γράφω lyrics/ημερολόγιο", resultIndex: 0 },
        { text: "Χορεύω και γιορτάζω", resultIndex: 1 },
        { text: "Τραγουδάω βαθιά", resultIndex: 2 },
        { text: "Μέσα από τέχνη", resultIndex: 0 },
      ]},
      { text: "Ιδανικό Σαββατόβραδο;", answers: [
        { text: "Cozy βραδιά με φίλους", resultIndex: 0 },
        { text: "Club μέχρι πρωίας", resultIndex: 1 },
        { text: "Concert ή live μουσική", resultIndex: 2 },
        { text: "Karaoke night!", resultIndex: 1 },
      ]},
    ],
    // Quiz 4: Celebrity childhood (trivia)
    4: [
      { text: "Ποιος διάσημος είχε πρόβλημα στο σχολείο με dyslexia;", answers: [
        { text: "Tom Cruise", is_correct: true },
        { text: "Brad Pitt", is_correct: false },
        { text: "Leonardo DiCaprio", is_correct: false },
        { text: "Johnny Depp", is_correct: false },
      ]},
      { text: "Ποιος ξεκίνησε ως παιδί-star στο Disney;", answers: [
        { text: "Rihanna", is_correct: false },
        { text: "Miley Cyrus", is_correct: true },
        { text: "Adele", is_correct: false },
        { text: "Beyoncé", is_correct: false },
      ]},
      { text: "Ποιος μεγάλωσε σε trailer park;", answers: [
        { text: "Jay-Z", is_correct: false },
        { text: "Drake", is_correct: false },
        { text: "Eminem", is_correct: true },
        { text: "Kanye West", is_correct: false },
      ]},
    ],
    // Quiz 5: IQ (trivia)
    5: [
      { text: "Ποιο νούμερο ακολουθεί: 2, 6, 12, 20, ?", answers: [
        { text: "28", is_correct: false },
        { text: "30", is_correct: true },
        { text: "26", is_correct: false },
        { text: "32", is_correct: false },
      ]},
      { text: "Πρωτεύουσα της Αυστραλίας;", answers: [
        { text: "Σίδνεϊ", is_correct: false },
        { text: "Μελβούρνη", is_correct: false },
        { text: "Καμπέρα", is_correct: true },
        { text: "Περθ", is_correct: false },
      ]},
      { text: "Ποιος ζωγράφισε τη 'Νύχτα με Αστέρια';", answers: [
        { text: "Monet", is_correct: false },
        { text: "Van Gogh", is_correct: true },
        { text: "Picasso", is_correct: false },
        { text: "Dalí", is_correct: false },
      ]},
      { text: "Πόσες πλευρές έχει ένα δωδεκάγωνο;", answers: [
        { text: "10", is_correct: false },
        { text: "12", is_correct: true },
        { text: "14", is_correct: false },
        { text: "8", is_correct: false },
      ]},
    ],
    // Quiz 6: Marvel (personality)
    6: [
      { text: "Πώς θα σώσεις τον κόσμο;", answers: [
        { text: "Με τεχνολογία και εφευρέσεις", resultIndex: 0 },
        { text: "Με ευκινησία και χιούμορ", resultIndex: 1 },
        { text: "Με δύναμη και ηθική", resultIndex: 2 },
        { text: "Με στρατηγική", resultIndex: 0 },
      ]},
      { text: "Τι σε κινητοποιεί;", answers: [
        { text: "Η καινοτομία", resultIndex: 0 },
        { text: "Η ευθύνη προς τους άλλους", resultIndex: 1 },
        { text: "Η δικαιοσύνη", resultIndex: 2 },
        { text: "Η περιέργεια", resultIndex: 0 },
      ]},
      { text: "Πώς θα σε περιέγραφαν οι φίλοι σου;", answers: [
        { text: "Genius αλλά λίγο εγωιστής", resultIndex: 0 },
        { text: "Αστείος και αξιόπιστος", resultIndex: 1 },
        { text: "Τίμιος και γενναίος", resultIndex: 2 },
        { text: "Σίγουρος και cool", resultIndex: 0 },
      ]},
    ],
    // Quiz 7: Country (personality)
    7: [
      { text: "Αγαπημένο φαγητό;", answers: [
        { text: "Πάστα & πίτσα", resultIndex: 0 },
        { text: "Sushi & ramen", resultIndex: 1 },
        { text: "BBQ & churrasco", resultIndex: 2 },
        { text: "Street food", resultIndex: 2 },
      ]},
      { text: "Ιδανικές διακοπές;", answers: [
        { text: "Τοσκάνη, κρασί & ηλιοβασίλεμα", resultIndex: 0 },
        { text: "Τόκιο, τεχνολογία & anime", resultIndex: 1 },
        { text: "Ρίο, παραλία & samba", resultIndex: 2 },
        { text: "Αμαλφιτάνα ακτή", resultIndex: 0 },
      ]},
      { text: "Σε μια βραδιά θα:", answers: [
        { text: "Μαγειρεύω pasta με φίλους", resultIndex: 0 },
        { text: "Βλέπω anime ή gaming", resultIndex: 1 },
        { text: "Carnival party!", resultIndex: 2 },
        { text: "Karaoke", resultIndex: 2 },
      ]},
    ],
    // Quiz 8: Harry Potter (trivia)
    8: [
      { text: "Ποιο είναι το Patronus του Harry;", answers: [
        { text: "Λύκος", is_correct: false },
        { text: "Ελάφι", is_correct: true },
        { text: "Φοίνικας", is_correct: false },
        { text: "Κύκνος", is_correct: false },
      ]},
      { text: "Πώς λέγεται ο σκύλος του Hagrid;", answers: [
        { text: "Fluffy", is_correct: false },
        { text: "Fang", is_correct: true },
        { text: "Buckbeak", is_correct: false },
        { text: "Norbert", is_correct: false },
      ]},
      { text: "Ποιο σπίτι κέρδιζε πάντα πριν τον Harry;", answers: [
        { text: "Hufflepuff", is_correct: false },
        { text: "Ravenclaw", is_correct: false },
        { text: "Slytherin", is_correct: true },
        { text: "Gryffindor", is_correct: false },
      ]},
      { text: "Τι ξύλο έχει το ραβδί του Harry;", answers: [
        { text: "Oak", is_correct: false },
        { text: "Holly", is_correct: true },
        { text: "Elder", is_correct: false },
        { text: "Willow", is_correct: false },
      ]},
    ],
    // Quiz 9: NBA (personality)
    9: [
      { text: "Πώς παίζεις στο γήπεδο;", answers: [
        { text: "Ηγέτης, δίνω ρυθμό", resultIndex: 0 },
        { text: "Σουτ από μακριά!", resultIndex: 1 },
        { text: "Drive στο καλάθι!", resultIndex: 2 },
        { text: "Playmaker", resultIndex: 1 },
      ]},
      { text: "Off-court τι κάνεις;", answers: [
        { text: "Business & media", resultIndex: 0 },
        { text: "Family time & golf", resultIndex: 1 },
        { text: "Gaming & fun", resultIndex: 2 },
        { text: "Φιλανθρωπία", resultIndex: 0 },
      ]},
      { text: "Ποιο motto σου ταιριάζει;", answers: [
        { text: "Strive for Greatness", resultIndex: 0 },
        { text: "Night Night 🌙", resultIndex: 1 },
        { text: "Be Humble, Stay Hungry", resultIndex: 2 },
        { text: "Hard work beats talent", resultIndex: 2 },
      ]},
    ],
  };

  // Insert questions
  for (let qi = 0; qi < 10; qi++) {
    const quizId = quizzes![qi].id;
    const questions = quizQA[qi];
    for (let qIdx = 0; qIdx < questions.length; qIdx++) {
      allQuestions.push({
        quiz_id: quizId,
        text: questions[qIdx].text,
        sort_order: qIdx,
        _quiz_index: qi,
        _q_index: qIdx,
      });
    }
  }

  const questionsToInsert = allQuestions.map(({ _quiz_index, _q_index, ...rest }) => rest);
  const { data: insertedQuestions, error: qErr } = await supabase
    .from("questions")
    .insert(questionsToInsert)
    .select();

  if (qErr) return new Response(JSON.stringify({ error: qErr }), { status: 500, headers: corsHeaders });

  // Build answers
  const allAnswersToInsert: any[] = [];
  for (let i = 0; i < allQuestions.length; i++) {
    const meta = allQuestions[i];
    const questionId = insertedQuestions![i].id;
    const quizId = quizzes![meta._quiz_index].id;
    const quizType = quizzesData[meta._quiz_index].type;
    const qaData = quizQA[meta._quiz_index][meta._q_index];
    const quizResults = resultsByQuiz[quizId] || [];

    for (let aIdx = 0; aIdx < qaData.answers.length; aIdx++) {
      const ans = qaData.answers[aIdx];
      const row: any = {
        question_id: questionId,
        text: ans.text,
        sort_order: aIdx,
      };
      if (quizType === "trivia") {
        row.is_correct = ans.is_correct ?? false;
      } else {
        // personality: map resultIndex to actual result_id
        const targetResult = quizResults.find((r: any) => r.sort_order === ans.resultIndex);
        row.result_id = targetResult?.id ?? null;
      }
      allAnswersToInsert.push(row);
    }
  }

  const { error: ansErr } = await supabase
    .from("answers")
    .insert(allAnswersToInsert);

  if (ansErr) return new Response(JSON.stringify({ error: ansErr }), { status: 500, headers: corsHeaders });

  return new Response(
    JSON.stringify({ success: true, quizzes: quizzes!.length, questions: insertedQuestions!.length, answers: allAnswersToInsert.length }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

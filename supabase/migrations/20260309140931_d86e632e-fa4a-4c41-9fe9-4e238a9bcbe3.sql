-- Make these 7 quizzes fully text-only (remove partial images)
UPDATE answers SET image_url = NULL
WHERE question_id IN (
  SELECT qu.id FROM questions qu WHERE qu.quiz_id IN (
    'e526a6ec-9038-40c1-99aa-f93abab1dad2',
    '78250c7d-fb27-421a-859b-920660363526',
    'b2182436-93ea-4074-adb6-f179913e6265',
    '73e577d4-7aa3-4d57-a712-d59450582fa4',
    'd6f2677f-a09a-487d-bff0-5381a189b8d6',
    'e1133e57-d8f0-4203-a492-58d829ebec46',
    '8efb4afc-4de7-4d8e-80d1-457280517ad0'
  )
);

-- Also make ~20 more quizzes text-only to reach ~27 total
-- Pick quizzes that are trivia or text-based concepts where images aren't essential
UPDATE answers SET image_url = NULL
WHERE question_id IN (
  SELECT qu.id FROM questions qu WHERE qu.quiz_id IN (
    -- Trivia quizzes (text makes more sense)
    '47d91196-2a00-4005-bbab-77369a8f5bce', -- K-pop Quiz
    '8efbfda4-e209-403b-b380-35ce3640bc04', -- 2026 Top Hits
    '6838e692-aba3-41f1-8c8e-2a53a9b5b1a5', -- Ζώα και Φύση trivia
    '6e9cde8c-7056-4d1b-9b6a-18754ca5026c', -- Τραγούδι από emoji
    'ff46e5f6-eddf-447d-945a-089da3d3e094', -- Ελληνικό ποδόσφαιρο
    '172db925-0336-4dde-b92a-bed5af687668', -- Πρωτεύουσες
    -- Personality quizzes that work as text
    'f5c3024f-fd3a-419b-bd4b-815b2e13ecc4', -- Χρώμα ψυχής (2nd copy)
    'b46d4114-5a98-4c3b-90f0-844b093d984b', -- Stranger Things
    '7181c56c-9087-4d6f-8147-b63e07c3e2cf', -- Τι φίλος είσαι
    'd7aa4c88-d537-43d0-8a59-6003e0c79d20', -- Ανοιξιάτικη μέρα
    'cdc27cb0-34a1-4e64-b548-92390fa8a81b', -- IQ Test
    'f1b4598b-1c5a-47fb-ab3d-f77ab18b9d14', -- Harry Potter
    '0255807f-7fad-43a3-b9bc-5143eef04830', -- Τύπος προσωπικότητας
    '63c0280c-da9f-4c53-9193-15ec5ecf8189', -- Τραγουδιστής
    'c846ccb2-3c03-400a-a4c9-24ab12333fb5', -- Διάσημος από παιδί
    'efe76325-89a5-441e-ac56-7ef0f6d70f29', -- Friends (original)
    '85c5b695-90b4-4207-80d7-d016e8015648', -- Messi
    'bf1b7d46-005a-456c-be2b-b6768e928149', -- Marvel
    '71c85e5c-4437-4ce7-a9cd-05d11dabfc12', -- NBA
    'd157f090-65ec-43cd-9cf3-3e7cd073c25b'  -- Ταινία 2026
  )
);


## Add ezoicId Props to All AdSlot Usages

Assign sequential Ezoic placeholder IDs (101–116) to every `<AdSlot>` across the site. Each ID must be unique so Ezoic can manage placements independently.

### ID Assignment Map

| ID  | File | Format | Location |
|-----|------|--------|----------|
| 101 | Index.tsx | native | Homepage top |
| 102 | Index.tsx | banner | Homepage mid |
| 103 | Index.tsx | leaderboard | Homepage bottom |
| 104 | Index.tsx | rectangle | Homepage sidebar |
| 105 | PostPage.tsx | leaderboard | Post in-content |
| 106 | PostPage.tsx | rectangle | Post below content |
| 107 | QuizPage.tsx | leaderboard | Quiz top |
| 108 | QuizPage.tsx | rectangle | Quiz between questions |
| 109 | ContentSidebar.tsx | rectangle | Sidebar top |
| 110 | ContentSidebar.tsx | rectangle | Sidebar bottom |
| 111 | TrendingPage.tsx | leaderboard | Trending top |
| 112 | CelebrityPage.tsx | leaderboard | Celebrity top |
| 113 | ShoppingPage.tsx | leaderboard | Shopping top |
| 114 | BuzzChatPage.tsx | leaderboard | BuzzChat top |
| 115 | CategoryPage.tsx | leaderboard | Category top |
| 116 | QuizzesPage.tsx | — | Only if AdSlot exists there |

### Files to modify (9 files, one prop addition each)
- `src/pages/Index.tsx` — 4 AdSlots → add ezoicId={101–104}
- `src/pages/PostPage.tsx` — 2 AdSlots → add ezoicId={105–106}
- `src/pages/QuizPage.tsx` — 2 AdSlots → add ezoicId={107–108}
- `src/components/ContentSidebar.tsx` — 2 AdSlots → add ezoicId={109–110}
- `src/pages/TrendingPage.tsx` — 1 AdSlot → add ezoicId={111}
- `src/pages/CelebrityPage.tsx` — 1 AdSlot → add ezoicId={112}
- `src/pages/ShoppingPage.tsx` — 1 AdSlot → add ezoicId={113}
- `src/pages/BuzzChatPage.tsx` — 1 AdSlot → add ezoicId={114}
- `src/pages/CategoryPage.tsx` — 1 AdSlot → add ezoicId={115}

Each change is simply adding `ezoicId={N}` to the existing `<AdSlot>` tag. No other modifications needed.


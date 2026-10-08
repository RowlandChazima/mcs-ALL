# Architecture & Directory Structure

```
maths-cs/
├── app/
│   ├── src/
│   │   ├── layout.tsx
│   │   ├── page.tsx                          → homepage (unit grid)
│   │   ├── globals.css
│   │   └── units/
│   │       └── [unitSlug]/
│   │           ├── page.tsx                  → unit page (intro + topic list)
│   │           └── [topicSlug]/
│   │               ├── page.tsx              → topic page (lesson list)
│   │               └── [lessonSlug]/
│   │                   └── page.tsx          → lesson page (notes)
│   │
│   ├── components/
│   │   ├── UnitCard.tsx
│   │   ├── TopicRow.tsx
│   │   ├── LessonContent.tsx                 → markdown+katex renderer
│   │   ├── Breadcrumb.tsx
│   │   └── SuggestEditButton.tsx             → GitHub issue link
│   │
│   ├── lib/
│   │   ├── supabase.ts                       → Supabase client init
│   │   └── queries.ts                        → getUnits(), getUnitBySlug(), etc.
│   │
│   └── types/
│       └── content.ts                        → Unit, Topic, Lesson TS types
│
├── public/
│   └── icons/                                → your Gemini-generated unit SVGs
│
├── .env.local                                → Supabase + Cloudinary keys (never commit)
└── tailwind.config.ts                        → your navy/cream/black palette
```

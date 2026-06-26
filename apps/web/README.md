# Web App

Next.js frontend (App Router + TypeScript) for AI Career Agent.

## Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui-style components
- Zustand
- React Hook Form + Zod
- Lucide React

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
├── app/           # Routes (App Router)
├── components/    # Shared UI + layout
├── features/      # Feature modules + mock data
├── config/        # Site + navigation config
├── hooks/
├── lib/
├── providers/
├── services/      # API placeholders (no backend yet)
├── store/         # Zustand stores
└── types/
```

## Mock Auth

Login and register forms use mock data and navigate to `/dashboard` without API calls.

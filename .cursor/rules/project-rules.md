# AI Career Agent — Project Rules

## Mission

Build the most trusted AI-powered career platform that helps users discover high-quality jobs, optimize applications, and manage their complete career journey.

The platform prioritizes **quality over quantity**.

Never optimize for displaying more jobs.
Always optimize for displaying better jobs.

---

## Product Principles

1. Quality First
2. User Trust First
3. Performance First
4. Simplicity First
5. Security First

---

## Development Principles

1. Build only roadmap-approved features.
2. Do not implement future features unless explicitly requested.
3. Follow modular architecture.
4. Prefer maintainability over shortcuts.
5. Avoid unnecessary complexity.

---

## Version 1 Restrictions

Do **not** build:

- Auto Apply Agent
- Browser Automation
- Referral Engine
- Interview Agent
- Salary Prediction
- Career Coaching
- Chrome Extension

These are future roadmap features.

---

## Architecture Rules

| Layer | Technology |
| ----- | ---------- |
| Frontend | Next.js, TypeScript, App Router |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL, Prisma |
| Cache | Redis |
| Queues | BullMQ |

---

## API Rules

1. Use REST APIs.
2. Use consistent response format.
3. Validate every request.
4. Never trust frontend input.
5. Return meaningful errors.

**Standard Response:**

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Database Rules

1. Use Prisma ORM.
2. Use UUID primary keys.
3. Use timestamps on every table.
4. Use soft delete when appropriate.
5. Add indexes for searchable fields.

---

## Frontend Rules

1. Feature-based architecture.
2. Reusable components.
3. Strong typing.
4. Responsive design.
5. No business logic inside UI components.

---

## Backend Rules

1. Business logic belongs in services.
2. Controllers remain thin.
3. Use DTOs.
4. Use validation pipes.
5. Use dependency injection.

---

## AI Rules

1. Keep prompts separate.
2. Never hardcode prompts in services.
3. Store prompts in `ai/prompts`.
4. AI outputs must be validated.
5. AI should assist decision making, not replace system logic.

---

## Security Rules

1. Validate all inputs.
2. Sanitize uploaded files.
3. Protect user data.
4. Never expose secrets.
5. Follow least privilege access.

---

## Code Quality Rules

1. Use TypeScript strict mode.
2. Avoid `any` type.
3. Write self-documenting code.
4. Follow clean architecture principles.
5. Keep functions small and focused.

---

## Documentation Rules

Whenever a major feature is completed:

1. Update `docs/tasks.md`
2. Update `docs/roadmap.md` progress
3. Update feature document in `docs/features/`
4. Update `docs/api-spec.md` if required

Documentation must always reflect the current implementation.

# AI Career Agent — Coding Standards

## General Standards

- Use TypeScript everywhere.
- Use strict mode.
- Prefer readability over clever code.
- Keep files focused on a single responsibility.

---

## Naming Conventions

### Variables

**Good:**

```
userProfile
jobMatchScore
applicationStatus
```

**Bad:**

```
data
temp
obj
```

### Functions

Use verbs.

**Good:**

```
createProfile()
calculateMatchScore()
generateCoverLetter()
```

**Bad:**

```
profile()
score()
```

### Components

PascalCase

**Good:**

```
JobCard.tsx
ProfileForm.tsx
ApplicationTable.tsx
```

### Hooks

**Good:**

```
useAuth.ts
useJobs.ts
useProfile.ts
```

### Services

**Good:**

```
auth.service.ts
jobs.service.ts
profile.service.ts
```

### DTOs

**Good:**

```
create-user.dto.ts
update-profile.dto.ts
```

---

## Frontend Standards

### Component Rules

1. Components should be reusable.
2. Avoid large components.
3. Extract repeated logic.

**Maximum recommendation:** 300 lines per component.

### State Management

**Use:**

- Zustand

Do not use global state unless necessary.

### Forms

**Use:**

- React Hook Form
- Zod Validation

### Styling

**Use:**

- Tailwind CSS
- shadcn/ui

**Avoid:**

- Inline styles
- CSS duplication

---

## Backend Standards

### Controllers

Controllers should:

- Receive requests
- Validate input
- Call services

Controllers should **not** contain business logic.

### Services

Services should contain:

- Business logic
- Validation logic
- Processing logic

### Repositories

Repositories should only:

- Read data
- Write data

No business logic.

### DTO Standards

Every write operation must have DTOs.

**Examples:**

- `CreateUserDto`
- `UpdateProfileDto`
- `CreateApplicationDto`

---

## Database Standards

### Primary Keys

Use UUID.

**Example:**

```prisma
id String @id @default(uuid())
```

### Timestamps

Every table must contain:

- `createdAt`
- `updatedAt`

### Naming

| Kind | Convention | Examples |
| ---- | ---------- | -------- |
| Table | lowercase plural | `users`, `profiles`, `jobs` |
| Column | camelCase | `firstName`, `lastName`, `createdAt` |

---

## API Standards

### Routes

**Good:**

```
/api/v1/jobs
/api/v1/profile
```

**Bad:**

```
/api/v1/getJobs
/api/v1/fetchProfile
```

Use nouns, not verbs.

### HTTP Methods

| Method | Purpose |
| ------ | ------- |
| GET | Read |
| POST | Create |
| PUT | Replace |
| PATCH | Partial update |
| DELETE | Delete |

---

## Error Handling

Always return structured errors.

**Example:**

```json
{
  "success": false,
  "message": "Profile not found"
}
```

---

## Logging

**Log:**

- Errors
- Warnings
- Important events

**Do not log:**

- Passwords
- Tokens
- Sensitive user data

---

## Testing Standards

Every major feature should include:

- Unit Tests
- Integration Tests

Critical business logic must be tested.

---

## AI Standards

Prompts must live inside:

```
apps/api/src/ai/prompts
```

Agents must live inside:

```
apps/api/src/ai/agents
```

Never mix prompts with service logic.

---

## File Size Guidelines

| File Type | Recommended Maximum |
| --------- | ------------------- |
| Component | 300 lines |
| Service | 400 lines |
| Controller | 150 lines |
| DTO | 100 lines |

If a file becomes too large, split it.

---

## Definition of Done

A task is complete only when:

- Code implemented
- Validation added
- Error handling added
- Types added
- Tests added
- Documentation updated

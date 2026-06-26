# Backend Rules

> **Scope:** `apps/api`  
> **Last updated:** 2025-06-25

## Tech Stack

| Concern | Technology |
| ------- | ---------- |
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Cache | Redis |
| Queue | BullMQ |
| API Style | REST API |

---

## Architecture Rules

Use modular monolith architecture.

**Structure:**

```
src/
├── modules/
├── common/
├── config/
├── database/
├── integrations/
├── queues/
└── ai/
```

Never place all business logic in a single module.

Each feature must have its own module.

---

## Module Structure

**Example:**

```
modules/jobs/
├── controllers/
├── services/
├── repositories/
├── dto/
├── entities/
├── jobs.controller.ts
├── jobs.service.ts
└── jobs.repository.ts
```

---

## Controller Rules

Controllers must:

- Receive requests
- Validate input
- Call services
- Return responses

Controllers must **not**:

- Query database directly
- Contain business logic
- Call external APIs directly

Keep controllers thin.

---

## Service Rules

Services contain:

- Business logic
- Validation logic
- Processing logic

Services are the core of the application.

---

## Repository Rules

Repositories should:

- Read data
- Write data

Repositories should **not**:

- Contain business logic
- Call AI services

---

## DTO Rules

Every create/update endpoint must have DTOs.

**Examples:**

- `CreateUserDto`
- `UpdateProfileDto`
- `CreateApplicationDto`

**Use:**

- class-validator
- class-transformer

---

## Validation Rules

Validate all incoming data.

Never trust client input.

Every API must validate:

- Body
- Query parameters
- Route parameters

---

## Error Handling

Use centralized exception handling.

**Return:**

```json
{
  "success": false,
  "message": "Error message"
}
```

Never expose internal errors.

---

## API Response Format

**Success:**

```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error"
}
```

Use consistent responses across the project.

---

## Authentication Rules

**Use:**

- JWT Access Token
- JWT Refresh Token

Protect all private routes.

Never expose sensitive information.

---

## Integration Rules

Third-party integrations must live inside:

```
integrations/
```

**Examples:**

```
integrations/openai
integrations/storage
integrations/email
```

Never call third-party services directly from modules.

---

## Queue Rules

Long-running tasks must use BullMQ.

**Examples:**

- Resume parsing
- Job crawling
- AI processing
- Email sending

Never block API requests.

---

## Logging Rules

**Log:**

- Errors
- Warnings
- Important events

**Never log:**

- Passwords
- Tokens
- Secrets
- Personal user data

---

## Security Rules

- Validate inputs
- Sanitize files
- Use rate limiting
- Protect secrets
- Use environment variables

---

## TypeScript Rules

**Use:**

- Strict mode

**Avoid:**

- `any`

Prefer explicit typing.

---

## Definition of Done

Backend task is complete only when:

- Endpoint implemented
- DTO created
- Validation added
- Error handling added
- Types added
- Tests added
- Documentation updated

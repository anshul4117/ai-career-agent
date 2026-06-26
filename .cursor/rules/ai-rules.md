# AI Rules

> **Scope:** `apps/api/src/ai`  
> **Last updated:** 2025-06-25

## Mission

AI should enhance the user's job search experience.

AI should not replace core business logic.

Use AI only where intelligence adds value.

---

## AI Responsibilities

**Allowed:**

- Resume parsing
- Job matching
- Resume optimization
- Cover letter generation
- Skill gap analysis

**Not allowed:**

- Authentication
- Database validation
- Authorization
- Core CRUD operations

---

## AI Architecture

**Structure:**

```
src/ai/
├── agents/
├── prompts/
└── tools/
```

Keep AI isolated from business modules.

---

## Prompt Rules

All prompts must live in:

```
src/ai/prompts
```

Never hardcode prompts inside:

- Services
- Controllers
- Repositories

---

## Agent Rules

Each major AI capability must have its own agent.

**Examples:**

```
resume-parser.agent.ts
job-match.agent.ts
resume-optimizer.agent.ts
cover-letter.agent.ts
```

---

## Output Validation

Never trust AI output.

**Validate:**

- Required fields
- Data types
- Response structure

AI output must pass validation before use.

---

## Resume Parsing Rules

**Extract:**

- Skills
- Education
- Experience
- Projects
- Certifications

If confidence is low:

- Flag for user review
- Never auto-save uncertain information

---

## Job Matching Rules

Match score must include:

- Skills match
- Experience match
- Role match

AI must provide explanations.

Users should understand why a score was generated.

---

## Resume Optimization Rules

**AI may:**

- Improve wording
- Improve ATS compatibility
- Suggest keywords

**AI must not:**

- Invent experience
- Invent skills
- Create fake achievements

---

## Cover Letter Rules

**AI should:**

- Personalize content
- Use user profile data
- Use job description context

AI must not fabricate facts.

---

## Cost Control Rules

Use AI only when necessary.

Avoid repeated requests.

**Implement:**

- Caching
- Queue processing
- Reuse of results

Minimize token consumption.

---

## Queue Rules

AI tasks should run in BullMQ.

**Examples:**

- Resume parsing
- Match generation
- Resume optimization
- Cover letter generation

Avoid blocking user requests.

---

## Observability Rules

**Track:**

- Token usage
- Request count
- Response time
- Error rate

Prepare for future cost monitoring.

---

## Security Rules

**Never send to AI providers:**

- Passwords
- Tokens
- Secrets

Only send required data.

---

## Future AI Features (Not V1)

Do **not** build:

- Auto Apply Agent
- Browser Automation Agent
- Interview Agent
- Career Coach Agent
- Salary Negotiation Agent

These remain locked until MVP release.

---

## Definition of Done

AI feature is complete only when:

- Prompt created
- Agent created
- Output validated
- Error handling added
- Queue integrated
- Cost considered
- Documentation updated

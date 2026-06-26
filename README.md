# AI Career Agent

A production-grade platform that helps job seekers discover high-quality opportunities, optimize their profiles, and manage applications with AI-powered assistance.

## Overview

AI Career Agent is a full-stack monorepo combining a modern web experience with a robust API backend, intelligent job-matching pipelines, and structured career data management.

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | Next.js (App Router) + TypeScript   |
| Backend      | NestJS + TypeScript                 |
| Database     | PostgreSQL + Prisma                 |
| Cache        | Redis                               |
| Queue        | BullMQ                              |

## Repository Structure

```
ai-career-agent/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── shared/       # Shared utilities
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared configuration
├── docs/             # Product & technical documentation
├── infra/            # Docker & deployment configs
└── .cursor/rules/    # AI-assisted development guidelines
```

## Prerequisites

- Node.js >= 20
- pnpm (recommended) or npm
- Docker & Docker Compose (for local PostgreSQL and Redis)

## Getting Started

> **Note:** Application scaffolding is in progress. Feature implementation has not yet begun.

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd ai-career-agent
   ```

2. Install dependencies (once apps are scaffolded):

   ```bash
   pnpm install
   ```

3. Copy environment templates (to be added):

   ```bash
   cp .env.example .env
   ```

4. Start infrastructure services (to be added):

   ```bash
   docker compose -f infra/docker/docker-compose.yml up -d
   ```

5. Run development servers (once scaffolded):

   ```bash
   pnpm --filter @ai-career-agent/web dev
   pnpm --filter @ai-career-agent/api dev
   ```

## Documentation

| Document | Description |
| -------- | ----------- |
| [PRD](docs/prd.md) | Product requirements |
| [Architecture](docs/architecture.md) | System design & patterns |
| [Database](docs/database.md) | Schema & data model |
| [Roadmap](docs/roadmap.md) | Delivery timeline |
| [Tasks](docs/tasks.md) | Active work items |

Feature specifications live in [`docs/features/`](docs/features/).

## Development Guidelines

See [`.cursor/rules/project-rules.md`](.cursor/rules/project-rules.md) for mission, tech stack, coding standards, and architecture principles.

## License

Proprietary. All rights reserved.

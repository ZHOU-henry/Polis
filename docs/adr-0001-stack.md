# ADR-0001: Agora Phase-1 Stack

## Status

Accepted

## Decision

Use:

- `pnpm workspaces`
- `Turborepo`
- `Next.js 16 App Router`
- `Fastify + TypeScript`
- `PostgreSQL`
- `Prisma ORM`

## Why

- fast MVP iteration
- clear product/application fit
- relational data model
- shared types across web and API
- future extensibility without premature overengineering

## Non-Decisions

- no Rust API in phase 1
- no microservices in phase 1
- no Redis-first requirement in phase 1

## Product Fit

This stack is chosen for an operator-facing AI Agent platform MVP, not for a hypothetical later-stage marketplace infrastructure problem.

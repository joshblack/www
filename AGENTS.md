# AGENTS.md

## Project overview

This repository contains the source for https://josh.black. It is a private pnpm
workspace with a Next.js app at the repository root and local packages under
`packages/*`.

## Setup

- Use Node.js from `.nvmrc`.
- Use the package manager pinned in `package.json`.
- Install dependencies with `pnpm install`.

## Common commands

- `pnpm develop` starts the Next.js development server.
- `pnpm build` builds the site.
- `pnpm lint` runs ESLint.
- `pnpm type-check` runs TypeScript checks.
- `pnpm format:diff` checks formatting.
- `pnpm check` runs the cached Turbo pipeline for formatting, linting, and type
  checking.
- `pnpm turbo run <task>` runs a task through Turborepo.

## Repository structure

- `src/` contains the Next.js application source.
- `public/` contains static assets.
- `writing/` contains site content.
- `packages/lru-cache/` contains the `@www/lru-cache` workspace package.
- `packages/observable/` contains the `@www/observable` workspace package.
- `.github/workflows/ci.yml` defines CI checks.
- `turbo.json` defines cached task behavior.

## Development guidance

- Keep changes small and focused.
- Prefer existing scripts and tools over adding new ones.
- Run the relevant checks before finalizing changes.
- Do not commit generated build output, dependency directories, or secrets.

# Contributing to Expert Review Hub

Thank you for considering contributing! This document explains how to get started.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

---

## How to Contribute

### Reporting Bugs

1. Check the [existing issues](https://github.com/Mostafa-SAID7/Expert-Review-Hub/issues) first.
2. Open a new issue using the **Bug Report** template.
3. Include:
   - Steps to reproduce
   - Expected vs actual behaviour
   - Environment (OS, Node version, browser)
   - Relevant logs or screenshots

### Suggesting Features

1. Open a new issue using the **Feature Request** template.
2. Describe the use case and why it would benefit users.

### Submitting Pull Requests

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Set up locally** — follow the [Setup Guide](./docs/SETUP.md).

3. **Make your changes:**
   - Follow existing code style (TypeScript, no `any`, Zod for validation)
   - Add tests if applicable
   - Keep commits focused and atomic

4. **Commit with conventional commits:**
   ```
   feat: add calorie goal tracking
   fix: resolve JWT expiry edge case
   refactor: extract food search into service
   docs: update API reference
   chore: bump drizzle-orm to 0.46
   ```

5. **Push and open a PR** against `main`.
   - Fill in the PR template
   - Link any related issues (`Closes #123`)
   - Ensure all checks pass

---

## Development Guidelines

### Backend

- All routes must have Zod validators for request bodies
- Controllers should be thin — business logic belongs in services
- Use the `env` object from `src/config/` — never read `process.env` directly in business code
- Log with `logger` from `src/lib/logger.ts`, never `console.log`
- Run `npm run typecheck` before pushing

### Frontend

- Use TanStack Query for all server state
- New pages go in `src/pages/` and must be added to the router in `App.tsx`
- Shared components go in `src/components/`
- Use the `cn()` utility for conditional Tailwind classes
- Run `npm run typecheck` before pushing

---

## Project Structure

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for a full breakdown.

---

## Questions?

Open a [Discussion](https://github.com/Mostafa-SAID7/Expert-Review-Hub/discussions) or reach out via issues.

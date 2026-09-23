# Project Rules — data-cleaning-app

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript (ES6+), React (Vite-powered)
- Tooling: Node.js (LTS), npm, Git
- Styling: Tailwind CSS (standard configurations)
- Data processing: fully client-side, no backend, no data upload

## Coding Conventions

- Clean, semantic HTML; modular, reusable React components
- Functional components with hooks (useState, useEffect)
- Lightweight, responsive components
- Explicit, descriptive variable and function names

## Git Workflow

- Conventional Commits (feat:, fix:, docs:, chore:)
- Lowercase commit scopes, concise descriptions
- Check multi-file dependencies before edits



## AI Interaction Rules

- Concise code explanations, no verbose preamble
- Group multiple small file edits into one response
- Prefer a native lightweight JS/CSS alternative before pulling in a heavy package



## Rules from FE-03 Workflow Drill

- Do not install or configure new tooling (test runners, dependencies, config files) inside a feature generation request. Set those up manually first.
- For data processing functions, follow the exact file path, input and output types, and constraints (pure, synchronous, no side effects) given in the prompt. If any of these are missing, choose the most sensible default consistent with this project's local first, deterministic architecture, state the assumption in a code comment, and proceed. Do not stop to ask.
- Always confirm git status is clean on main before creating a new feature branch, so a new attempt never inherits another attempt's leftover files.


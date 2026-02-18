# CLAUDE.md

This file provides guidance for AI assistants (e.g., Claude Code) working in this repository.

## Project Overview

**Repository:** `takashiichibe-ux/claude-test`

This is a starter/test repository. As of the initial commit, it contains only a `README.md`. This `CLAUDE.md` serves as the foundational development guide going forward.

## Repository Structure

```
claude-test/
├── README.md       # Project overview
└── CLAUDE.md       # This file — AI assistant guidance
```

This structure will grow as the project develops. Update this section whenever new top-level directories or significant files are added.

## Git Workflow

### Branch Naming

- Feature branches for AI-assisted work use the prefix `claude/` followed by a descriptive slug and session ID:
  ```
  claude/<short-description>-<session-id>
  ```
  Example: `claude/add-claude-documentation-6M2Yg`

- Human-authored feature branches should follow:
  ```
  feature/<short-description>
  fix/<short-description>
  chore/<short-description>
  ```

### Development Workflow

1. **Never commit directly to `main` or `master`.** Always work on a feature branch.
2. Create or switch to the designated branch before making any changes.
3. Make focused, atomic commits with clear messages (see below).
4. Push with upstream tracking: `git push -u origin <branch-name>`.
5. Open a pull request targeting `main` for review.

### Commit Messages

Use concise, imperative-mood commit messages:

```
Add CLAUDE.md with project conventions
Fix typo in README
Update dependency versions
```

- First line: 50 characters or fewer, no trailing period.
- Leave a blank line before the body if more detail is needed.
- Reference issue numbers where applicable: `Fixes #42`.

### Git Push Policy

- Always use: `git push -u origin <branch-name>`
- Branch names for AI sessions **must** start with `claude/` and match the session ID suffix.
- On network failure, retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s).

## Development Conventions

### General

- Prefer editing existing files over creating new ones.
- Delete unused code rather than commenting it out.
- Avoid speculative abstractions — only add complexity when it is currently needed.
- Do not add docstrings, comments, or type annotations to code you did not write or change.

### Security

- Never commit secrets, credentials, API keys, or `.env` files.
- Validate input at system boundaries (user input, external APIs); trust internal code.
- Avoid introducing OWASP Top 10 vulnerabilities (XSS, SQL injection, command injection, etc.).

### Pull Requests

- Keep PR scope focused — one logical change per PR.
- Include a short summary of _what_ changed and _why_.
- Ensure all CI checks pass before requesting review.

## Adding to This Document

As the project grows, add sections for:

- **Build & Test commands** — how to install dependencies, run tests, and build the project.
- **Architecture** — description of key modules, services, or layers.
- **Environment setup** — required environment variables and how to configure them.
- **Code style** — linters, formatters, and style guides in use.
- **Deployment** — how and where the project is deployed.

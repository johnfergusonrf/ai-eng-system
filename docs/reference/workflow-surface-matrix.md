# Workflow Surface Matrix

Complete mapping of every shipped command to its canonical owner: skill, runtime feature, or agent workflow. All commands use the `ai-eng/` prefix; bare alias commands (`/spec`, `/build`, `/ship`, `/verify`, etc.) were retired.

Canonical source: `content/commands/` (28 commands), mirrored to `.claude/commands/` and `.opencode/commands/ai-eng/` by the build.

## Core Lifecycle Commands

| Command | Type | Canonical Owner | Skill Path |
|---------|------|-----------------|------------|
| `/ai-eng/research` | skill-backed | `comprehensive-research` | `skills/comprehensive-research/SKILL.md` |
| `/ai-eng/spec` | skill-backed | `spec-driven-development` | `skills/spec-driven-development/SKILL.md` |
| `/ai-eng/plan` | skill-backed | `planning-and-task-breakdown` | `skills/planning-and-task-breakdown/SKILL.md` |
| `/ai-eng/work` | skill-backed | `incremental-implementation` + `test-driven-development` | `skills/incremental-implementation/SKILL.md` |
| `/ai-eng/verify` | command-backed | quality gate loop (lint, typecheck, test, build) | `content/commands/verify.md` |
| `/ai-eng/review` | skill-backed | `code-review-and-quality` | `skills/code-review-and-quality/SKILL.md` |
| `/ai-eng/deep-review` | agent-backed | `review` agent (4 parallel axes) | `content/agents/review.md` |
| `/ai-eng/simplify` | skill-backed | `code-simplification` | `skills/code-simplification/SKILL.md` |
| `/ai-eng/ralph-wiggum` | skill-backed | `workflow/ralph-wiggum` | `skills/workflow/ralph-wiggum/SKILL.md` |

## Shipping and Deployment

| Command | Type | Canonical Owner | Notes |
|---------|------|-----------------|-------|
| `/ai-eng/ship` | skill-backed | `shipping-and-launch` | Deploy to production |
| `/ai-eng/deploy` | skill-backed | `ci-cd-and-automation` + `coolify-deploy` | Pre-deploy verification + Coolify |

## Research and Audit

| Command | Type | Canonical Owner | Notes |
|---------|------|-----------------|-------|
| `/ai-eng/repo-audit` | skill-backed | `repo-audit` | Four-phase repo health audit; analysis only |
| `/ai-eng/maintenance-review` | command-backed | drift/maintenance review | Captures drift, risks, cleanup priorities |
| `/ai-eng/seo` | agent-backed | `seo-specialist` | SEO audit on a page or site |
| `ai-eng workflow run seo-review` | CLI runner | `agents/seo-review-runner/` | SEO audit via any of 5 SDK runtimes; writes `.ai-eng/reports/seo-review-*.md` |

## Orchestration

| Command | Type | Canonical Owner | Notes |
|---------|------|-----------------|-------|
| `/ai-eng/orchestrate` | agent-backed | `subagent-orchestration` | Multi-agent coordination for cross-domain tasks |
| `/ai-eng/dynamic-task` | skill-backed | `dynamic-claude-router` | Tiered model routing for tasks |

## Plugin Development

| Command | Type | Canonical Owner | Notes |
|---------|------|-----------------|-------|
| `/ai-eng/create-plugin` | skill-backed | `plugin-dev` | Guided 8-phase plugin creation |
| `/ai-eng/create-agent` | skill-backed | `plugin-dev` | Uses agent-creator flow |
| `/ai-eng/create-command` | skill-backed | `plugin-dev` | Uses command-creator flow |
| `/ai-eng/create-skill` | skill-backed | `plugin-dev` | Uses skill-creator flow |
| `/ai-eng/create-tool` | skill-backed | `plugin-dev` | Uses tool-creator flow |

## Context, Quality, and Utilities

| Command | Type | Canonical Owner | Notes |
|---------|------|-----------------|-------|
| `/ai-eng/context` | runtime | session + memory | `packages/cli/src/context/` |
| `/ai-eng/init` | runtime | install system | `packages/cli/src/install/` |
| `/ai-eng/quality-gate` | runtime | quality gates | File-backed gate definitions |
| `/ai-eng/decision-journal` | command-backed | decision records | Lightweight journal with tradeoffs |
| `/ai-eng/cook-status` | runtime | cooking-routines loops | Lists active loops; prunes stale markers |

## Learning Loop (OpenCode-only)

| Command | Type | Canonical Owner | Notes |
|---------|------|-----------------|-------|
| `/ai-eng/learning-approve` | runtime | `continuous-learning` | Approve active learning recommendation |
| `/ai-eng/learning-dismiss` | runtime | `continuous-learning` | Dismiss active learning recommendation |
| `/ai-eng/learning-snooze` | runtime | `continuous-learning` | Snooze active learning recommendation |

## Legacy Surface

`packages/core/content/commands/` contains a larger legacy command catalog (`/ai-eng/specify`, `/ai-eng/coolify`, `/ai-eng/docker`, `/ai-eng/k8s`, etc.). These are **not shipped** in the root build surface (`dist/.opencode/command/ai-eng/`) and are retained only inside `packages/core`. Do not document them as available commands.

## Runtime Surfaces (Planned)

| Surface | Backed By | Status |
|---------|-----------|--------|
| `/ai-eng/model-route` | `packages/cli/src/config/modelResolver.ts` | planned |
| `/ai-eng/sessions` | `packages/cli/src/context/session.ts` | planned |
| `/ai-eng/checkpoint` | `packages/cli/src/context/session.ts` | planned |
| `/ai-eng/resume-session` | `packages/cli/src/context/session.ts` | planned |

# Commands Reference

Full inventory of the 29 shipped commands. All commands live under the `ai-eng/` namespace; bare shorthand commands (`/spec`, `/build`, `/ship`, `/verify`, etc.) were retired — use the prefixed form.

Canonical command definitions live in `content/commands/`, mirrored to `.claude/commands/` and `.opencode/commands/ai-eng/` by the build.

## Spec-Driven Workflow

- `/ai-eng/research` - multi-phase research and discovery
- `/ai-eng/spec` - feature/spec generation
- `/ai-eng/plan` - implementation planning
- `/ai-eng/work` - guided execution with quality gates
- `/ai-eng/verify` - lint, typecheck, test, build verification loop
- `/ai-eng/review` - multi-perspective code review
- `/ai-eng/deep-review` - all four review axes in parallel (most thorough)
- `/ai-eng/ralph-wiggum` - iterative full-cycle workflow

## Plugin Development

- `/ai-eng/create-plugin` - end-to-end plugin creation workflow
- `/ai-eng/create-agent` - create a new agent
- `/ai-eng/create-command` - create a new command
- `/ai-eng/create-skill` - create a new skill
- `/ai-eng/create-tool` - create a new OpenCode tool

## Shipping and Deployment

- `/ai-eng/ship` - deploy to production with confidence
- `/ai-eng/deploy` - pre-deployment verification and Coolify deployment

## Code Quality

- `/ai-eng/simplify` - review and fix recently changed files for reuse, quality, and efficiency

## Learning and Knowledge

- `/ai-eng/decision-journal` - record durable decisions and tradeoffs
- `/ai-eng/quality-gate` - define file-backed quality gates
- `/ai-eng/maintenance-review` - capture recurring maintenance reviews
- `/ai-eng/learning-approve` - OpenCode-only approval for the active learning recommendation
- `/ai-eng/learning-dismiss` - OpenCode-only dismissal for the active learning recommendation
- `/ai-eng/learning-snooze` - OpenCode-only snooze for the active learning recommendation

## Audit and Orchestration

- `/ai-eng/repo-audit` - principal-engineer repo audit and improvement plan (analysis only)
- `/ai-eng/orchestrate` - multi-agent coordination for cross-domain tasks
- `/ai-eng/dynamic-task` - tiered model routing for tasks
- `/ai-eng/cook-status` - list active cooking-routines loops (prunes stale markers)

## Context and Utilities

- `/ai-eng/context` - session state and context engineering
- `/ai-eng/init` - initialize ai-eng-system in a project

## SEO

- `/ai-eng/seo` - technical SEO and Core Web Vitals review (agent-backed, `seo-specialist`)
- `ai-eng workflow run seo-review --runtime <runtime> "https://url"` - portable SEO audit via SDK runners (anthropic, codex, cursor, opencode, pi); writes dated report to `.ai-eng/reports/`

## Legacy Surface

`packages/core/content/commands/` contains a larger legacy catalog (`/ai-eng/specify`, `/ai-eng/coolify`, `/ai-eng/docker`, `/ai-eng/k8s`, `/ai-eng/security-scan`, etc.). These are **not shipped** in the root build surface (`dist/.opencode/command/ai-eng/`) and should not be referenced as available commands.

See `docs/reference/workflow-surface-matrix.md` for the complete command-to-skill mapping.

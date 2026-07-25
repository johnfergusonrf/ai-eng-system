# AI Engineering Agents

## Agent Coordination

See **[CLAUDE.md](./CLAUDE.md)** — Project philosophy and core guidelines that guide all agent behavior.

This document defines the **agents and tools** available in this system. For the guiding **philosophy**, refer to CLAUDE.md.

## Agent Coordination

| Agent | Mode | Purpose |
|-------|------|---------|
| plan | read-only | Research + planning (no edits) |
| build | edit | Implements changes |
| review | read-only | Code review |

## Specialized Agents (46 Total)

Canonical source: `content/agents/` (mirrored to `.claude/agents/` and `.opencode/agents/` by the build).

### Architecture & Planning
- `architect-advisor` - System architecture decisions and trade-off analysis
- `backend-architect` - Backend system design and scalability
- `infrastructure-builder` - Cloud infrastructure design and IaC
- `aws-architect` - AWS service selection, cloud architecture, and Well-Architected guidance
- `claude-planner-agent` - Feature planning and task decomposition (Claude router)

### Development & Coding
- `frontend-reviewer` - Frontend code review (React, TypeScript, accessibility)
- `full-stack-developer` - End-to-end application development
- `api-builder-enhanced` - REST/GraphQL API development with documentation
- `database-optimizer` - Database performance and query optimization
- `java-pro` - Java development with modern features and patterns
- `mobile-developer` - iOS, Android, React Native, and Flutter development
- `data-engineer` - Data pipelines, warehousing, and streaming systems
- `documentation-specialist` - Comprehensive technical documentation generation
- `docs-writer` - Concise product and feature documentation
- `claude-work-agent` - Implementation and code changes (Claude router)
- `claude-refactor-agent` - Code refactoring and restructuring (Claude router)
- `claude-lookup-agent` - Fast lookups and fact retrieval (Claude router)

### Quality & Testing
- `code-reviewer` - Comprehensive code quality assessment
- `test-generator` - Automated test suite generation
- `security-scanner` - Security vulnerability detection and fixes
- `performance-engineer` - Application performance optimization
- `plugin-validator` - Plugin structure validation and best practices
- `text-cleaner` - AI-generated verbosity cleanup and content tightening
- `claude-debugger-agent` - Systematic debugging and error recovery (Claude router)

### DevOps & Operations
- `deployment-engineer` - CI/CD pipeline design and deployment automation
- `monitoring-expert` - Observability, alerting, and system monitoring
- `cost-optimizer` - Cloud cost optimization and resource efficiency
- `ci-watcher` - PR CI monitoring and failure reporting

### AI & Machine Learning
- `ai-engineer` - AI integration and LLM application development
- `ml-engineer` - Machine learning model development and deployment
- `prompt-optimizer` - Prompt tightening into task/context/constraint/output/verification contracts
- `agent-developer` - MCP, A2A, tool calling, and multi-agent orchestration

### Content & SEO
- `seo-specialist` - Technical and on-page SEO expertise

### Plugin Development
- `agent-creator` - AI-assisted agent generation
- `command-creator` - AI-assisted command generation
- `skill-creator` - AI-assisted skill creation
- `tool-creator` - AI-assisted custom tool creation

### Coordination
- `subagent-orchestration` - Routes work to the most appropriate specialist agent
- `claude-conductor` - Intent-based dispatch to Claude-powered subagents

### Review & Validation
- `review` - Multi-axis review orchestrator (dispatches code-reviewer, security-scanner, architect-advisor, performance-engineer)
- `repo-audit-review` - Principal-engineer repository audit and improvement plan
- `compatibility-scan-review` - Agent compatibility validation
- `docs-reliability-review` - Documentation accuracy and freshness review
- `startup-review` - Cold-start bootstrap path validation
- `validation-review` - End-to-end validation and verification

### Learning & Memory
- `agents-memory-updater` - Memory and AGENTS.md updates from session transcripts

## Prompt Contracts

Subagent and command prompts follow a single contract enforced by the `prompt-refinement` skill: an explicit **Task, Context, Constraints, Output, Verification**. The contract favors testable constraints and the shortest output that carries the result. It deliberately avoids persona theater, emotional stakes, and challenge framing — on current frontier models those add noise and token cost without changing the output.

## Usage Examples

### Spec-Driven Workflow
```
# Complete spec-driven development with ai-eng-system
/ai-eng/research "authentication patterns"      # Gather context
/ai-eng/spec "user authentication"        # Create specification
/ai-eng/plan --from-spec=specs/auth     # Create implementation plan
/ai-eng/work "specs/auth/plan"              # Execute with quality gates
/ai-eng/review                               # Multi-agent code review
```

### Using prompt-refinement skill
The prompt-refinement skill is automatically invoked by:
- `/ai-eng/research` - Clarifies research scope and depth
- `/ai-eng/spec` - Clarifies user stories and requirements
- `/ai-eng/plan` - Clarifies technical approach and constraints
- `/ai-eng/work` - Clarifies execution context and quality requirements

### Using prompt-optimizer
```
Ask the prompt-optimizer to enhance: "Help me fix this slow database query"
```

## Prompt Optimization

The `prompt-optimize` tool (OpenCode) and `/optimize` command restructure a prompt into an explicit **Task, Context, Constraints, Output, Verification** contract via the `prompt-refinement` skill. They add information that changes execution — testable constraints, exact output shape, verification steps — and strip filler the model already follows by default. They do not inject personas, stakes language, or challenge framing: on current frontier models those add token cost without reliably improving output.

### Usage

```bash
/optimize "help me debug this error"            # Structure a prompt
/optimize-verbosity quiet|normal|verbose         # Change verbosity
```

Escape hatch: prefix a prompt with `!` to skip optimization.

### Configuration

Customize via `.claude/ai-eng-config.json` (Claude Code) or `opencode.json` / `ai-eng-config.json` (OpenCode):

```json
{
  "promptOptimization": {
    "enabled": true,
    "autoApprove": false,
    "verbosity": "normal",
    "skipForSimplePrompts": true,
    "escapePrefix": "!"
  }
}
```

### Verification

```bash
cat docs/prompt-optimization-verification.md
```

### Using recursive-init
```
Run recursive-init on a monorepo: /recursive-init --dry-run --estimate-cost
```

### Using enhanced agents
```
Use the architect-advisor to evaluate: Should we use microservices or a monolith?
```

## Selected Skills

The table below highlights the most important lifecycle and alignment skills. The repository also contains additional namespaced and platform-specific skills under `skills/`.

 | Skill | Location | Purpose |
|-------|----------|---------|
| comprehensive-research | skills/comprehensive-research/ | Multi-phase research orchestration |
| code-review-and-quality | skills/code-review-and-quality/ | Multi-axis review before merge |
| code-simplification | skills/code-simplification/ | Behavior-preserving code simplification |
| coolify-deploy | skills/coolify-deploy/ | Coolify deployment best practices |
| debugging-and-error-recovery | skills/debugging-and-error-recovery/ | Root-cause debugging workflow |
| git-worktree | skills/git-worktree/ | Git worktree workflow |
| incremental-implementation | skills/incremental-implementation/ | Thin-slice implementation discipline |
| prompt-refinement | skills/prompt-refinement/ | TCRO structuring with phase-specific clarification |
| knowledge-architecture | skills/knowledge-architecture/ | Static-first knowledge architecture and learning workflows |
| plugin-dev | skills/plugin-dev/ | Plugin development knowledge base |
| using-agent-skills | skills/using-agent-skills/ | Decision tree for task-to-skill mapping |
| continuous-learning | skills/continuous-learning/ | Instinct-based learning with confidence scoring and AGENTS.md memory updates |
| verification-loop | skills/verification-loop/ | Continuous verification after every change |
| eval-harness | skills/eval-harness/ | Agent evaluation framework |
| context-budget | skills/context-budget/ | Context window management |

## Key Commands

| Command | Description | Agent Mode |
|---------|-------------|------------|
| /ai-eng/research | Multi-phase research orchestration | read-only |
| /ai-eng/spec | Create feature specifications | read-only |
| /ai-eng/plan | Create detailed implementation plans | read-only |
| /ai-eng/work | Execute plans with quality gates and tracking | build |
| /ai-eng/verify | Lint, typecheck, test, build verification loop | build |
| /ai-eng/review | Multi-perspective code review | read-only |
| /ai-eng/deep-review | All four review axes in parallel (most thorough) | read-only |
| /ai-eng/simplify | Review and fix recently changed files | build |
| /ai-eng/ralph-wiggum | Full-cycle feature development with continuous iteration through all spec-driven workflow phases | build |
| /ai-eng/ship | Deploy to production with confidence | build |
| /ai-eng/deploy | Pre-deployment checklist and deployment workflows | build |
| /ai-eng/context | Context management and retrieval | read-only |
| /ai-eng/init | Initialize ai-eng-system configuration | build |
| /ai-eng/create-plugin | Guided plugin creation workflow | build |
| /ai-eng/create-agent | AI-assisted agent generation | build |
| /ai-eng/create-command | AI-assisted command generation | build |
| /ai-eng/create-skill | AI-assisted skill creation | build |
| /ai-eng/create-tool | AI-assisted tool creation | build |
| /ai-eng/decision-journal | Record durable decisions | build |
| /ai-eng/quality-gate | Define file-backed quality gates | build |
| /ai-eng/maintenance-review | Review drift and maintenance debt | read-only |
| /ai-eng/repo-audit | Principal-engineer repo audit and improvement plan | read-only |
| /ai-eng/orchestrate | Multi-agent coordination for cross-domain tasks | build |
| /ai-eng/dynamic-task | Tiered model routing for tasks | build |
| /ai-eng/seo | SEO audit on a page or site | read-only |
| /ai-eng/cook-status | List active cooking-routines loops | read-only |
| /ai-eng/learning-approve | Approve active learning recommendation | build |
| /ai-eng/learning-dismiss | Dismiss active learning recommendation | build |
| /ai-eng/learning-snooze | Snooze active learning recommendation | build |

See `docs/reference/commands.md` for the full 29-command inventory.

### Lifecycle Mapping

This repository keeps the `ai-eng/*` command namespace, but its main workflow now maps more clearly to the lifecycle used by `agent-skills`:

| ai-eng-system | Common lifecycle name |
|---------------|-----------------------|
| `/ai-eng/spec` | `/spec` |
| `/ai-eng/plan` | `/plan` |
| `/ai-eng/work` | `/build` |
| `/ai-eng/review` | `/review` |

### Using /research

The research command orchestrates multiple agents for thorough investigation:

```bash
# Basic research
/ai-eng/research "How does authentication work in this codebase?"

# Research with specific scope
/ai-eng/research "Analyze payment processing" --scope=codebase --depth=deep

# Research from ticket
/ai-eng/research --ticket="docs/tickets/AUTH-123.md"
```

**Research Phases:**
1. **Discovery** (Parallel): codebase-locator, research-locator, codebase-pattern-finder
2. **Analysis** (Sequential): codebase-analyzer, research-analyzer
3. **Synthesis**: Consolidated findings with evidence and recommendations

## New Additions from External Repositories

### References (from addyosmani/agent-skills)
Located in `references/`, loaded on-demand by skills:

| Reference | Purpose |
|-----------|---------|
| `testing-patterns.md` | Test structure, naming, mocking, React/API/E2E examples |
| `security-checklist.md` | Pre-commit checks, OWASP Top 10, secrets management |
| `performance-checklist.md` | Core Web Vitals, frontend/backend checklists |
| `accessibility-checklist.md` | Keyboard nav, screen readers, WCAG 2.1 AA |
| `orchestration-patterns.md` | 5 endorsed + 4 anti-pattern orchestration approaches |

### Rules (from everything-claude-code)
Located in `rules/`, always-follow guidelines per language:

| Rule Pack | Purpose |
|-----------|---------|
| `common/rules.md` | Language-agnostic principles |
| `typescript/rules.md` | Type safety, async, React, module system |
| `python/rules.md` | Type hints, async, PEP 8, error handling |
| `golang/rules.md` | Error handling, concurrency, interfaces |

### Contexts (from everything-claude-code)
Located in `contexts/`, dynamic system prompt injection:

| Context | Purpose |
|---------|---------|
| `dev.md` | Development mode principles and tool preferences |
| `review.md` | Code review mode with five-axis review process |
| `research.md` | Research mode with read-only analysis patterns |

### Hooks (from addyosmani/agent-skills)
Located in `hooks/`, session lifecycle automations:

| Hook | Event | Purpose |
|------|-------|---------|
| `session-start.sh` | SessionStart | Load project context and skill count |
| `hooks.json` | Configuration | Hook definitions and conditions |

### New Skills (from both repos)

| Skill | Source | Purpose |
|-------|--------|---------|
| `using-agent-skills` | agent-skills | Decision tree for task-to-skill mapping |
| `continuous-learning` | everything-claude-code + cursor/plugins | Instinct-based learning, memory updates, skill evolution |
| `verification-loop` | everything-claude-code | Continuous verification after every change |
| `eval-harness` | everything-claude-code | Agent evaluation framework |
| `context-budget` | everything-claude-code | Context window management |

### Multi-Platform Setup Guides (from addyosmani/agent-skills)
Located in `docs/`:

| Guide | Platform |
|-------|----------|
| `cursor-setup.md` | Cursor IDE |
| `gemini-cli-setup.md` | Google Gemini CLI |
| `windsurf-setup.md` | Windsurf IDE |
| `copilot-setup.md` | GitHub Copilot |
| `kiro-setup.md` | Kiro IDE |

### MCP Configurations (from everything-claude-code)
Located in `mcp-configs/mcp-servers.json`:
- Pre-configured MCP servers for GitHub, Supabase, Vercel, Railway, Slack, Sentry, Cloudflare, Puppeteer, Playwright, Context7, Sequential Thinking, and Filesystem.

## Directory Context Index

| Directory | Hierarchy Level | Purpose | Key Files |
|-----------|-----------------|---------|-----------|
| `packages/cli/` | Core Implementation | Shipped CLI/runtime TypeScript source | `src/execution/`, `src/context/` |
| `agents/` | Runner Packages | Multi-SDK agent runners | `research-runner/`, `seo-review-runner/` |
| `tests/` | Quality Assurance | Comprehensive test suite | `unit.test.ts`, `integration.test.ts`, `performance.test.ts` |
| `docs/` | Knowledge Base | Documentation and research | `reference/`, `research-command-guide.md` |
| `.claude/` | Command Implementation | Claude Code command definitions | `commands/*.md` |
| `content/` | Agent & Command Source | Canonical agent/command definitions | `agents/`, `commands/` |
| `skills/` | Skill Definitions | Modular skill definitions (76 core skills) | `*/SKILL.md` |
| `scripts/` | Build Utilities | Build & installation utilities | `install.js` |

## Build Commands

```bash
# Main build process
bun run build

# Development with watch mode  
bun run build:watch

# Clean build artifacts
bun run clean

# Validate build
bun run validate

# Local CI gates (CI runs locally, not in GitHub Actions)
bun run verify        # Fast gate: typecheck, lint, skill format/evals, fast tests
bun run verify:slow   # Slow gate: performance, learning-automation, integration tests
bun run verify:all    # Both gates + full test suite

# Installation
bun run install:global  # Global install (all supported harnesses)
bun run install:local    # Local install into the current project
```

### Install targets

| Harness | Global target | What is installed |
|---------|---------------|-------------------|
| OpenCode | `~/.config/opencode/` | commands, agents, skills, tools (`*.md`) |
| Claude Code | `~/.claude/hooks/` + marketplace | hooks; agents/commands/skills ship via the `ai-eng-marketplace` plugin |
| Codex | `~/.codex/agents/` + `~/.agents/skills/` | curated core agents as `*.toml` subagents; skills + one `ai-eng-<cmd>` skill per command (Codex has no command surface) |

`install:local` mirrors the same layout under the project root (`.opencode/`, `.claude/hooks/`, `.codex/agents/`, `.agents/skills/`).

## Task Management with TODO.md

The project uses **TODO.md** as the central task management system. This file tracks:

### Task Categories
- **High Priority** - Critical items requiring immediate attention
- **Medium Priority** - Important items for next iteration
- **Low Priority** - Nice-to-have enhancements
- **Completed Tasks** - Historical record of completed work

### Using TODO.md

1. **Check current tasks** before starting work:
   ```bash
   # Read TODO.md to understand what needs attention
   ```

2. **Update task status** when working on items:
   - Mark tasks as `[x]` when completed
   - Move tasks between priority levels as needed
   - Add new tasks as they arise

3. **Reference TODO.md in agent workflows**:
   - When using `/ai-eng/work`, check TODO.md for related tasks
   - When using `/ai-eng/research`, consider TODO.md items that need context
   - After completing work, update TODO.md to reflect progress

### TODO Integration with Agents

The TODO system integrates with agent workflows:

- **plan mode agents** can reference TODO.md for planning context
- **build mode agents** should check TODO.md for implementation priorities
- **review mode agents** can verify TODO items are properly addressed

### Maintaining TODO.md

Keep TODO.md current by:
- Reviewing and updating task priorities regularly
- Adding detailed notes when tasks are completed
- Using consistent formatting for task descriptions
- Including version information and dates in headers

## Research References

The earlier "incentive prompting" apparatus (persona/stakes/challenge techniques, cited to Bsharat, Yang/OPRO, Li, Kong) was retired: the `prompt-refinement` skill that replaces it deliberately avoids those techniques, since on current frontier models they add token cost without reliably improving output. The underlying prompt-contract approach is documented in the `prompt-refinement` skill.

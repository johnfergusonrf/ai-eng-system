#!/usr/bin/env node

// scripts/install.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
var __filename2 = fileURLToPath(import.meta.url);
var __dirname2 = path.dirname(__filename2);
var packageRoot = path.dirname(__dirname2);
var NAMESPACE_PREFIX = "ai-eng";
function isClaudeCodeProject(targetDir) {
  if (fs.existsSync(path.join(targetDir, ".claude"))) {
    return true;
  }
  const projectDir = process.env.CLAUDE_PROJECT_DIR;
  if (projectDir && path.resolve(projectDir) === path.resolve(targetDir)) {
    return true;
  }
  return true;
}
function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}
async function copyDirRecursive(src, dest) {
  const stat = await fs.promises.stat(src);
  if (stat.isDirectory()) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src);
    for (const entry of entries) {
      await copyDirRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    await fs.promises.copyFile(src, dest);
  }
}
async function backupHooksDir(hooksDir) {
  if (!fs.existsSync(hooksDir)) {
    return null;
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = `${hooksDir}.backup-${timestamp}`;
  try {
    await copyDirRecursive(hooksDir, backupDir);
    return backupDir;
  } catch (error) {
    throw new Error(`Failed to backup existing hooks: ${error instanceof Error ? error.message : String(error)}`);
  }
}
async function installClaudeHooks(targetDir, silent = false) {
  const hookSourceCandidates = [
    path.join(packageRoot, "dist", ".claude-plugin", "hooks"),
    path.join(packageRoot, ".claude", "hooks"),
    path.join(packageRoot, "plugins", "ai-eng-system", "hooks")
  ];
  const canonicalHooksDir = hookSourceCandidates.find((d) => fs.existsSync(d)) ?? null;
  const targetHooksDir = path.join(targetDir, ".claude", "hooks");
  if (!canonicalHooksDir) {
    if (!silent) {
      console.log("  ℹ️  No hook sources found (run `bun run build`) (skip)");
    }
    return;
  }
  const isClaudeProject = isClaudeCodeProject(targetDir);
  if (!isClaudeProject && !silent) {
    console.log("  ℹ️  Not a Claude Code project, installing hooks anyway...");
  }
  if (fs.existsSync(targetHooksDir)) {
    if (!silent) {
      console.log("  \uD83D\uDCE6 Backing up existing hooks...");
    }
    const backupDir = await backupHooksDir(targetHooksDir);
    if (backupDir && !silent) {
      console.log(`    ✓ Backed up to: ${path.basename(backupDir)}`);
    }
  }
  await fs.promises.mkdir(targetHooksDir, { recursive: true });
  const NON_HOOK_PATTERNS = [/^test_/i, /\.md$/i];
  const isHookFile = (name) => !NON_HOOK_PATTERNS.some((re) => re.test(name));
  try {
    const entries = await fs.promises.readdir(canonicalHooksDir, {
      withFileTypes: true
    });
    for (const entry of entries) {
      const src = path.join(canonicalHooksDir, entry.name);
      const dest = path.join(targetHooksDir, entry.name);
      if (entry.isDirectory()) {
        await copyDirRecursive(src, dest);
      } else if (entry.isFile() && isHookFile(entry.name)) {
        await fs.promises.copyFile(src, dest);
      }
    }
  } catch (error) {
    throw new Error(`Failed to copy hooks: ${error instanceof Error ? error.message : String(error)}`);
  }
  const copiedFiles = [];
  async function countFiles(dir, baseDir = dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await countFiles(fullPath, baseDir);
      } else if (entry.isFile()) {
        const relPath = path.relative(baseDir, fullPath);
        copiedFiles.push(relPath);
      }
    }
  }
  await countFiles(targetHooksDir);
  if (!silent) {
    console.log(`  ✓ Installed ${copiedFiles.length} hook file(s) to .claude/hooks/`);
    console.log("    \uD83D\uDCDD Hooks load project context and log skill usage for the health loop");
    console.log("    \uD83D\uDEAB Use '!' prefix to skip optimization for specific prompts");
  }
}
function syncWithManifest(opts) {
  const { srcDir, tgtDir, manifestName, fileFilter, silent, label } = opts;
  if (!fs.existsSync(srcDir))
    return 0;
  const current = new Set(fs.readdirSync(srcDir, { withFileTypes: true }).filter((e) => e.isDirectory() ? true : fileFilter(e.name)).map((e) => e.name));
  const manifestPath = path.join(tgtDir, manifestName);
  if (fs.existsSync(manifestPath)) {
    const prev = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    for (const name of prev) {
      if (!current.has(name)) {
        fs.rmSync(path.join(tgtDir, name), {
          recursive: true,
          force: true
        });
        if (!silent)
          console.log(`  \uD83E\uDDF9 Removed stale ${label} ${name}`);
      }
    }
  }
  fs.mkdirSync(tgtDir, { recursive: true });
  for (const name of current) {
    copyRecursive(path.join(srcDir, name), path.join(tgtDir, name));
  }
  fs.writeFileSync(manifestPath, JSON.stringify([...current], null, 2));
  return current.size;
}
function installCodex(codexRoot, agentsRoot, silent = false) {
  const distCodexAgents = path.join(packageRoot, "dist", ".codex", "agents");
  const distSharedSkills = path.join(packageRoot, "dist", ".agents", "skills");
  const agentCount = syncWithManifest({
    srcDir: distCodexAgents,
    tgtDir: path.join(codexRoot, "agents"),
    manifestName: ".ai-eng-manifest.json",
    fileFilter: (n) => n.endsWith(".toml"),
    silent,
    label: "codex agent"
  });
  if (!silent && agentCount > 0) {
    console.log(`  ✓ codex/agents/ (${agentCount} agents)`);
  }
  const skillCount = syncWithManifest({
    srcDir: distSharedSkills,
    tgtDir: path.join(agentsRoot, "skills"),
    manifestName: ".ai-eng-manifest.json",
    fileFilter: () => true,
    silent,
    label: "shared skill"
  });
  if (!silent && skillCount > 0) {
    console.log(`  ✓ .agents/skills/ (${skillCount} skills)`);
  }
}
function countFilesRecursive(dir) {
  let n = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory())
      n += countFilesRecursive(p);
    else if (entry.isFile())
      n++;
  }
  return n;
}
function getClaudeOnlyAgentNames() {
  const names = new Set;
  const contentAgents = path.join(packageRoot, "content", "agents");
  if (!fs.existsSync(contentAgents))
    return names;
  for (const entry of fs.readdirSync(contentAgents, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md"))
      continue;
    const text = fs.readFileSync(path.join(contentAgents, entry.name), "utf-8");
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    if (fm && /^harness:\s*claude\s*$/m.test(fm[1])) {
      names.add(entry.name);
    }
  }
  return names;
}
function removeClaudeOnlyAgentsFromOpenCode(targetDir, silent) {
  const claudeOnly = getClaudeOnlyAgentNames();
  if (claudeOnly.size === 0)
    return;
  for (const surface of ["agent", "agents"]) {
    const dir = path.join(targetDir, surface);
    if (!fs.existsSync(dir))
      continue;
    for (const name of claudeOnly) {
      const fp = path.join(dir, name);
      if (fs.existsSync(fp)) {
        fs.rmSync(fp, { force: true });
        if (!silent)
          console.log(`  \uD83E\uDDF9 Removed Claude-only agent ${surface}/${name}`);
      }
    }
  }
}
async function install(targetDir, claudeRoot, codexRoot, agentsRoot, silent = false) {
  if (!silent) {
    console.log(`\uD83D\uDD27 Installing AI Engineering System to ${targetDir}`);
  }
  const distOpenCodeDir = path.join(packageRoot, "dist", ".opencode");
  if (!fs.existsSync(distOpenCodeDir)) {
    if (!silent) {
      console.error('❌ Error: dist/.opencode not found. Run "bun run build" first.');
    }
    process.exit(1);
  }
  for (const sub of ["agent", "agents", "command", "commands"]) {
    const stale = path.join(targetDir, sub, NAMESPACE_PREFIX);
    if (fs.existsSync(stale)) {
      fs.rmSync(stale, { recursive: true, force: true });
      if (!silent)
        console.log(`  \uD83E\uDDF9 Cleaned stale ${sub}/${NAMESPACE_PREFIX}/`);
    }
  }
  for (const dir of ["skill", "skills"]) {
    const srcDir = path.join(distOpenCodeDir, dir);
    const tgtDir = path.join(targetDir, dir);
    if (!fs.existsSync(srcDir) || !fs.existsSync(tgtDir))
      continue;
    const srcSet = new Set(fs.readdirSync(srcDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name));
    for (const entry of fs.readdirSync(tgtDir, { withFileTypes: true })) {
      if (!entry.isDirectory())
        continue;
      if (!srcSet.has(entry.name)) {
        fs.rmSync(path.join(tgtDir, entry.name), {
          recursive: true,
          force: true
        });
        if (!silent)
          console.log(`  \uD83E\uDDF9 Cleaned removed skill ${dir}/${entry.name}/`);
      }
    }
  }
  const surfaces = [
    { dir: "command", label: "commands", log: true },
    { dir: "commands", label: "commands", log: false },
    { dir: "agent", label: "agents", log: true },
    { dir: "agents", label: "agents", log: false },
    { dir: "skills", label: "skills", log: true },
    { dir: "tool", label: "tools", log: true },
    { dir: "tools", label: "tools", log: false }
  ];
  for (const { dir, label, log } of surfaces) {
    const src = path.join(distOpenCodeDir, dir);
    if (!fs.existsSync(src))
      continue;
    copyRecursive(src, path.join(targetDir, dir));
    if (log && !silent) {
      const n = countFilesRecursive(src);
      console.log(`  ✓ ${dir}/ (${n} ${label})`);
    }
  }
  const legacySkillDir = path.join(targetDir, "skill");
  if (fs.existsSync(legacySkillDir)) {
    fs.rmSync(legacySkillDir, { recursive: true, force: true });
    if (!silent)
      console.log("  \uD83E\uDDF9 Removed legacy skill/ (skills live in skills/)");
  }
  removeClaudeOnlyAgentsFromOpenCode(targetDir, silent);
  await installClaudeHooks(claudeRoot, silent);
  installCodex(codexRoot, agentsRoot, silent);
  if (!silent) {
    console.log(`
✅ Installation complete!`);
    console.log(`   Namespace: ${NAMESPACE_PREFIX}`);
  }
}
async function main() {
  const args = process.argv.slice(2);
  const isLocal = args.includes("--local") || args.includes("-l");
  const silent = process.env.npm_lifecycle_event === "postinstall";
  const homeDir = process.env.HOME || process.env.USERPROFILE || "";
  let openCodeTarget;
  let claudeRoot;
  let codexRoot;
  let agentsRoot;
  if (isLocal) {
    openCodeTarget = path.join(process.cwd(), ".opencode");
    claudeRoot = process.cwd();
    codexRoot = path.join(process.cwd(), ".codex");
    agentsRoot = path.join(process.cwd(), ".agents");
  } else {
    openCodeTarget = path.join(homeDir, ".config", "opencode");
    claudeRoot = homeDir;
    codexRoot = path.join(homeDir, ".codex");
    agentsRoot = path.join(homeDir, ".agents");
  }
  if (!silent) {
    console.log(`\uD83D\uDD27 Installing AI Engineering System (${isLocal ? "project-local" : "global"})`);
    console.log(`   OpenCode -> ${openCodeTarget}`);
    console.log(`   Claude   -> ${path.join(claudeRoot, ".claude", "hooks")}`);
    console.log(`   Codex    -> ${path.join(codexRoot, "agents")}`);
    console.log(`   Skills   -> ${path.join(agentsRoot, "skills")}`);
  }
  await install(openCodeTarget, claudeRoot, codexRoot, agentsRoot, silent);
}
main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`
❌ Installation failed: ${message}`);
  process.exit(1);
});

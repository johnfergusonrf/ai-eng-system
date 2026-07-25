#!/usr/bin/env bun

import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const PACKAGE_JSON_PATH = join(ROOT, "package.json");

function readScripts(): Record<string, string> {
    const pkg = JSON.parse(readFileSync(PACKAGE_JSON_PATH, "utf-8"));
    return pkg.scripts ?? {};
}

describe("Local CI gates", () => {
    it("should define a fast quality gate (verify) covering the old CI workflow steps", () => {
        const scripts = readScripts();
        const verify = scripts.verify ?? "";
        expect(verify).toContain("bun run typecheck");
        expect(verify).toContain("bun run lint");
        expect(verify).toContain("format:skills");
        expect(verify).toContain("lint:skill-evals");
        expect(verify).toContain("tests/unit.test.ts");
        expect(verify).toContain("tests/build.test.ts");
    });

    it("should define a slow-test gate (verify:slow) covering the old nightly workflow steps", () => {
        const scripts = readScripts();
        const verifySlow = scripts["verify:slow"] ?? "";
        expect(verifySlow).toContain("tests/performance.test.ts");
        expect(verifySlow).toContain("tests/learning-automation.test.ts");
        expect(verifySlow).toContain("tests/integration.test.ts");
    });

    it("should not rely on GitHub Actions for CI builds", () => {
        // CI quality gates run locally (verify / verify:slow); GitHub
        // Actions is reserved for releases, marketplace sync, and skill
        // health. The old ci.yml / nightly.yml workflows were removed.
        const scripts = readScripts();
        expect(scripts.verify).toBeDefined();
        expect(scripts["verify:slow"]).toBeDefined();
        expect(scripts["verify:all"]).toBeDefined();
    });
});

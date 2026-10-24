// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const json = (path: string) => JSON.parse(readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8"));

describe("release", () => {
  it("gives Owlbear's manifest the package's version", () => {
    expect(json("../public/manifest.json").version).toBe(json("../package.json").version);
  });
});

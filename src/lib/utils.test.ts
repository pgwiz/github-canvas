import { expect, test, describe } from "bun:test";
import { cn } from "./utils";

describe("cn utility", () => {
  test("merges multiple class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  test("handles empty input", () => {
    expect(cn()).toBe("");
  });

  test("handles empty strings", () => {
    expect(cn("a", "", "b")).toBe("a b");
  });

  test("handles conditional classes", () => {
    expect(cn("base", true && "active", false && "hidden")).toBe("base active");
  });

  test("handles arrays of classes", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  test("handles objects of classes", () => {
    expect(cn({ "a": true, "b": false, "c": true })).toBe("a c");
  });

  test("handles null, undefined, and boolean values", () => {
    expect(cn("a", null, undefined, true, false, "b")).toBe("a b");
  });

  test("merges tailwind classes (last one wins for same category)", () => {
    // Note: This relies on the stubbed twMerge behavior in node_modules for testing environment
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  test("preserves non-conflicting tailwind classes", () => {
    const result = cn("p-2", "bg-red-500");
    expect(result).toContain("p-2");
    expect(result).toContain("bg-red-500");
  });
});

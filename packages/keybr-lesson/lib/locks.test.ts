import { test } from "node:test";
import { Letter } from "@keybr/phonetic-model";
import { Settings } from "@keybr/settings";
import { deepEqual } from "rich-assert";
import {
  formatManualLocks,
  lockAllKeys,
  lockKey,
  parseManualLocks,
  unlockKey,
} from "./locks.ts";
import { lessonProps } from "./settings.ts";

test("parseManualLocks - empty string", () => {
  const result = parseManualLocks("");
  deepEqual(result, new Set());
});

test("parseManualLocks - comma-separated code points", () => {
  const result = parseManualLocks("97,98,99");
  deepEqual(result, new Set([97, 98, 99]));
});

test("parseManualLocks - ignore non-numeric values", () => {
  const result = parseManualLocks("97,abc,99");
  deepEqual(result, new Set([97, 99]));
});

test("parseManualLocks - handle whitespace", () => {
  const result = parseManualLocks("97, 98 , 99");
  deepEqual(result, new Set([97, 98, 99]));
});

test("parseManualLocks - single value", () => {
  const result = parseManualLocks("97");
  deepEqual(result, new Set([97]));
});

test("formatManualLocks - empty Set", () => {
  const result = formatManualLocks(new Set());
  deepEqual(result, "");
});

test("formatManualLocks - sorted comma-separated string", () => {
  const result = formatManualLocks(new Set([99, 97, 98]));
  deepEqual(result, "97,98,99");
});

test("formatManualLocks - single value", () => {
  const result = formatManualLocks(new Set([97]));
  deepEqual(result, "97");
});

test("formatManualLocks - already sorted values", () => {
  const result = formatManualLocks(new Set([97, 98, 99]));
  deepEqual(result, "97,98,99");
});

test("lockKey - add key to empty locks", () => {
  const settings = new Settings().set(lessonProps.guided.manualLocks, "");
  const result = lockKey(settings, 97);
  deepEqual(result.get(lessonProps.guided.manualLocks), "97");
});

test("lockKey - add key to existing locks", () => {
  const settings = new Settings().set(lessonProps.guided.manualLocks, "98,99");
  const result = lockKey(settings, 97);
  deepEqual(result.get(lessonProps.guided.manualLocks), "97,98,99");
});

test("lockKey - handle duplicate key gracefully", () => {
  const settings = new Settings().set(lessonProps.guided.manualLocks, "97,98");
  const result = lockKey(settings, 97);
  // Set deduplicates, so result should still be sorted
  deepEqual(result.get(lessonProps.guided.manualLocks), "97,98");
});

test("unlockKey - remove key from locks", () => {
  const settings = new Settings().set(
    lessonProps.guided.manualLocks,
    "97,98,99",
  );
  const result = unlockKey(settings, 98);
  deepEqual(result.get(lessonProps.guided.manualLocks), "97,99");
});

test("unlockKey - remove only key", () => {
  const settings = new Settings().set(lessonProps.guided.manualLocks, "97");
  const result = unlockKey(settings, 97);
  deepEqual(result.get(lessonProps.guided.manualLocks), "");
});

test("unlockKey - remove non-existent key", () => {
  const settings = new Settings().set(lessonProps.guided.manualLocks, "98,99");
  const result = unlockKey(settings, 97);
  deepEqual(result.get(lessonProps.guided.manualLocks), "98,99");
});

test("unlockKey - empty locks", () => {
  const settings = new Settings().set(lessonProps.guided.manualLocks, "");
  const result = unlockKey(settings, 97);
  deepEqual(result.get(lessonProps.guided.manualLocks), "");
});

test("lockAllKeys - lock all keys except first 6", () => {
  // Create mock letters (codePoint, frequency)
  const letters: Letter[] = [];
  for (let i = 0; i < 10; i++) {
    letters.push(new Letter(97 + i, 1.0)); // a, b, c, d, e, f, g, h, i, j
  }

  const result = lockAllKeys(letters);
  const parsed = parseManualLocks(result);

  // First 6 should not be locked (97-102 = a-f)
  deepEqual(parsed.has(97), false);
  deepEqual(parsed.has(98), false);
  deepEqual(parsed.has(99), false);
  deepEqual(parsed.has(100), false);
  deepEqual(parsed.has(101), false);
  deepEqual(parsed.has(102), false);

  // Rest should be locked (103-106 = g-j)
  deepEqual(parsed.has(103), true);
  deepEqual(parsed.has(104), true);
  deepEqual(parsed.has(105), true);
  deepEqual(parsed.has(106), true);
});

test("lockAllKeys - exactly 6 letters", () => {
  const letters: Letter[] = [];
  for (let i = 0; i < 6; i++) {
    letters.push(new Letter(97 + i, 1.0));
  }

  const result = lockAllKeys(letters);
  deepEqual(result, "");
});

test("lockAllKeys - fewer than 6 letters", () => {
  const letters: Letter[] = [];
  for (let i = 0; i < 3; i++) {
    letters.push(new Letter(97 + i, 1.0));
  }

  const result = lockAllKeys(letters);
  deepEqual(result, "");
});

test("lockAllKeys - sorted comma-separated string", () => {
  const letters: Letter[] = [];
  // Create letters with non-sequential code points to test sorting
  const codePoints = [97, 65, 122, 90, 10, 20, 30];
  for (const codePoint of codePoints) {
    letters.push(new Letter(codePoint, 1.0));
  }

  const result = lockAllKeys(letters);
  const parsed = parseManualLocks(result);

  // Should lock everything except first 6 (97, 65, 122, 90, 10, 20)
  // Only 30 should be locked
  deepEqual(parsed.size, 1);
  deepEqual(parsed.has(30), true);
});

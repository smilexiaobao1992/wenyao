import test from "node:test";
import assert from "node:assert/strict";

import {
  buildAiPrompt,
  deriveHexagram,
  lineFromCoins,
  transformChangingLines,
} from "./iching.js";

test("lineFromCoins maps three coin faces to the same 6/7/8/9 line values as the source app", () => {
  assert.equal(lineFromCoins([2, 2, 2]), 6);
  assert.equal(lineFromCoins([2, 2, 3]), 7);
  assert.equal(lineFromCoins([2, 3, 3]), 8);
  assert.equal(lineFromCoins([3, 3, 3]), 9);
});

test("deriveHexagram uses the source King Wen mapping for lower-to-upper six-line bits", () => {
  assert.deepEqual(deriveHexagram([7, 7, 7, 7, 7, 7]), {
    index: 1,
    name: "乾",
    fullName: "乾为天",
    judgment: "元亨利贞",
    meanings: ["刚健中正", "自强不息"],
    pattern: 63,
  });

  assert.deepEqual(deriveHexagram([6, 6, 6, 6, 6, 6]), {
    index: 2,
    name: "坤",
    fullName: "坤为地",
    judgment: "元亨，利牝马之贞",
    meanings: ["厚德载物", "顺势而为"],
    pattern: 0,
  });
});

test("transformChangingLines flips old yin and old yang while preserving young lines", () => {
  assert.deepEqual(transformChangingLines([6, 7, 8, 9, 7, 8]), [7, 7, 8, 8, 7, 8]);
});

test("buildAiPrompt includes original hexagram, changing lines, transformed hexagram, and line names", () => {
  const lines = [6, 7, 8, 9, 7, 8];
  const prompt = buildAiPrompt(lines);

  assert.match(prompt, /本卦：第/);
  assert.match(prompt, /六爻（从下往上）/);
  assert.match(prompt, /初爻：老阴（变） → 动爻/);
  assert.match(prompt, /四爻：老阳（变） → 动爻/);
  assert.match(prompt, /之卦：第/);
  assert.match(prompt, /动爻位置：初爻、四爻/);
});

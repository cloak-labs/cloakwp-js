import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeWordPressBlockStyles } from "../src/blocks/style-adapter";

const alignmentFor = (attrs: Record<string, unknown>) =>
  normalizeWordPressBlockStyles({ name: "core/heading", attrs })["text-align"];

test("uses WordPress typography alignment independently of block width", () => {
  for (const alignment of ["left", "center", "right", "justify"]) {
    const alignmentValue = alignmentFor({
      align: "wide",
      style: { typography: { textAlign: alignment } },
    });
    assert.deepEqual(alignmentValue, { base: alignment });
  }
});

test("normalizes legacy alignment and lets current typography attributes win", () => {
  assert.deepEqual(alignmentFor({ align: "center" }), { base: "center" });
  assert.deepEqual(
    alignmentFor({
      textAlign: "right",
      style: { typography: { textAlign: "center" } },
    }),
    { base: "center" },
  );
});

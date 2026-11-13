import assert from "node:assert/strict";
import { test } from "node:test";
import { applyTypographyExtras } from "../dist/blocks/typographyStyles.js";

test("appearance, indent, columns, and fit text map to classes and inline styles", () => {
  const result = applyTypographyExtras({
    fontWeight: "700",
    textIndent: "1.5em",
    textColumns: 2,
    fitText: true,
  });
  assert.deepEqual(result.classes, [
    "font-bold",
    "has-fit-text",
    "whitespace-nowrap",
  ]);
  assert.deepEqual(result.styles, {
    textIndent: "1.5em",
    columnCount: "2",
    whiteSpace: "nowrap",
  });
});

test("paragraphs do not receive a default text indent", () => {
  assert.deepEqual(applyTypographyExtras({}).styles, {});
  assert.equal(
    applyTypographyExtras({ textIndent: "subsequent" }).styles.textIndent,
    undefined,
  );
});

test("quote weights and extra-black still apply", () => {
  assert.deepEqual(applyTypographyExtras({ fontWeight: "300" }).classes, [
    "font-light",
  ]);
  assert.equal(
    applyTypographyExtras({ fontWeight: "1000" }).styles.fontWeight,
    "1000",
  );
});

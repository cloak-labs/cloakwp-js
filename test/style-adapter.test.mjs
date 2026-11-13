import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createWordPressBlockStyleEngine,
  normalizeWordPressBlockStyles,
  wordpressBreakpointsForViewport,
} from "../dist/blocks/style-adapter.js";

test("normalizes old and current typography and WordPress viewport states", () => {
  const block = {
    name: "core/heading",
    attrs: {
      textAlign: "right",
      align: "wide",
      fontSize: "large",
      style: {
        typography: { textAlign: "center", fontSize: "32px" },
        "@tablet": { typography: { fontSize: "24px" } },
        "@mobile": {
          typography: { textAlign: "left" },
          ":hover": { color: { text: "#123456" } },
        },
      },
    },
  };
  const input = normalizeWordPressBlockStyles(block);
  assert.deepEqual(input["text-align"], {
    base: "center",
    breakpoints: { mobile: "left" },
  });
  assert.deepEqual(input["font-size"], {
    base: "32px",
    breakpoints: { tablet: "24px" },
  });
  assert.deepEqual(input.color, {
    states: { hover: { breakpoints: { mobile: "#123456" } } },
  });
  const output = createWordPressBlockStyleEngine().render(block);
  assert.deepEqual(output.diagnostics, []);
  assert.equal(output.variables["--cms-align--mobile"], "left");
});

test("reports unsupported custom CSS and unresolved presets that survive overrides", () => {
  const engine = createWordPressBlockStyleEngine();
  const block = { name: "core/heading", attrs: {
    fontSize: "obsolete",
    style: { css: "color: red", typography: { fontSize: "var:preset|font-size|missing" } },
  } };
  const output = engine.render(block);
  assert.deepEqual(output.diagnostics.map(({ property, reason, value }) => ({ property, reason, value })), [
    { property: "font-size", reason: "unresolved-preset", value: "font-size|missing" },
    { property: "css", reason: "unsupported-attribute", value: "color: red" },
  ]);
  assert.equal(output.variables["--cms-fs"], "var(--wp--preset--font-size--missing)");
  const allowed = createWordPressBlockStyleEngine({ unresolvedPreset: "allow" }).render(block);
  assert.deepEqual(allowed.diagnostics.map((item) => item.reason), ["unsupported-attribute"]);
  const resolved = createWordPressBlockStyleEngine({ resolvePreset: () => "1rem" }).render({ name: "core/heading", attrs: { fontSize: "large" } });
  assert.deepEqual(resolved.diagnostics, []);
});

test("projects can register custom property capabilities in the WordPress adapter", () => {
  const engine = createWordPressBlockStyleEngine({
    properties: { tracking: { css: "letter-spacing" } },
    resolve: (styles) => ({ ...styles, tracking: "2px" }),
  });
  const output = engine.render({ name: "core/heading", attrs: {} });
  assert.equal(output.variables["--cms-tracking"], "2px");
  assert.match(Object.values(output.rules).join(""), /letter-spacing:var\(--cms-tracking\)/);
});

test("maps CSS values, preset tokens and layered backgrounds", () => {
  const input = normalizeWordPressBlockStyles(
    {
      attrs: {
        style: {
          spacing: {
            padding: { top: "var:preset|spacing|40", bottom: "12px" },
            blockGap: { top: "4px", left: "8px" },
          },
          background: {
            gradient: "linear-gradient(red, blue)",
            backgroundImage: { url: "https://example.com/photo.jpg" },
          },
          border: {
            radius: { topLeft: "8px", bottomRight: "2px" },
            width: "1px",
          },
          dimensions: { minWidth: "20rem" },
        },
      },
    },
    { resolvePreset: (category, slug) => `var(--site-${category}-${slug})` },
  );
  assert.deepEqual(input["padding-top"], { base: "var(--site-spacing-40)" });
  assert.deepEqual(input["padding-bottom"], { base: "12px" });
  assert.deepEqual(input["row-gap"], { base: "4px" });
  assert.deepEqual(input["column-gap"], { base: "8px" });
  assert.deepEqual(input["background-image"], {
    base: 'linear-gradient(red, blue), url("https://example.com/photo.jpg")',
  });
  assert.deepEqual(input["border-top-left-radius"], { base: "8px" });
  assert.deepEqual(input["min-width"], { base: "20rem" });
});

test("preset and background resolvers receive their scope and block context", () => {
  const contexts = [];
  const block = {
    name: "core/group",
    attrs: {
      style: {
        spacing: { margin: { top: "var:preset|spacing|80" } },
        "@mobile": { spacing: { margin: { top: "var:preset|spacing|40" } } },
        background: { backgroundImage: { url: "/photo.jpg" } },
      },
    },
  };
  const input = normalizeWordPressBlockStyles(block, {
    resolvePreset: (category, slug, context) => {
      contexts.push({ category, slug, ...context });
      return `${slug}px`;
    },
    resolveBackgroundImage: (url, context) => {
      assert.equal(context, block);
      return `url("/optimized?src=${encodeURIComponent(url)}")`;
    },
  });
  assert.deepEqual(contexts, [
    {
      category: "spacing",
      slug: "80",
      property: "margin-top",
      breakpoint: undefined,
      state: undefined,
    },
    {
      category: "spacing",
      slug: "40",
      property: "margin-top",
      breakpoint: "mobile",
      state: undefined,
    },
  ]);
  assert.equal(
    input["background-image"].base,
    'url("/optimized?src=%2Fphoto.jpg")',
  );
});

test("single and equal gaps use the shorthand; different or partial axes stay separate", () => {
  const engine = createWordPressBlockStyleEngine();
  const render = (blockGap) =>
    engine.render({ attrs: { style: { spacing: { blockGap } } } });
  assert.deepEqual(render("1.5rem").variables, { "--cms-gap": "1.5rem" });
  assert.deepEqual(render({ top: "4px", left: "4px" }).variables, {
    "--cms-gap": "4px",
  });
  assert.deepEqual(render({ top: "4px", left: "8px" }).variables, {
    "--cms-gap-y": "4px",
    "--cms-gap-x": "8px",
  });
  assert.deepEqual(render({ left: "8px" }).variables, { "--cms-gap-x": "8px" });
  const responsive = engine.render({
    attrs: {
      style: {
        spacing: { blockGap: "12px" },
        "@mobile": { spacing: { blockGap: { left: "4px" } } },
      },
    },
  });
  assert.deepEqual(responsive.variables, {
    "--cms-gap": "12px",
    "--cms-gap-x--mobile": "4px",
  });
});

test("project rules resolve before emission and custom breakpoints are supported", () => {
  const engine = createWordPressBlockStyleEngine({
    breakpoints: [{ name: "mobile", query: "(max-width: 30rem)" }],
    resolve: (style) => ({ ...style, "text-align": "right" }),
  });
  const out = engine.render({
    attrs: {
      style: {
        typography: { textAlign: "left" },
        "@mobile": { typography: { textAlign: "center" } },
      },
    },
  });
  assert.deepEqual(out.variables, { "--cms-align": "right" });
});

test("site CSS defaults suppress redundant markup while explicit overrides remain", () => {
  const engine = createWordPressBlockStyleEngine({
    cssDefaults: (block) =>
      block.name === "core/heading" ? { "text-align": "center" } : {},
  });
  assert.deepEqual(
    engine.render({
      name: "core/heading",
      attrs: { style: { typography: { textAlign: "center" } } },
    }).classes,
    [],
  );
  assert.deepEqual(
    engine.render({
      name: "core/heading",
      attrs: { style: { typography: { textAlign: "left" } } },
    }).classes,
    ["cms-align"],
  );
  assert.deepEqual(
    engine.render({
      name: "core/paragraph",
      attrs: { style: { typography: { textAlign: "center" } } },
    }).classes,
    ["cms-align"],
  );
});

test("grid, visibility, and responsive interaction do not depend on generated WordPress CSS", () => {
  const out = createWordPressBlockStyleEngine().render({
    name: "core/group",
    attrs: {
      layout: { type: "grid", columnCount: 3 },
      metadata: { blockVisibility: { viewport: { mobile: false } } },
      style: {
        "@tablet": { layout: { columnCount: 2 } },
        "@mobile": { ":hover": { color: { text: "red" } } },
      },
    },
  });
  assert.equal(out.variables["--cms-disp"], "grid");
  assert.equal(out.variables["--cms-disp--mobile"], "none");
  assert.equal(
    out.variables["--cms-grid-cols--tablet"],
    "repeat(2, minmax(0, 1fr))",
  );
  assert.equal(out.variables["--cms-fg--mobile--hover"], "red");
});

test("unsupported style fields and invalid values produce diagnostics", () => {
  const out = createWordPressBlockStyleEngine().render({
    attrs: {
      style: {
        typography: { textAlign: "full", unsupported: "value" },
        "@unknown": { color: { text: "red" } },
      },
    },
  });
  assert.deepEqual(
    out.diagnostics.map(({ property, reason }) => [property, reason]),
    [
      ["text-align", "invalid-value"],
      ["typography.unsupported", "unsupported-attribute"],
      ["@unknown", "unsupported-attribute"],
    ],
  );
});

test("WordPress viewport ranges preserve fractional widths and configured units", () => {
  assert.deepEqual(
    wordpressBreakpointsForViewport({ mobile: "30rem", tablet: "50rem" }),
    [
      { name: "tablet", query: "(30rem < width <= 50rem)" },
      { name: "mobile", query: "(width <= 30rem)" },
      { name: "desktop", query: "(width > 50rem)" },
    ],
  );
  assert.deepEqual(wordpressBreakpointsForViewport({ tablet: "40em" }), [
    { name: "tablet", query: "(width <= 40em)" },
    { name: "desktop", query: "(width > 40em)" },
  ]);
  assert.deepEqual(
    wordpressBreakpointsForViewport({ mobile: "500px", tablet: "20rem" }),
    [
      { name: "mobile", query: "(width <= 500px)" },
      { name: "desktop", query: "(width > 500px)" },
    ],
  );
});

test("responsive grid item positioning is emitted as frontend CSS", () => {
  const out = createWordPressBlockStyleEngine().render({
    attrs: {
      style: {
        layout: { columnSpan: 2, columnStart: 3 },
        "@mobile": { layout: { columnSpan: 1 } },
      },
    },
  });
  assert.equal(out.variables["--cms-grid-column"], "span 2");
  assert.equal(out.variables["--cms-grid-column-start"], "3");
  assert.equal(out.variables["--cms-grid-column--mobile"], "span 1");
});

test("link element styles and responsive link hover are normalized", () => {
  const out = createWordPressBlockStyleEngine().render({
    attrs: {
      style: {
        elements: {
          link: {
            color: { text: "red" },
            ":hover": { color: { text: "blue" } },
          },
        },
        "@mobile": {
          elements: { link: { ":hover": { color: { text: "green" } } } },
        },
      },
    },
  });
  assert.equal(out.variables["--cms-link-color"], "red");
  assert.equal(out.variables["--cms-link-hover-color"], "blue");
  assert.equal(out.variables["--cms-link-hover-color--mobile"], "green");
  assert.deepEqual(out.diagnostics, []);
  assert.match(Object.values(out.rules).join(""), /a:hover/);
});

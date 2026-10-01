import assert from "node:assert/strict";
import { test } from "node:test";
import {
  isTrustedWpOrigin,
  previewOriginsMatch,
} from "../dist/editor/acfBlockDecoupledPreview.js";

test("treats local WordPress http and https origins as the same editor", () => {
  assert.equal(
    previewOriginsMatch("https://wp.localhost", "https://wp.localhost"),
    true,
  );
  assert.equal(
    previewOriginsMatch("http://wp.localhost", "https://wp.localhost"),
    true,
  );
  assert.equal(
    previewOriginsMatch("https://wp.localhost", "http://wp.localhost"),
    true,
  );
});

test("rejects a different host even when both origins are trusted", () => {
  assert.equal(
    previewOriginsMatch("https://wp.localhost", "https://staging.pillarlabs.co"),
    false,
  );
  assert.equal(
    previewOriginsMatch("https://evil.test", "https://wp.localhost"),
    false,
  );
});

test("does not treat an empty target origin as a match", () => {
  assert.equal(previewOriginsMatch("https://wp.localhost", null), false);
  assert.equal(previewOriginsMatch("https://wp.localhost", ""), false);
});

test("trusts known WordPress hosts used by local and staging editors", () => {
  assert.equal(isTrustedWpOrigin("https://wp.localhost"), true);
  assert.equal(isTrustedWpOrigin("http://wp.localhost"), true);
  assert.equal(isTrustedWpOrigin("https://hyland02.localhost"), true);
  assert.equal(isTrustedWpOrigin("https://staging.pillarlabs.co"), true);
  assert.equal(isTrustedWpOrigin("https://evil.test"), false);
});

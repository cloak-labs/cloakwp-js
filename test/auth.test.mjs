import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assertMachineAuthNotExposed,
  hasSessionHint,
  resetMachineAuthWarnings,
  resolveMachineAuth,
  wpAdminHandshakePath,
} from "../dist/auth/index.js";

test("prefers application passwords over WP_JWT", () => {
  resetMachineAuthWarnings();
  const basic = resolveMachineAuth({
    applicationUser: "editor",
    applicationPassword: "aaaa bbbb cccc dddd eeee ffff",
    jwt: "legacy-token",
  });
  assert.equal(basic.scheme, "basic");
  assert.match(basic.authorization, /^Basic /);

  const bearer = resolveMachineAuth({ jwt: "legacy-token" });
  assert.equal(bearer.scheme, "bearer");
  assert.equal(bearer.authorization, "Bearer legacy-token");
});

test("throws when machine credentials are used in a browser bundle", () => {
  assert.throws(
    () =>
      assertMachineAuthNotExposed(
        { applicationPassword: "secret" },
        true,
      ),
    /exposing WordPress machine credentials/,
  );
  assert.doesNotThrow(() =>
    assertMachineAuthNotExposed({ applicationPassword: "secret" }, false),
  );
});

test("session hint cookie is paint-only and handshake URLs stay on Next", () => {
  assert.equal(hasSessionHint(""), false);
  assert.equal(hasSessionHint("cloakwp_ui=1"), true);
  assert.equal(
    wpAdminHandshakePath("/wp-admin/edit.php"),
    "/api/cloakwp/auth/wp-admin?path=%2Fwp-admin%2Fedit.php",
  );
});

test("wp-admin paths include subdirectory multisite admin", async () => {
  const { isWpAdminPath } = await import("../dist/auth/session.js");
  assert.equal(isWpAdminPath("/wp-admin"), true);
  assert.equal(isWpAdminPath("/wp-admin/edit.php"), true);
  assert.equal(isWpAdminPath("/hyland02/wp-admin/post.php"), true);
  assert.equal(isWpAdminPath("/wp-admin-not"), false);
  assert.equal(isWpAdminPath("/hyland02/pages"), false);
});

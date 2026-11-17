import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import WPAPI from "@cloakwp/wpapi/fetch/index.js";
import { getPreviewData } from "../dist/preview/getPreviewData.js";

test("loads saved custom post drafts by ID and keeps authorization failures visible", async (t) => {
  const paths = [];
  const draft = {
    id: 42,
    status: "draft",
    blocks_data: ["draft"],
    acf: { layout: "wide" },
  };
  const server = createServer((req, res) => {
    paths.push(req.url);
    assert.equal(req.headers.authorization, "Bearer preview-reader");
    res.setHeader("content-type", "application/json");
    switch (req.url) {
      case "/wp-json/wp/v2/types/project":
        return res.end(
          JSON.stringify({ rest_namespace: "studio/v2", rest_base: "work" }),
        );
      case "/wp-json/studio/v2/work/42":
        return res.end(JSON.stringify(draft));
      case "/wp-json/studio/v2/work/42/autosaves/43":
        return res.end(JSON.stringify({ id: 43, blocks_data: ["autosave"] }));
      case "/wp-json/studio/v2/work/42/autosaves/44":
        res.statusCode = 404;
        return res.end(JSON.stringify({ data: { status: 404 } }));
      case "/wp-json/studio/v2/work/42/revisions/44":
        return res.end(JSON.stringify({ id: 44, blocks_data: ["revision"] }));
      case "/wp-json/studio/v2/work/42/autosaves/45":
        res.statusCode = 403;
        return res.end(JSON.stringify({ data: { status: 403 } }));
      default:
        res.statusCode = 404;
        return res.end(JSON.stringify({ data: { status: 404 } }));
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const wp = new WPAPI({
    endpoint: `http://127.0.0.1:${server.address().port}/wp-json`,
  });
  wp.setHeaders("Authorization", "Bearer preview-reader");

  const params = { postId: "42", postType: "project", apiMethod: "project" };
  assert.deepEqual(
    await getPreviewData({ ...params, revisionId: "" }, wp),
    draft,
  );
  assert.deepEqual(paths.splice(0), [
    "/wp-json/wp/v2/types/project",
    "/wp-json/studio/v2/work/42",
  ]);
  assert.deepEqual(await getPreviewData({ ...params, revisionId: "43" }, wp), {
    ...draft,
    blocks_data: ["autosave"],
  });
  assert.deepEqual(await getPreviewData({ ...params, revisionId: "44" }, wp), {
    ...draft,
    blocks_data: ["revision"],
  });
  await assert.rejects(
    getPreviewData({ ...params, revisionId: "45" }, wp),
    (error) => error.data?.status === 403,
  );
  assert.equal(
    paths.some((p) => p.endsWith("/revisions/45")),
    false,
  );
});

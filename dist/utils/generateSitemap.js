"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSitemap = void 0;
const cloakcms_1 = require("cloakcms");
const generateSitemap = (routes, options) => {
    const { siteUrl } = options ?? {};
    if (!siteUrl)
        throw Error(`A siteUrl was not passed to generateSitemap(), so we bailed.`);
    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${routes
        .map((route) => {
        return `
                  <url>
                      <loc>${(0, cloakcms_1.stripTrailingSlash)(siteUrl)}${route.pathname}</loc>
                      <lastmod>${route.modified}</lastmod>
                  </url>
              `;
    })
        .join("")}
      </urlset>
      `;
};
exports.generateSitemap = generateSitemap;

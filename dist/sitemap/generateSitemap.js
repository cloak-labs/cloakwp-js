import { stripTrailingSlash } from "cloakcms";
export const generateSitemap = (routes, options) => {
    const { siteUrl } = options ?? {};
    if (!siteUrl)
        throw Error(`A siteUrl was not passed to generateSitemap(), so we bailed.`);
    return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${routes
        .map((route) => {
        return `
                  <url>
                      <loc>${stripTrailingSlash(siteUrl)}${stripTrailingSlash(route.pathname)}</loc>
                      <lastmod>${route.modified}Z</lastmod>
                  </url>
              `;
    })
        .join("")}
      </urlset>
      `;
};

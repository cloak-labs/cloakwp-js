import { stripTrailingSlash } from "cloakcms";
import type { SitemapOptions, SitemapRouteObject } from "./types";

export const generateSitemap = (
  routes: SitemapRouteObject[],
  options: SitemapOptions
): string => {
  const { siteUrl } = options ?? {};
  if (!siteUrl)
    throw Error(`A siteUrl was not passed to generateSitemap(), so we bailed.`);

  return `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${routes
            .map((route) => {
              return `
                  <url>
                      <loc>${stripTrailingSlash(siteUrl)}${stripTrailingSlash(
                route.pathname
              )}</loc>
                      <lastmod>${route.modified}${
                route.modified.endsWith("Z") ? "" : "Z"
              }</lastmod>
                  </url>
              `;
            })
            .join("")}
      </urlset>
      `;
};

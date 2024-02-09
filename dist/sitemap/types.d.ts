import { HttpUrl, HttpsUrl } from "../rest/types";
export type SitemapRouteObject = {
    pathname: string;
    modified: string;
    [key: string]: any;
};
export type SitemapOptions = {
    siteUrl: HttpUrl | HttpsUrl;
};

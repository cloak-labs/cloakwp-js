// import wpapi from "wpapi/superagent";
import { RestApiClientProps, WPInstanceOptions } from "./types";
import stripTrailingSlash from "./utils/stripTrailingSlash";
var WPAPI = require("wpapi/fetch");

export function createWPInstance(options: WPInstanceOptions): WPInstance {
  return new WPInstance(options);
}

export default class WPInstance {
  protected _name: string;
  protected _url: string;
  protected _adminPath: string;
  protected _contentPath: string;
  protected _api: typeof WPAPI;
  protected _serverApi: typeof WPAPI;

  constructor({
    url,
    jwt,
    adminPath = "wp-admin",
    contentPath = "wp-content",
    name = "default",
  }: WPInstanceOptions) {
    this._url = stripTrailingSlash(url);
    this._adminPath = stripTrailingSlash(adminPath);
    this._contentPath = stripTrailingSlash(contentPath);
    this._name = name;
    this._api = this.createRestApiClient();
    this._serverApi = this.createRestApiClient({ jwt });
  }

  private createRestApiClient(options: RestApiClientProps = {}): typeof WPAPI {
    const { jwt } = options;

    const wpapi = new WPAPI({
      endpoint: `${this._url}/wp-json`,
      auth: true, // make all requests from the WPAPI instance use authentication
    });

    // register custom CloakWP api routes as wpapi methods:

    wpapi.menus = wpapi.registerRoute(
      "cloakwp",
      "/menus/(?P<id>[a-zA-Z0-9-]+)"
    );

    wpapi.options = wpapi.registerRoute(
      "cloakwp",
      "/options/(?P<id>[a-zA-Z0-9-]+)"
    );

    wpapi.isLoggedIn = wpapi.registerRoute("jwt-auth/v1", "/is-logged-in");
    wpapi.frontpage = wpapi.registerRoute("cloakwp", "/frontpage");

    if (jwt) {
      // add JWT authentication globally for all requests -- this API client should therefore only ever be used server-side so as to not expose the JWT value to the browser
      wpapi.setHeaders("Authorization", `Bearer ${jwt}`);
    }

    return wpapi;
  }

  /**
   * Returns a browser-friendly WPAPI instance. It can only interact with
   * public/non-authenticated REST API endpoints; eg. you can't create/update posts,
   * retrieve post revisions/drafts, etc. -- to do this, use `serverApi()`
   * on the server-side.
   */
  api(): typeof WPAPI {
    return this._api;
  }

  /**
   * Returns a WPAPI instance with JWT authentication applied to all REST API requests.
   * The idea is that any authenticated requests should happen server-side so as to not
   * expose your JWT token to the browser, which would obivously open your site up to
   * major security vulnerabilities.
   */
  serverApi(): typeof WPAPI {
    return this._serverApi;
  }

  settings() {
    return {
      url: this._url,
      adminPath: this._adminPath,
      contentPath: this._contentPath,
      name: this._name,
    };
  }

  getName(): string {
    return this._name;
  }

  getUrl(): string {
    return this._url;
  }

  getAdminPath(): string {
    return this._adminPath;
  }
}

import { type Plugin } from "cloakcms";

export type WPMenuItem = {
  id: number | `${number}`;
  title: string;
  description?: string;
  url: string;
  target: "" | "_blank";
  link_type: "post_type" | "page" | "custom";
  classes: string;
  menu_item_parent: number | `${number}`;
  menu_order: number | `${number}`;
  sub_menu_items: WPMenuItem[];
};

export type AdvancedCustomFields = Record<string, any>;

export type HttpUrl = `http://${string}`;
export type HttpsUrl = `https://${string}`;

// Define a minimal type for the client that covers what we actually use. TODO: add TS typing to wpapi package so we can type this properly here
export type WPClient = {
  setHeaders: (header: string, value: string) => void;
  [key: string]: any;
};

export type ClientMutationFn = ({ client }: { client: WPClient }) => WPClient;

export type RestApiClientConfig = {
  auth?: {
    jwt?: string;
    dangerouslyIgnoreExposedJwtWarning?: boolean;
  };
  wpapiOptions?: Record<string, any>; // TODO: add TS typing to wpapi package so we can type this properly here
  clientMutations?: ClientMutationFn[];
  plugins?: Plugin<RestApiClientConfig>[];
};

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

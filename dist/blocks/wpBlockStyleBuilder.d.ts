import type { WPBlockDataWithExtraContext } from "./types";
import { VariantProps } from "@cloakui/styles";
declare const wpBlockClassBuilder: (props?: {
    paddingTop?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    paddingBottom?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    paddingRight?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    paddingLeft?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    marginTop?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    marginBottom?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    blockGapX?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "0";
    blockGapY?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "0";
    verticalAlignment?: "center" | "none" | "bottom" | "default";
    orientation?: "default" | "flex" | "horizontal" | "vertical" | "constrained";
    justifyContent?: "space-between" | "center" | "right" | "default";
    textTransform?: "none" | "capitalize" | "lowercase" | "uppercase";
    fontStyle?: "normal" | "italic";
    textDecoration?: "none" | "line-through" | "underline";
} & ({
    class?: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | any | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    };
    className?: never;
} | {
    class?: never;
    className?: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | any | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    })[] | {
        [x: string]: any;
    };
})) => string;
export interface WPBlockVariants extends VariantProps<typeof wpBlockClassBuilder> {
}
type WPBlockStyleObject = {
    padding?: string;
    margin?: string;
};
export declare const wpBlockStyleBuilder: (block: WPBlockDataWithExtraContext) => {
    classes: string;
    styles: WPBlockStyleObject | null;
};
export {};

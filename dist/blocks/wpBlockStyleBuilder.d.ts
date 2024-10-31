import type { WPBlockDataWithExtraContext } from "./types";
import { VariantProps } from "@cloakui/styles";
declare const wpBlockClassBuilder: (props?: {
    paddingTop?: "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "none";
    paddingBottom?: "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "none";
    paddingRight?: "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "none";
    paddingLeft?: "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "none";
    marginTop?: "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "none";
    marginBottom?: "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "none";
    blockGapX?: "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "none" | "0";
    blockGapY?: "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "none" | "0";
    verticalAlignmentCol?: "center" | "none" | "default" | "bottom";
    verticalAlignmentRow?: "center" | "none" | "default" | "bottom";
    orientation?: "none" | "default" | "flex" | "horizontal" | "constrained" | "vertical";
    justifyContentCol?: "center" | "right" | "default" | "space-between";
    justifyContentRow?: "center" | "right" | "default" | "space-between";
    textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
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
    borderRadius?: string;
    [key: string]: string;
};
export declare const wpBlockStyleBuilder: (block: WPBlockDataWithExtraContext) => {
    classes: string;
    styles: WPBlockStyleObject | null;
};
export {};

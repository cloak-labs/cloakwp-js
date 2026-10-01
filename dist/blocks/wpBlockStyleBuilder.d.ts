import type { WPBlockDataWithExtraContext } from "./types";
import { VariantProps } from "@cloakui/styles";
declare const wpBlockClassBuilder: (props?: {
    paddingTop?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "var:preset|spacing|90" | "var:preset|spacing|auto";
    paddingBottom?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "var:preset|spacing|90" | "var:preset|spacing|auto";
    paddingRight?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "var:preset|spacing|90" | "var:preset|spacing|auto";
    paddingLeft?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "var:preset|spacing|90" | "var:preset|spacing|auto";
    marginTop?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "var:preset|spacing|90" | "var:preset|spacing|auto";
    marginBottom?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "var:preset|spacing|90" | "var:preset|spacing|auto";
    marginLeft?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "var:preset|spacing|90" | "var:preset|spacing|auto";
    marginRight?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "var:preset|spacing|90" | "var:preset|spacing|auto";
    blockGapX?: "0" | "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "var:preset|spacing|90" | "var:preset|spacing|auto";
    blockGapY?: "0" | "default" | "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80" | "var:preset|spacing|90" | "var:preset|spacing|auto";
    verticalAlignmentCol?: "bottom" | "center" | "default" | "none";
    verticalAlignmentRow?: "bottom" | "center" | "default" | "none";
    orientation?: "constrained" | "default" | "flex" | "horizontal" | "none" | "vertical";
    justifyContentCol?: "center" | "default" | "right" | "space-between";
    justifyContentRow?: "center" | "default" | "right" | "space-between";
    selfStretch?: "fill" | "fit" | "fixed";
    textTransform?: "capitalize" | "lowercase" | "none" | "uppercase";
    fontStyle?: "italic" | "normal";
    textDecoration?: "line-through" | "none" | "underline";
} & ({
    class?: string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | (string | number | boolean | /*elided*/ any | {
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
export declare const wpBlockStyleBuilder: (block: WPBlockDataWithExtraContext, classBuilder?: typeof wpBlockClassBuilder) => {
    classes: string;
    styles: WPBlockStyleObject | null;
};
export {};
//# sourceMappingURL=wpBlockStyleBuilder.d.ts.map
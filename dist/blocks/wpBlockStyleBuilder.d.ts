import { VariantProps } from "@cloakui/styles";
declare const wpBlockClassBuilder: (props?: {
    paddingTop?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    paddingBottom?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    marginTop?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    marginBottom?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    blockGapX?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    blockGapY?: "none" | "var:preset|spacing|20" | "var:preset|spacing|30" | "var:preset|spacing|40" | "var:preset|spacing|50" | "var:preset|spacing|60" | "var:preset|spacing|70" | "var:preset|spacing|80";
    verticalAlignment?: "default" | "center" | "none" | "bottom";
    orientation?: "default" | "flex" | "constrained" | "horizontal" | "vertical";
    justifyContent?: "default" | "center" | "right" | "space-between";
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
};
export declare const wpBlockStyleBuilder: (block: BlockDataWithExtraContext<TBlockData>) => {
    classes: string;
    styles: WPBlockStyleObject | null;
};
export {};

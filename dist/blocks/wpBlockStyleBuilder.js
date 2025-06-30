import { excludeClassNamesStartingWith } from "@cloakui/utils";
import { cva, cx } from "@cloakui/styles";
const wpBlockClassBuilder = cva({
    variants: {
        paddingTop: {
            none: null,
            "var:preset|spacing|20": "pt-1 md:pt-1.5", // 0.375rem
            "var:preset|spacing|30": "pt-2 md:pt-2.5", // 0.625rem
            "var:preset|spacing|40": "pt-3.5 md:pt-4", // 1rem
            "var:preset|spacing|50": "pt-5 md:pt-6", // 1.5rem
            "var:preset|spacing|60": "pt-8 md:pt-9", // 2.25rem
            "var:preset|spacing|70": "pt-12 md:pt-14", // 3.5rem
            "var:preset|spacing|80": "pt-16 md:pt-20", // 5rem
            "var:preset|spacing|90": "pt-20 md:pt-24", // 6rem
        },
        paddingBottom: {
            none: null,
            "var:preset|spacing|20": "pb-1 md:pb-1.5", // 0.375rem
            "var:preset|spacing|30": "pb-2 md:pb-2.5", // 0.625rem
            "var:preset|spacing|40": "pb-3.5 md:pb-4", // 1rem
            "var:preset|spacing|50": "pb-5 md:pb-6", // 1.5rem
            "var:preset|spacing|60": "pb-8 md:pb-9", // 2.25rem
            "var:preset|spacing|70": "pb-12 md:pb-14", // 3.5rem
            "var:preset|spacing|80": "pb-16 md:pb-20", // 5rem
            "var:preset|spacing|90": "pb-20 md:pb-24", // 6rem
        },
        paddingRight: {
            none: null,
            "var:preset|spacing|20": "pr-1 md:pr-1.5", // 0.375rem
            "var:preset|spacing|30": "pr-2 md:pr-2.5", // 0.625rem
            "var:preset|spacing|40": "pr-3.5 md:pr-4", // 1rem
            "var:preset|spacing|50": "pr-5 md:pr-6", // 1.5rem
            "var:preset|spacing|60": "pr-8 md:pr-9", // 2.25rem
            "var:preset|spacing|70": "pr-12 md:pr-14", // 3.5rem
            "var:preset|spacing|80": "pr-16 md:pr-20", // 5rem
            "var:preset|spacing|90": "pr-20 md:pr-24", // 6rem
        },
        paddingLeft: {
            none: null,
            "var:preset|spacing|20": "pl-1 md:pl-1.5", // 0.375rem
            "var:preset|spacing|30": "pl-2 md:pl-2.5", // 0.625rem
            "var:preset|spacing|40": "pl-3.5 md:pl-4", // 1rem
            "var:preset|spacing|50": "pl-5 md:pl-6", // 1.5rem
            "var:preset|spacing|60": "pl-8 md:pl-9", // 2.25rem
            "var:preset|spacing|70": "pl-12 md:pl-14", // 3.5rem
            "var:preset|spacing|80": "pl-16 md:pl-20", // 5rem
            "var:preset|spacing|90": "pl-20 md:pl-24", // 6rem
        },
        marginTop: {
            none: null,
            "var:preset|spacing|20": "mt-1 md:mt-1.5", // 0.375rem
            "var:preset|spacing|30": "mt-2 md:mt-2.5", // 0.625rem
            "var:preset|spacing|40": "mt-3.5 md:mt-4", // 1rem
            "var:preset|spacing|50": "mt-5 md:mt-6", // 1.5rem
            "var:preset|spacing|60": "mt-8 md:mt-9", // 2.25rem
            "var:preset|spacing|70": "mt-12 md:mt-14", // 3.5rem
            "var:preset|spacing|80": "mt-16 md:mt-20", // 5rem
            "var:preset|spacing|90": "mt-20 md:mt-24", // 6rem
        },
        marginBottom: {
            none: null,
            "var:preset|spacing|20": "mb-1 md:mb-1.5", // 0.375rem
            "var:preset|spacing|30": "mb-2 md:mb-2.5", // 0.625rem
            "var:preset|spacing|40": "mb-3.5 md:mb-4", // 1rem
            "var:preset|spacing|50": "mb-5 md:mb-6", // 1.5rem
            "var:preset|spacing|60": "mb-8 md:mb-9", // 2.25rem
            "var:preset|spacing|70": "mb-12 md:mb-14", // 3.5rem
            "var:preset|spacing|80": "mb-16 md:mb-20", // 5rem
            "var:preset|spacing|90": "mb-20 md:mb-24", // 6rem
        },
        blockGapX: {
            none: null,
            "0": null,
            "var:preset|spacing|20": "gap-1 md:gap-1.5", // 0.375rem
            "var:preset|spacing|30": "gap-2 md:gap-2.5", // 0.625rem
            "var:preset|spacing|40": "gap-3.5 md:gap-4", // 1rem
            "var:preset|spacing|50": "gap-5 md:gap-6", // 1.5rem
            "var:preset|spacing|60": "gap-8 md:gap-9", // 2.25rem
            "var:preset|spacing|70": "gap-12 md:gap-14", // 3.5rem
            "var:preset|spacing|80": "gap-16 md:gap-20", // 5rem
            "var:preset|spacing|90": "gap-20 md:gap-24", // 6rem
        },
        blockGapY: {
            none: null,
            "0": null,
            "var:preset|spacing|20": "gap-y-1.5", // 0.375rem
            "var:preset|spacing|30": "gap-y-2.5", // 0.625rem
            "var:preset|spacing|40": "gap-y-4", // 1rem
            "var:preset|spacing|50": "gap-y-6", // 1.5rem
            "var:preset|spacing|60": "gap-y-9", // 2.25rem
            "var:preset|spacing|70": "gap-y-14", // 3.5rem
            "var:preset|spacing|80": "gap-y-20", // 5rem
            "var:preset|spacing|90": "gap-y-24", // 6rem
        },
        verticalAlignmentCol: {
            none: null,
            default: "justify-start",
            center: "justify-center",
            bottom: "justify-end",
        },
        verticalAlignmentRow: {
            none: null,
            default: "items-start",
            center: "items-center",
            bottom: "items-end",
        },
        orientation: {
            none: null,
            default: "flex flex-col",
            flex: "flex flex-row",
            constrained: "flex flex-col",
            horizontal: "flex flex-row",
            vertical: "flex flex-col",
        },
        justifyContentCol: {
            default: null,
            center: "items-center",
            right: "items-end",
            "space-between": "items-between",
        },
        justifyContentRow: {
            default: null,
            center: "justify-center",
            right: "justify-end",
            "space-between": "justify-between",
        },
        selfStretch: {
            fixed: "",
            fit: "",
            fill: "grow basis-[min-content]",
        },
        textTransform: {
            none: null,
            uppercase: "uppercase",
            lowercase: "lowercase",
            capitalize: "capitalize",
        },
        fontStyle: {
            normal: null,
            italic: "italic",
        },
        textDecoration: {
            none: null,
            "line-through": "line-through",
            underline: "underline",
        },
    },
    defaultVariants: {
        verticalAlignmentRow: "none",
        verticalAlignmentCol: "none",
        orientation: "none",
        justifyContentCol: "default",
        justifyContentRow: "default",
        textTransform: "none",
        fontStyle: "normal",
        textDecoration: "none",
        blockGapX: "none",
        blockGapY: "none",
    },
});
export const wpBlockStyleBuilder = (block, classBuilder = wpBlockClassBuilder) => {
    const { backgroundColor, textColor, className, fontSize, align, textAlign, verticalAlignment, style = {}, layout = {}, } = block.attrs;
    const { typography: { textTransform = "none", fontStyle = "normal", textDecoration = "none", } = {}, spacing: { blockGap = {}, margin = {}, padding = {} } = {}, background = {}, } = style ?? {};
    let blockGapX;
    let blockGapY;
    let marginTop;
    let marginBottom;
    let paddingTop;
    let paddingBottom;
    let paddingRight;
    let paddingLeft;
    if (block.name == "core/column") {
        blockGapY = "var:preset|spacing|30"; // set default vertical spacing for column block
    }
    const isSpacingPreset = (str) => str.startsWith("var:preset|spacing|");
    if (typeof blockGap == "string") {
        if (block.name == "core/column" ||
            (block.name == "core/group" && block.attrs.layout.type != "flex")) {
            blockGapY = blockGap;
        }
        else {
            blockGapX = blockGap;
        }
    }
    else {
        if (blockGap.left && isSpacingPreset(blockGap.left))
            blockGapX = blockGap.left;
        if (blockGap.top && isSpacingPreset(blockGap.top))
            blockGapY = blockGap.top;
    }
    if (margin.top && isSpacingPreset(margin.top))
        marginTop = margin.top;
    if (margin.bottom && isSpacingPreset(margin.bottom))
        marginBottom = margin.bottom;
    if (padding.top && isSpacingPreset(padding.top))
        paddingTop = padding.top;
    if (padding.bottom && isSpacingPreset(padding.bottom))
        paddingBottom = padding.bottom;
    if (padding.right && isSpacingPreset(padding.right))
        paddingRight = padding.right;
    if (padding.left && isSpacingPreset(padding.left))
        paddingLeft = padding.left;
    const isFlexRow = layout?.orientation == "horizontal" || layout?.type == "flex";
    const variantClasses = classBuilder({
        [`verticalAlignment${isFlexRow ? "Row" : "Col"}`]: layout?.verticalAlignment ?? verticalAlignment, // note: WP sometimes nests verticalAlignment under `layout` for some reason
        orientation: layout?.orientation || layout?.type,
        [`justifyContent${isFlexRow ? "Row" : "Col"}`]: layout?.justifyContent,
        selfStretch: style?.layout?.selfStretch,
        textTransform,
        fontStyle,
        textDecoration,
        blockGapX,
        blockGapY,
        marginTop,
        marginBottom,
        paddingTop,
        paddingBottom,
        paddingRight,
        paddingLeft,
    });
    let customClassNames = null;
    if (className?.includes("is-style-dark"))
        customClassNames = "dark dark:darker";
    const filteredClassNames = excludeClassNamesStartingWith(className, [
        "is-style",
    ]);
    // Remove leading ">" characters from class names, which is a way to disable the class from affecting the Gutenberg editor styling and only apply to the iframe preview
    const finalClassNames = filteredClassNames
        ?.split(" ")
        ?.map((c) => (c.startsWith(">") ? c.slice(1) : c));
    const classes = cx(backgroundColor == "transparent" ? "bg-transparent" : backgroundColor, textColor, fontSize && `text-${fontSize}`, (textAlign || align == "center" || align == "right") &&
        `text-${textAlign || align}`, variantClasses, layout?.flexWrap == "wrap" && "flex-wrap", finalClassNames, customClassNames);
    let styles = null;
    ["padding", "margin"].forEach((property) => {
        const values = style?.spacing?.[property];
        if (!values)
            return;
        const { top = "0px", right = "auto", bottom = "0px", left = "auto", } = values;
        // Object.entries(values)
        let total = 0;
        [top, right, bottom, left]?.forEach((val) => {
            if (val != "auto")
                total += parseInt(val);
        });
        if (total > 0) {
            if (!styles)
                styles = {};
            styles[property] = `${top} ${right} ${bottom} ${left}`;
        }
    });
    if (background.backgroundImage) {
        if (!styles)
            styles = {};
        styles["backgroundImage"] = `url(${background.backgroundImage.url})`;
        styles["backgroundSize"] = background.backgroundSize ?? "cover";
    }
    if (style?.layout?.flexSize) {
        if (!styles)
            styles = {};
        styles["flexBasis"] = style?.layout?.flexSize;
    }
    if (style?.border?.radius) {
        if (!styles)
            styles = {};
        const radius = style?.border?.radius;
        if (typeof radius == "string") {
            styles["borderRadius"] = radius;
        }
        else {
            styles["borderRadius"] = `${radius.topLeft} ${radius.topRight} ${radius.bottomRight} ${radius.bottomLeft}`;
        }
    }
    return {
        classes,
        styles,
    };
};

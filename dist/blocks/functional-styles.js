import { excludeClassNamesStartingWith } from "@cloakui/utils";
import { cx } from "@cloakui/styles";
import { applyTypographyExtras } from "./typographyStyles";
/** WordPress layout behavior and editor classes, independent of visual styles. */
export function wpBlockFunctionalStyles(block) {
    const { className = "", layout = {}, verticalAlignment, fitText, style, } = block.attrs ?? {};
    const horizontal = layout.orientation === "horizontal" || layout.type === "flex";
    const orientation = layout.orientation ?? layout.type;
    const orientationClass = {
        default: "flex flex-col",
        constrained: "flex flex-col",
        flex: "flex flex-row",
        horizontal: "flex flex-row",
        vertical: "flex flex-col",
    }[orientation];
    const vertical = layout.verticalAlignment ??
        verticalAlignment ??
        (block.name === "core/group" && layout.type === "flex" ? "center" : "none");
    const align = horizontal
        ? { default: "items-start", center: "items-center", bottom: "items-end" }[vertical]
        : {
            default: "justify-start",
            center: "justify-center",
            bottom: "justify-end",
        }[vertical];
    const justify = horizontal
        ? {
            center: "justify-center",
            right: "justify-end",
            "space-between": "justify-between",
        }[layout.justifyContent]
        : {
            center: "items-center",
            right: "items-end",
            "space-between": "items-between",
        }[layout.justifyContent];
    const stretch = {
        fixed: "grow-0 shrink-0",
        fill: "grow basis-[min-content] max-w-full *:max-w-full",
    }[style?.layout?.selfStretch];
    const tokens = className
        .split(/\s+/)
        .map((token) => (token.startsWith(">") ? token.slice(1) : token));
    const wantsDark = tokens.includes("dark") || className.includes("is-style-dark");
    const wantsDarker = tokens.includes("darker") || className.includes("is-style-dark");
    const custom = excludeClassNamesStartingWith(className, ["is-style"])
        ?.split(" ")
        .map((token) => (token.startsWith(">") ? token.slice(1) : token));
    const extras = applyTypographyExtras({ fitText });
    const classes = [
        cx(orientationClass, align, justify, stretch, layout.flexWrap === "wrap" && "flex-wrap", block.name === "core/column" && "gap-y-2.5", extras.classes, custom),
        wantsDark && "dark",
        wantsDarker && "darker",
    ]
        .filter(Boolean)
        .join(" ");
    let styles = Object.keys(extras.styles).length
        ? { ...extras.styles }
        : null;
    if (style?.layout?.flexSize &&
        block.context?.parent?.attrs?.layout?.type === "flex") {
        const flexSize = style.layout.flexSize;
        styles = {
            ...styles,
            flexBasis: flexSize,
            width: flexSize,
            flexGrow: "0",
            flexShrink: "0",
        };
    }
    return { classes, styles };
}

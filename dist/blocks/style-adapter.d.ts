import { type Breakpoint, type StyleDiagnostic, type StyleInput, type StyleModule, type StyleProperty, type StyleOutput, type StyleState, type StyleScalar } from "@cloakui/block-styles";
export type WordPressStyleOutput = StyleOutput<"unsupported-attribute" | "unresolved-preset">;
export type WordPressStyleOptions = {
    /** Prefix for emitted classes and variables. */
    prefix?: string;
    /** WordPress viewport names and media conditions. Pass the site's configured widths. */
    breakpoints?: readonly Breakpoint<string>[];
    /** Map a WordPress preset into the frontend's own token system. */
    resolvePreset?: (category: string, slug: string, context?: {
        property: string;
        breakpoint?: string;
        state?: StyleState;
    }) => string;
    /** Diagnose unresolved WordPress variables, or explicitly allow them when supplied by the site. */
    unresolvedPreset?: "diagnose" | "allow";
    /** Map an editor media URL to the frontend's deployed media origin. */
    resolveMediaUrl?: (url: string) => string;
    /** Resolve a background image into a CSS image value. */
    resolveBackgroundImage?: (url: string, block: unknown) => string;
    defaults?: StyleInput<string>;
    /** Register or override CMS-independent property capabilities. */
    properties?: Record<string, StyleProperty>;
    modules?: readonly StyleModule<string>[];
    resolve?: (style: StyleInput<string>, block: unknown) => StyleInput<string>;
    canCombine?: (properties: readonly string[], block: unknown) => boolean;
    cssDefaults?: Record<string, StyleScalar> | ((block: unknown) => Record<string, StyleScalar>);
    specificity?: "low" | "class" | "strong";
};
/** Mirrors WordPress's 7.1 viewport validation and non-overlapping ranges. */
export declare function wordpressBreakpointsForViewport(settings?: {
    mobile?: string;
    tablet?: string;
}): readonly Breakpoint<string>[];
export declare const wordpressBreakpoints: readonly Breakpoint<string>[];
/** Convert saved WordPress attributes into the CMS-independent style model. */
export declare function normalizeWordPressBlockStyles(block: {
    name?: string;
    attrs?: Record<string, any>;
    context?: any;
}, options?: Pick<WordPressStyleOptions, "breakpoints" | "resolvePreset" | "resolveMediaUrl" | "resolveBackgroundImage">): StyleInput<string>;
export declare function createWordPressBlockStyleEngine(options?: WordPressStyleOptions): {
    catalog: () => StyleOutput;
    normalize: (block: Parameters<typeof normalizeWordPressBlockStyles>[0]) => StyleInput<string>;
    render(block: Parameters<typeof normalizeWordPressBlockStyles>[0]): WordPressStyleOutput;
};
/** Report unsupported saved fields instead of silently pretending to render them. */
export declare function findUnsupportedWordPressStyles(block: {
    attrs?: Record<string, any>;
}, breakpoints?: readonly Breakpoint<string>[]): StyleDiagnostic<"unsupported-attribute">[];
//# sourceMappingURL=style-adapter.d.ts.map
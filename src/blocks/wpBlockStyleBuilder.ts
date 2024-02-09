import type {
  WPBlockDataWithExtraContext,
  WPBlockSpacingPresets,
} from "./types";
import { excludeClassNamesStartingWith } from "@cloakui/utils";
import { VariantProps, cva, cx } from "@cloakui/styles";

const wpBlockClassBuilder = cva({
  variants: {
    marginTop: {
      none: null,
      "var:preset|spacing|20": "mt-1 md:mt-1.5", // 0.375rem
      "var:preset|spacing|30": "mt-2 md:mt-2.5", // 0.625rem
      "var:preset|spacing|40": "mt-3.5 md:mt-4", // 1rem
      "var:preset|spacing|50": "mt-5 md:mt-6", // 1.5rem
      "var:preset|spacing|60": "mt-8 md:mt-9", // 2.25rem
      "var:preset|spacing|70": "mt-12 md:mt-14", // 3.5rem
      "var:preset|spacing|80": "mt-16 md:mt-20", // 5rem
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
    },
    blockGapX: {
      none: null,
      "var:preset|spacing|20": "gap-1 md:gap-1.5", // 0.375rem
      "var:preset|spacing|30": "gap-2 md:gap-2.5", // 0.625rem
      "var:preset|spacing|40": "gap-3.5 md:gap-4", // 1rem
      "var:preset|spacing|50": "gap-5 md:gap-6", // 1.5rem
      "var:preset|spacing|60": "gap-8 md:gap-9", // 2.25rem
      "var:preset|spacing|70": "gap-12 md:gap-14", // 3.5rem
      "var:preset|spacing|80": "gap-16 md:gap-20", // 5rem
    },
    blockGapY: {
      none: null,
      "var:preset|spacing|20": "gap-y-1.5", // 0.375rem
      "var:preset|spacing|30": "gap-y-2.5", // 0.625rem
      "var:preset|spacing|40": "gap-y-4", // 1rem
      "var:preset|spacing|50": "gap-y-6", // 1.5rem
      "var:preset|spacing|60": "gap-y-9", // 2.25rem
      "var:preset|spacing|70": "gap-y-14", // 3.5rem
      "var:preset|spacing|80": "gap-y-20", // 5rem
    },
    verticalAlignment: {
      default: "justify-start",
      center: "justify-center",
      bottom: "justify-end",
    },
    orientation: {
      default: null,
      flex: null,
      horizontal: "flex-row",
      vertical: "flex-col",
    },
    justifyContent: {
      default: null,
      center: null,
      right: null,
      "space-between": null,
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
  compoundVariants: [
    {
      orientation: "default",
      justifyContent: "center",
      class: "items-center",
    },
    {
      orientation: "default",
      justifyContent: "right",
      class: "items-end",
    },
    {
      orientation: "default",
      justifyContent: "space-between",
      class: "items-between",
    },
    {
      orientation: ["horizontal", "flex"],
      justifyContent: "center",
      class: "justify-center",
    },
    {
      orientation: ["horizontal", "flex"],
      justifyContent: "right",
      class: "justify-end",
    },
    {
      orientation: ["horizontal", "flex"],
      justifyContent: "space-between",
      class: "justify-between",
    },
  ],
  defaultVariants: {
    verticalAlignment: "default",
    orientation: "default",
    justifyContent: "default",
    textTransform: "none",
    fontStyle: "normal",
    textDecoration: "none",
    blockGapX: "none",
    blockGapY: "none",
  },
});

export interface WPBlockVariants
  extends VariantProps<typeof wpBlockClassBuilder> {}

type WPBlockStyleObject = {
  padding?: string;
  margin?: string;
};

export const wpBlockStyleBuilder = (
  block: WPBlockDataWithExtraContext
): { classes: string; styles: WPBlockStyleObject | null } => {
  const {
    backgroundColor,
    textColor,
    className,
    fontSize,
    align,
    textAlign,
    style = {},
    verticalAlignment,
    layout = {},
  } = block.attrs;

  const {
    typography: {
      textTransform = "none",
      fontStyle = "normal",
      textDecoration = "none",
    } = {},
    spacing: { blockGap = {}, margin = {} } = {},
  } = style ?? {};

  let blockGapX: WPBlockSpacingPresets;
  let blockGapY: WPBlockSpacingPresets;
  let marginTop: WPBlockSpacingPresets;
  let marginBottom: WPBlockSpacingPresets;

  if (block.name == "core/column") {
    blockGapY = "var:preset|spacing|30"; // set default vertical spacing for column block
  }

  const isSpacingPreset = (str: string) =>
    str.startsWith("var:preset|spacing|");

  if (typeof blockGap == "string") {
    if (isSpacingPreset(blockGap))
      blockGapX = blockGap as WPBlockSpacingPresets;
  } else {
    if (blockGap.left && isSpacingPreset(blockGap.left))
      blockGapX = blockGap.left as WPBlockSpacingPresets;
    if (blockGap.top && isSpacingPreset(blockGap.top))
      blockGapY = blockGap.top as WPBlockSpacingPresets;
  }

  if (margin.top && isSpacingPreset(margin.top))
    marginTop = margin.top as WPBlockSpacingPresets;
  if (margin.bottom && isSpacingPreset(margin.bottom))
    marginBottom = margin.bottom as WPBlockSpacingPresets;

  const variantClasses = wpBlockClassBuilder({
    verticalAlignment,
    orientation: layout?.orientation || layout?.type,
    justifyContent: layout.justifyContent,
    textTransform,
    fontStyle,
    textDecoration,
    blockGapX,
    blockGapY,
    marginTop,
    marginBottom,
  });

  const filteredClassNames = excludeClassNamesStartingWith(className, [
    "is-style",
  ]);

  const classes = cx(
    backgroundColor && `${backgroundColor}`,
    textColor && `${textColor}`,
    fontSize && `text-${fontSize}`,
    (align || textAlign) && `text-${textAlign || align}`,
    variantClasses,
    filteredClassNames
  );

  let styles = null;

  ["padding", "margin"].forEach((property) => {
    const values = style?.spacing?.[property];
    if (!values) return;

    const {
      top = "0px",
      right = "auto",
      bottom = "0px",
      left = "auto",
    } = values;
    // Object.entries(values)

    let total = 0;
    [top, right, bottom, left]?.forEach((val) => {
      if (val != "auto") total += parseInt(val);
    });

    if (total > 0) {
      if (!styles) styles = {};
      styles[property] = `${top} ${right} ${bottom} ${left}`;
    }
  });

  return {
    classes,
    styles,
  };
};

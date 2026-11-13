const FONT_WEIGHT_CLASSES: Record<string, string> = {
  "100": "font-thin",
  "200": "font-extralight",
  "300": "font-light",
  "400": "font-normal",
  "500": "font-medium",
  "600": "font-semibold",
  "700": "font-bold",
  "800": "font-extrabold",
  "900": "font-black",
  normal: "font-normal",
  bold: "font-bold",
};

export function applyTypographyExtras(input: {
  fontWeight?: unknown;
  textIndent?: unknown;
  textColumns?: unknown;
  fitText?: boolean;
}) {
  const classes: string[] = [];
  const styles: Record<string, string> = {};
  const weight = fontWeightClass(input.fontWeight);
  if (weight) classes.push(weight);
  const extraWeight = unmappedFontWeight(input.fontWeight);
  if (extraWeight) styles.fontWeight = extraWeight;

  const indent = cssLength(input.textIndent);
  if (indent) styles.textIndent = indent;

  const columns = columnCount(input.textColumns);
  if (columns) styles.columnCount = columns;

  if (input.fitText) {
    classes.push("has-fit-text", "whitespace-nowrap");
    styles.whiteSpace = "nowrap";
  }

  return { classes, styles };
}

function fontWeightClass(value: unknown) {
  if (value == null || value === "") return null;
  return FONT_WEIGHT_CLASSES[String(value).trim()] ?? null;
}

function unmappedFontWeight(value: unknown) {
  if (value == null || value === "" || fontWeightClass(value)) return null;
  const weight = String(value).trim();
  return /^(?:[1-9]\d{2}|1000)$/.test(weight) ? weight : null;
}

/** A block value only. WordPress's "subsequent" mode is not a length. */
function cssLength(value: unknown) {
  if (typeof value !== "string") return null;
  const length = value.trim();
  if (
    /^(?:-?\d*\.?\d+(?:px|em|rem|%|ch|ex|vw|vh|vmin|vmax)|0)$/.test(length) ||
    /^var\(--[\w-]+\)$/.test(length)
  ) {
    return length;
  }
  return null;
}

function columnCount(value: unknown) {
  const count = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(count) || count < 2 || count > 10) return null;
  return String(count);
}

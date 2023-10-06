import Button from "../components/Button";
import { useBlockStyleBuilder } from "../hooks/useBlockStyleBuilder";
import { getWpInstance } from "../config";

export default function ButtonBlock({ block }) {
  const wpUrl = getWpInstance().getUrl();
  const { classes, styles } = useBlockStyleBuilder(block);
  let { backgroundColor, className, text, url } = block.attrs;

  let color = "white";
  if (backgroundColor == "gray-900") color = "black";
  else if (backgroundColor.includes("gray")) color = "gray";

  let variant = "solid";
  if (className.includes("is-style-outline")) variant = "outline";

  if (url.includes(wpUrl)) url = url.replace(wpUrl, "/");

  return (
    <Button
      href={url}
      color={color}
      variant={variant}
      wpClasses={classes}
      style={styles}
    >
      {text}
    </Button>
  );
}

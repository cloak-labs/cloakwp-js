import { ReactElement } from "react";
import { classNames } from "../utils/classNames";

export interface ContainerProps {
  className?: string;
  innerClassName?: string;
  children?: ReactElement;
}

export default function Container({
  className,
  innerClassName,
  children,
  ...props
}: ContainerProps) {
  const defaultInnerClassNames =
    "px-4 sm:px-6 lg:px-9 mx-auto max-w-7xl lg:max-w-8xl";
  const hasBgColor = className?.includes("bg-") || false;

  return (
    <div
      className={classNames(
        !hasBgColor && defaultInnerClassNames,
        !hasBgColor && innerClassName,
        className
      )}
      data-cloakwp-container="true"
      {...props}
    >
      {hasBgColor ? (
        <div className={classNames(defaultInnerClassNames, innerClassName)}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

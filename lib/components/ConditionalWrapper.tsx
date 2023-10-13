import { ReactElement } from "react";

export interface ConditionalWrapperProps {
  condition: (() => boolean) | boolean;
  wrapper: (children: ReactElement, args: any) => ReactElement;
  children: ReactElement;
  args?: any;
}

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
  args,
}: ConditionalWrapperProps) => {
  const passesCondition =
    typeof condition === "function" ? condition() : condition;
  return passesCondition ? wrapper(children, args) : children;
};

export default ConditionalWrapper;

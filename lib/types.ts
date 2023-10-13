import { ReactElement } from "react";

export interface WPInstanceOptions {
  url: string;
  jwt: string;
  adminPath?: string;
  contentPath?: string;
  name?: string;
}

export interface RestApiClientProps {
  jwt?: string;
}

export interface PreviewModeParams {
  revisionId: string;
  postId: string;
  postTypeRestEndpoint: string;
  postType: string;
}

export interface BlocksComponentProps {
  data: BlockData[] | null;
  blocks?: BlocksConfig;
  container?: BlockContainer;
  containerCondition?: BlockContainerCondition;
  merge?: boolean;
}

export interface BlockComponentProps {
  block: BlockData;
  isNested?: boolean;
  parentBlock?: BlockData | null;
  container?: BlockContainer;
  containerCondition?: BlockContainerCondition;
  containerClasses?: string;
  prevSibling?: BlockData | null;
  nextSibling?: BlockData | null;
  props?: Record<string, any>;
}

export interface BlocksConfigProviderProps extends GlobalBlocksConfig {
  merge?: boolean;
  children?: ReactElement;
}

export interface GlobalBlocksConfig {
  blocks?: BlocksConfig;
  container?: BlockContainer;
  containerCondition?: BlockContainerCondition;
}

export interface BlocksConfig {
  [key: string]: {
    props?: Record<string, any>;
    component?: ReactElement;
    container?: BlockContainer;
    containerCondition?: BlockContainerCondition;
    containerClasses?: string;
  };
}

export interface BlockProp extends BlockData {
  isNested: boolean;
  parent: BlockData | null;
  config: BlocksConfig;
  prevSibling: BlockData | null;
  nextSibling: BlockData | null;
}

export type BlockContainer =
  | boolean
  | ((props: BlockContainerProps) => ReactElement);
export type BlockContainerCondition = (
  props: BlockContainerConditionProps
) => boolean;

export interface BlockContainerConditionProps {
  block: BlockProp;
  blockProps: Record<string, any> | null;
}

export interface BlockContainerProps extends BlockContainerConditionProps {
  children: ReactElement;
}

export interface GutenbergBlockAttrs {
  align?: string;
  style?: {
    spacing?: {
      padding?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
      };
      margin?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
      };
    };
  };
  backgroundColor?: string;
  layout?: {
    type?: string;
  };
  tagName?: string;
  templateLock?: string;
  lock?: any[];
  borderColor?: string;
  textColor?: string;
  gradient?: string;
  className?: string;
  fontSize?: string;
  fontFamily?: string;
  anchor?: string;
}

export type AdvancedCustomFields = Record<string, any>;

export interface BlockData {
  name: string;
  type: string;
  attrs?: GutenbergBlockAttrs;
  data?: AdvancedCustomFields;
  rendered?: string;
  innerBlocks?: BlockData[];
}

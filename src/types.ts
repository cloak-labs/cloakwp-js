import {
  DataRouter,
  BlockContext,
  BlockDataWithExtraContext,
  BlockRendererConfig,
  BlocksConfig,
  EmptyObjectOrRecord,
  GlobalDataRouter,
  SingleBlockConfig,
  SingleBlockConfigWithVariants,
  SingleBlockConfigWithoutVariants,
  VariantsRouter,
} from "cloakcms";

export type RestApiBlockData = {
  name: string;
  type: string;
  attrs?: WPBlockAttributes;
  data?: AdvancedCustomFields;
  rendered?: string;
  innerBlocks?: RestApiBlockData[];
};

export type WPBlockSpacingPresets =
  | "var:preset|spacing|20"
  | "var:preset|spacing|30"
  | "var:preset|spacing|40"
  | "var:preset|spacing|50"
  | "var:preset|spacing|60"
  | "var:preset|spacing|70"
  | "var:preset|spacing|80";

export type WPBlockSpacingValues =
  | `${number}px`
  | `${number}em`
  | `${number}rem`
  | `${number}vh`
  | `${number}vw`
  | `${number}%`
  | `${number}`;

export type WPBlockSpacingObject<
  TSpacingPresets extends string = WPBlockSpacingPresets
> = {
  top?: TSpacingPresets | WPBlockSpacingValues;
  right?: TSpacingPresets | WPBlockSpacingValues;
  bottom?: TSpacingPresets | WPBlockSpacingValues;
  left?: TSpacingPresets | WPBlockSpacingValues;
};

export type WPBlockAttributes<
  TSpacingPresets extends string = WPBlockSpacingPresets
> = {
  align?: "wide" | "full" | "center" | "right";
  style?: {
    typography?: {
      textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
      fontFamily?: string;
      fontStyle?: "normal" | "italic";
      fontWeight?: string;
      letterSpacing?: string;
      textDecoration?: "none" | "line-through" | "underline";
    };
    spacing?: {
      blockGap?: TSpacingPresets | WPBlockSpacingObject<TSpacingPresets>;
      padding?: WPBlockSpacingObject<TSpacingPresets>;
      margin?: WPBlockSpacingObject<TSpacingPresets>;
    };
  };
  backgroundColor?: string;
  layout?: {
    type?: "default" | "flex" | "horizontal";
    orientation?: "default" | "flex" | "horizontal" | "vertical";
    justifyContent?: "default" | "center" | "right" | "space-between";
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
  ordered?: string;
  values?: string;
  text?: string;
  url?: string;
  level?: string;
  content?: string;
  textAlign?: string;
  verticalAlignment?: "default" | "center" | "bottom";
  aspectRatio?: string;
  alt?: string;
  caption?: string;
  href?: string;
  width?: string;
  height?: string;
  scale?: string;
  value?: string;
  citation?: string;
  isStackedOnMobile?: boolean;
};

export type WPMenuItem = {
  id: number | `${number}`;
  title: string;
  description?: string;
  url: string;
  target: "" | "_blank";
  link_type: "page" | "custom";
  menu_item_parent: number | `${number}`;
  menu_order: number | `${number}`;
  sub_menu_items: WPMenuItem[];
};

export type AdvancedCustomFields = Record<string, any>;

export type PreviewModeParams = {
  revisionId: string;
  postId: string;
  apiMethod: string;
  postType: string;
};

/**
 * Wrap all `render-blocks` types, defaulting TBlockData to CloakWP's `RestApiBlockData` type
 * so users don't have to worry about doing that (framework-specific CloakWP wrappers
 * will wrap these in the same way, passing in their respective component & render output types):
 */
export type WPBlockRendererConfig<
  TComponent = any,
  TRenderOutput = any,
  TBlockData = RestApiBlockData
> = BlockRendererConfig<TComponent, TRenderOutput, TBlockData>;

export type WPDataRouter<
  TProps = EmptyObjectOrRecord,
  TBlockData = RestApiBlockData,
  TComponent = any
> = DataRouter<TProps, TBlockData, TComponent>;

export type WPGlobalDataRouter<
  TProps = EmptyObjectOrRecord,
  TBlockData = RestApiBlockData,
  TComponent = any
> = GlobalDataRouter<TProps, TBlockData, TComponent>;

export type WPSingleBlockConfigWithoutVariants<
  TComponent = any,
  TProps = EmptyObjectOrRecord,
  TBlockData = RestApiBlockData
> = SingleBlockConfigWithoutVariants<TComponent, TProps, TBlockData>;

export type WPVariantsRouter<
  TComponent = any,
  TBlockData = RestApiBlockData
> = VariantsRouter<TComponent, TBlockData>;

export type WPSingleBlockConfigWithVariants<
  TComponent = any,
  TBlockData = RestApiBlockData
> = SingleBlockConfigWithVariants<TComponent, TBlockData>;

export type WPSingleBlockConfig<
  TComponent = any,
  TBlockData = RestApiBlockData
> = SingleBlockConfig<TComponent, TBlockData>;

export type WPBlocksConfig<
  TComponent = any,
  TBlockData = RestApiBlockData
> = BlocksConfig<TComponent, TBlockData>;

export type WPBlockDataWithExtraContext<
  TComponent = any,
  TBlockData = RestApiBlockData
> = BlockDataWithExtraContext<TComponent, TBlockData>;

export type WPBlockContext<
  TComponent = any,
  TBlockData = RestApiBlockData
> = BlockContext<TComponent, TBlockData>;
// == End `render-blocks` wrappers ==

export type SitemapRouteObject = {
  pathname: string;
  modified: string;
  [key: string]: any;
};

export type HttpUrl = `http://${string}`;
export type HttpsUrl = `https://${string}`;

export type SitemapOptions = {
  siteUrl: HttpUrl | HttpsUrl;
};

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
} from "../cms";
import { AdvancedCustomFields } from "../rest/types";

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
    layout?: {
      selfStretch?: "fixed" | "fill" | "fit";
      flexSize?: string;
    };
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
    border?: {
      radius?:
        | string
        | {
            topLeft?: string;
            topRight?: string;
            bottomRight?: string;
            bottomLeft?: string;
          };
    };
    background?: {
      backgroundImage?: {
        url?: string;
        id?: number;
        source?: "file";
        title?: string;
      };
      backgroundSize?: "cover" | "contain";
    };
  };
  backgroundColor?: string;
  layout?: {
    type?: "default" | "flex" | "horizontal" | "constrained";
    orientation?: "default" | "flex" | "horizontal" | "vertical";
    justifyContent?: "default" | "center" | "right" | "space-between";
    flexWrap?: "wrap" | "nowrap";
    verticalAlignment?: "default" | "center" | "bottom";
  };
  verticalAlignment?: "default" | "center" | "bottom" | "stretch";
  tagName?:
    | "div"
    | "header"
    | "main"
    | "section"
    | "article"
    | "aside"
    | "footer";
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
  metadata?: {
    bindings?: WPBlockBinding[];
  };
};

export type WPBlockBinding = {
  source: string;
  args: {
    key: string;
  };
};

/**
 * Wrap all `render-blocks` types, defaulting TBlockData to CloakWP's `RestApiBlockData` type
 * so users don't have to worry about doing that (framework-specific CloakWP wrappers
 * will wrap these in the same way, passing in their respective component & render output types):
 */
export type WPBlockRendererConfig<
  TComponent extends (props: any) => any = (props: any) => any,
  TRenderOutput = any,
  TBlockData = RestApiBlockData
> = BlockRendererConfig<TComponent, TRenderOutput, TBlockData>;

export type WPDataRouter<
  TProps = EmptyObjectOrRecord,
  TBlockData = RestApiBlockData,
  TComponent extends (props: any) => any = (props: any) => any
> = DataRouter<
  TProps,
  TBlockData,
  TComponent,
  WPBlockDataWithExtraContext<TBlockData>
>;

export type WPGlobalDataRouter<
  TProps = EmptyObjectOrRecord,
  TBlockData = RestApiBlockData
> = GlobalDataRouter<TProps, TBlockData>;

export type WPSingleBlockConfigWithoutVariants<
  TComponent extends (props: any) => any = (props: any) => any,
  TProps = EmptyObjectOrRecord,
  TBlockData = RestApiBlockData
> = SingleBlockConfigWithoutVariants<TComponent, TProps, TBlockData>;

export type WPVariantsRouter<TBlockData = RestApiBlockData> =
  VariantsRouter<TBlockData>;

export type WPSingleBlockConfigWithVariants<
  TComponent extends (props: any) => any = (props: any) => any,
  TProps = EmptyObjectOrRecord,
  TBlockData = RestApiBlockData
> = SingleBlockConfigWithVariants<TComponent, TProps, TBlockData>;

export type WPSingleBlockConfig<
  TComponent extends (props: any) => any = (props: any) => any,
  TBlockData = RestApiBlockData
> = SingleBlockConfig<TComponent, TBlockData>;

export type WPBlocksConfig<
  TComponent extends (props: any) => any = (props: any) => any,
  TBlockData = RestApiBlockData
> = BlocksConfig<TComponent, TBlockData>;

export type WPBlockDataWithExtraContext<TBlockData = RestApiBlockData> =
  BlockDataWithExtraContext<TBlockData>;

export type WPBlockContext<TBlockData = RestApiBlockData> =
  BlockContext<TBlockData>;

import { BlockRenderer, type BlockRendererConfig } from "cloakcms";
import { type RestApiBlockData } from "./types";
/**
 * A tiny wrapper around the BlockRenderer class from `@kaelan/render-blocks`, simply
 * for the purposes of setting the `TBlockData` type parameter to default to CloakWP's
 * `RestApiBlockData` type, saving users from having to manually specify this type param.
 * Having users use this wrapper also sets us up for future WP-specific customizations
 * of the BlockRenderer without having to issue breaking changes.
 */
export declare class WPBlockRenderer<TComponent = any, TRenderOutput = any, TBlockData = RestApiBlockData> extends BlockRenderer<TComponent, TRenderOutput, TBlockData> {
    constructor(config: BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>);
}

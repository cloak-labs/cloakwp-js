import { BlockRenderer, BlockRendererConfig } from "cloakcms";
import { RestApiBlockData } from "./types";

/**
 * A tiny wrapper around the BlockRenderer class from `render-blocks`, simply
 * for the purposes of setting the `TBlockData` type parameter to default to CloakWP's
 * `RestApiBlockData` type, saving users from having to manually specify this type param.
 * Having users use this wrapper also sets us up for future WP-specific customizations
 * of the BlockRenderer without having to issue breaking changes.
 */
export class WPBlockRenderer<
  TComponent = any,
  TRenderOutput = any,
  TBlockData = RestApiBlockData
> extends BlockRenderer<TComponent, TRenderOutput, TBlockData> {
  constructor(
    config: BlockRendererConfig<TComponent, TRenderOutput, Partial<TBlockData>>
  ) {
    // set a default value for `blockIdField` to "name", which is what CloakWP's `RestApiBlockData` uses
    let configWithDefaults = {
      blockIdField: "name" as keyof TBlockData,
      ...config,
    };
    super(configWithDefaults);
  }
}

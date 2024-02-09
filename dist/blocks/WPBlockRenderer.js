import { BlockRenderer } from "cloakcms";
/**
 * A tiny wrapper around the BlockRenderer class from `@kaelan/render-blocks`, simply
 * for the purposes of setting the `TBlockData` type parameter to default to CloakWP's
 * `RestApiBlockData` type, saving users from having to manually specify this type param.
 * Having users use this wrapper also sets us up for future WP-specific customizations
 * of the BlockRenderer without having to issue breaking changes.
 */
export class WPBlockRenderer extends BlockRenderer {
    constructor(config) {
        // set a default value for `blockIdField` to "name", which is what CloakWP's `RestApiBlockData` uses
        let configWithDefaults = {
            blockIdField: "name",
            ...config,
        };
        super(configWithDefaults);
    }
}

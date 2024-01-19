"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WPBlockRenderer = void 0;
const cloakcms_1 = require("cloakcms");
/**
 * A tiny wrapper around the BlockRenderer class from `render-blocks`, simply
 * for the purposes of setting the `TBlockData` type parameter to default to CloakWP's
 * `RestApiBlockData` type, saving users from having to manually specify this type param.
 * Having users use this wrapper also sets us up for future WP-specific customizations
 * of the BlockRenderer without having to issue breaking changes.
 */
class WPBlockRenderer extends cloakcms_1.BlockRenderer {
    constructor(config) {
        // set a default value for `blockIdField` to "name", which is what CloakWP's `RestApiBlockData` uses
        let configWithDefaults = {
            blockIdField: "name",
            ...config,
        };
        super(configWithDefaults);
    }
}
exports.WPBlockRenderer = WPBlockRenderer;

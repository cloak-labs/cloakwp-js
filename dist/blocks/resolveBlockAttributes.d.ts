import { WPBlockDataWithExtraContext } from "./types";
import { WPBlockRenderer } from "./WPBlockRenderer";
/**
 * Sometimes attributes bindings.
 */
export declare const resolveBlockAttributes: (block: WPBlockDataWithExtraContext, blockRenderer: WPBlockRenderer) => WPBlockDataWithExtraContext["attrs"];

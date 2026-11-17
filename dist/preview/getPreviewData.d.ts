import type { WPClient } from "../rest/types.js";
import type { PreviewModeParams } from "./types.js";
/** Fetch an authorized preview by WP ID, even when its public slug doesn't exist. */
export declare function getPreviewData(previewParams: PreviewModeParams, serverApiClient?: WPClient): Promise<Record<string, any> | null>;
//# sourceMappingURL=getPreviewData.d.ts.map
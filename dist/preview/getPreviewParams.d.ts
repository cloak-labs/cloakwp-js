import { type PreviewModeParams } from "./types";
export declare const getPreviewParams: (revisionId: string, postId: string, postType: string) => PreviewModeParams | {
    error: string;
};

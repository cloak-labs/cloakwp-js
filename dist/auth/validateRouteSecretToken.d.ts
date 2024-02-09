export declare function validateRouteSecretToken(secret: string): {
    error: string;
    valid?: undefined;
} | {
    valid: boolean;
    error?: undefined;
};

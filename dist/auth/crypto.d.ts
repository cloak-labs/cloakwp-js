export declare function constantTimeEqual(a: string, b: string): boolean;
export declare function hmacSha256(secret: string, message: string): Promise<Uint8Array>;
export declare function bytesToHex(bytes: Uint8Array): string;
export declare function base64UrlToBytes(value: string): Uint8Array | null;
export declare function bytesToBase64Url(bytes: Uint8Array): string;
export declare function constantTimeBytesEqual(actual: Uint8Array, expected: Uint8Array): boolean;
//# sourceMappingURL=crypto.d.ts.map
export type MachineAuthScheme = "basic" | "bearer" | null;
export type MachineAuthConfig = {
    jwt?: string | null;
    applicationUser?: string | null;
    applicationPassword?: string | null;
    dangerouslyIgnoreExposedJwtWarning?: boolean;
};
export type ResolvedMachineAuth = {
    authorization: string | null;
    scheme: MachineAuthScheme;
};
export declare function resetMachineAuthWarnings(): void;
export declare function assertMachineAuthNotExposed(auth: MachineAuthConfig | undefined, isBrowser: boolean): void;
export declare function resolveMachineAuth(auth: MachineAuthConfig | undefined): ResolvedMachineAuth;
//# sourceMappingURL=machineAuth.d.ts.map
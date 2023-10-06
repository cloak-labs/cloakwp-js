"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withCloakWP = void 0;
/**
 * A function to merge CloakWP-related Next.js config with a user defined Next.js config
 *
 * @param {NextConfig} userNextConfig The user's Next.js config
 */
function withCloakWP(userNextConfig) {
    /*
      currently, we simply return the userNextConfig without modifying it.
      Why? Better to have this function in user's apps so that they don't
      need to add it after upgrading to a future version that does modify
      things here. Future-proofing.
     */
    return userNextConfig;
}
exports.withCloakWP = withCloakWP;

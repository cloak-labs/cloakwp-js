import { type RestApiBlockData } from "./types";
/**
 * Flattens an array of blocks by moving all nested innerBlocks to the root level.
 * This is useful when you want to check if a particular block is being rendered on a page, for example;
 * you first flatten the blocks, then simply loop over them to find the block you're looking for.
 *
 * @param blocks - An array of RestApiBlockData objects to flatten
 * @returns A new flat array containing all blocks with innerBlocks moved to the root level
 */
export declare function flattenBlocks(blocks: RestApiBlockData[]): RestApiBlockData[];

import { useContext } from "react";
import { BlockConfigContext } from "../context/blockConfig";
import { GlobalBlocksConfig } from "../types";

export function useBlockConfig(): GlobalBlocksConfig {
  let config = useContext(BlockConfigContext);
  return config;
}

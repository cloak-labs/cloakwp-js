import Blocks from "./Blocks";

export function BlocksPage({ pageData }) {
  return <Blocks data={pageData?.blocks_data} />;
}

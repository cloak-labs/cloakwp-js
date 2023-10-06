export interface WPInstanceOptions {
  url: string;
  jwt: string;
  adminPath?: string;
  contentPath?: string;
  name?: string;
}

export interface RestApiClientProps {
  jwt?: string;
}

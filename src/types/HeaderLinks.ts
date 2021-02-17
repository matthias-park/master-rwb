interface HeaderLink {
  mobileLink?: true;
  name: string;
  path?: string;
  order?: number;
  externalLink?: true;
  prefix?: string;
  links?: {
    text: string;
    path: string;
    order: number;
    onlyLoggedIn?: boolean;
  }[];
}

export default HeaderLink;

interface HeaderLink {
  path?: string;
  name: string;
  order?: number;
  children?: HeaderLink[];
}

export default HeaderLink;

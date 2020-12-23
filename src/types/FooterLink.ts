interface FooterLink {
  name: string;
  order: number;
  children: {
    name: string;
    link?: string;
    order: number;
    button?: boolean;
  }[];
}

export default FooterLink;

interface FooterLink {
  name: string;
  order: number;
  children: {
    name: string;
    link?: string;
    order: number;
  }[];
}

export default FooterLink;

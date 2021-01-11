export interface FooterLink {
  order: number;
  children: {
    name: string;
    order: number;
    children: {
      name: string;
      link?: string;
      order: number;
      button?: boolean;
    }[];
  }[];
}

export interface SocialLinks {
  androidApp?: string;
  iosApp?: string;
  mail?: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}
export interface SubFooter {
  title: string;
  links: {
    name: string;
    link: string;
    order: number;
  }[];
}

interface FooterData {
  links: FooterLink[];
  social: SocialLinks;
  subFooter: SubFooter;
}

export default FooterData;
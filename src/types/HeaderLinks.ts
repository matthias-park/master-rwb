export interface HeaderLinkCardButton {
  name: string;
  path: string;
}
interface HeaderLink {
  mobileLink?: true;
  name: string;
  path?: string;
  order?: number;
  externalLink?: true;
  cards?: {
    path?: string;
    logo?: string;
    smallText?: string;
    smallTextIcon?: true;
    text?: string;
    order: number;
    color?: string;
    button1?: HeaderLinkCardButton;
    button2?: HeaderLinkCardButton;
  }[];
  links?: {
    text: string;
    path: string;
    order: number;
  }[];
  bottomButton?: HeaderLinkCardButton;
}

export default HeaderLink;

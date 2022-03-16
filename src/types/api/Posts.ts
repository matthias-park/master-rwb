export interface PostItem {
  id: number;
  user_id: number;
  language_id: number;
  category: string;
  slug: string;
  title: string;
  body: string;
  image: Image;
  created_at: Date;
  updated_at: Date;
  excerpt: string;
  expiration_date: Date | null;
  sticky: number;
  page_title: string;
  alternative_url: string;
  use_alternative_url: boolean;
  publish_date: Date;
  bg_image: BgImage;
  front_image: null;
  bgcolor: string;
  display_mode: number;
  visible: boolean;
  open_in_new_window: boolean;
  jackpot_id: null;
  show_for: number;
  priority: number;
  franchise_id: number;
  image_large: ImageLarge;
  bg_image_tablet: BgImage;
  bg_image_mobile: BgImage;
  short_description: null;
  link_text: null;
  button_text: null | string;
  bg_image_link: null | string;
  subcategory: number | null;
  inner_page_button_link: null | string;
  campaign_id: number | null;
  segment: string | null;
}

export interface BgImage {
  url: null | string;
  medium: ImageUrl;
}

export interface ImageUrl {
  url: null | string;
}

export interface Image {
  url: string;
  medium: ImageUrl;
  thumb_140_100: ImageUrl;
  thumb_150_150: ImageUrl;
  thumb_240_180: ImageUrl;
  thumb_300_300: ImageUrl;
  thumb_420_280: ImageUrl;
  thumb_500_250: ImageUrl;
  thumb_530_300: ImageUrl;
  thumb_540_300: ImageUrl;
  thumb_570_320: ImageUrl;
  thumb_700_320: ImageUrl;
}

export interface ImageLarge {
  url: null;
  medium: ImageUrl;
  thumb_860_280: ImageUrl;
}

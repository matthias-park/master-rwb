export type Category = {
  front_page_quantity?: number;
  icon: string;
  id: number;
  name: string;
  order_id?: number;
  slug: string;
  translated_name?: string;
};

export type Provider = {
  id: number;
  image?: string;
  slug: string;
};

export type Game = {
  id: number;
  categories: number[];
  features?: ('hot' | 'new' | 'most_winning' | 'front_page')[];
  game_id?: string;
  image?: string;
  name: string;
  order_id?: number;
  provider: { id: number; name: string };
  slug: string;
  translated_name?: string;
};

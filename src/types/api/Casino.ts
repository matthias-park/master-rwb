export type Category = {
  front_page_quantity?: number;
  icon: string;
  id: number;
  name: string;
  order_id?: number;
  slug: string;
  translated_name?: string;
  image?: string;
};

export type Provider = {
  id: number;
  image?: string;
  slug: string;
};

export type Game = {
  id: number;
  categories: number[];
  features?: string[];
  game_id?: string;
  image?: string;
  name: string;
  order_id?: number;
  provider: { id: number; name: string };
  slug: string;
  translated_name?: string;
  genre?: string;
  max_bet?: string;
  max_payout?: string;
  min_bet?: string;
  paylines?: number;
  reels?: number;
  rtr?: string;
  theme?: string;
  volatility?: number;
  short_description?: string;
  bottom_ribbon?: string;
};

export type Filters = {
  categoryFilter: Category | null;
  providerFilterGroup: Provider[];
  genreFilterGroup: string[];
  themeFilterGroup: string[];
};

export type SearchData = {
  showSearch: boolean;
  searchValue: string;
  games: Game[] | null;
  loading: boolean;
};

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
  loading: boolean;
  categoryFilterGroup: Category[];
  providerFilterGroup: Provider[];
  genreFilterGroup: string[];
  themeFilterGroup: string[];
  featureFilterGroup: string[];
};

export type SearchData = {
  showSearch: boolean;
  searchValue: string;
  games: Game[] | null;
  loading: boolean;
};

export enum CasinoType {
  Casino = 'casino',
  LiveCasino = 'live-casino',
  Unset = 'unset',
}

export enum SearchActions {
  Show = 1,
  Hide = 2,
  SetValue = 3,
  SetGames = 4,
  StartLoading = 5,
  FinishLoading = 6,
}

export enum FilterActions {
  StartLoading = 'loading-start',
  FinishLoading = 'loading-finish',
  AddCategory = 'category-add',
  AddProvider = 'provider-add',
  AddGenre = 'genre-add',
  AddTheme = 'theme-add',
  AddFeature = 'feature-add',
  RemoveCategory = 'category-remove',
  RemoveProvider = 'provider-remove',
  RemoveGenre = 'genre-remove',
  RemoveTheme = 'theme-remove',
  RemoveFeature = 'feature-remove',
  ResetCategory = 'category-reset',
  ResetProvider = 'provider-reset',
  ResetGenre = 'genre-reset',
  ResetTheme = 'theme-reset',
  ResetFeature = 'feature-reset',
}

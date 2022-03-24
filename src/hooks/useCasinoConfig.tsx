import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { useLocation } from 'react-router-dom';
import useApi from './useApi';
import {
  Category,
  Provider,
  Game,
  Filters,
  SearchData,
} from '../types/api/Casino';
import { postApi } from '../utils/apiUtils';
import RailsApiResponse from '../types/api/RailsApiResponse';
import useEffectSkipInitial from './useEffectSkipInitial';
import { useAuth } from './useAuth';
import { useHistory } from 'react-router-dom';
import { useModal } from './useModal';
import { ComponentName, Franchise, PagesName } from '../constants';
import { useRoutePath } from './index';

type CasinoConfig = {
  categories: Category[];
  providers: Provider[];
  activeCategory: Category | null;
  activeProvider: Provider | null;
  setParams: (params: any) => void;
  games: Game[] | null;
  setGames: (games: Game[] | null) => void;
  filteredGames: Game[] | null;
  setFilteredGames: (games: Game[] | null) => void;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  casinoType: CasinoType;
  orderBy: { attr: string; type: string } | null;
  setOrderBy: (value: { attr: string; type: string } | null) => void;
  searchData: SearchData;
  setSearchData: Dispatch<SetStateAction<SearchData>>;
  favouriteGames: Game[];
  setFavouriteGame: (games: { add?: number[]; remove?: number[] }) => void;
  recentGames: Game[];
  recentGamesDataMutate: () => void;
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  loadGame: (game: Game, demo?: boolean) => void;
};

enum CasinoType {
  Casino = 'casino',
  LiveCasino = 'live-casino',
}

export const casinoConfig = createContext<CasinoConfig | null>(null);

export const useCasinoConfig = () => {
  const instance = useContext(casinoConfig);
  if (!instance) {
    throw new Error(
      'There was an error getting Casino Config instance from context',
    );
  }
  return instance;
};

export const CasinoConfigProvider = props => {
  const { user } = useAuth();
  const { enableModal } = useModal();
  const history = useHistory();
  const loginPath = useRoutePath(PagesName.LoginPage, true);
  const { data: categoriesData, error: categoriesError } = useApi<any>(
    '/restapi/v1/casino/categories',
  );
  const { data: providersData, error: providersError } = useApi<any>(
    '/restapi/v1/casino/custom_providers',
  );
  const { data: liveCategoriesData, error: liveCategoriesError } = useApi<any>(
    '/restapi/v1/casino/live_categories',
  );
  const {
    data: favouriteGamesData,
    error: favouriteGamesDataError,
    mutate: favouriteGamesDataMutate,
  } = useApi<any>(user.logged_in ? '/restapi/v1/casino/favourite_games' : '');
  const {
    data: recentGamesData,
    error: recentGamesDataError,
    mutate: recentGamesDataMutate,
  } = useApi<any>(
    user.logged_in ? '/restapi/v1/casino/recent_casino_games' : '',
  );
  const [params, setParams] = useState<{
    category?: string;
    provider?: string;
  } | null>();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeProvider, setActiveProvider] = useState<Provider | null>(null);
  const [currentGames, setCurrentGames] = useState<Game[] | null>(null);
  const [filteredGames, setFilteredGames] = useState<Game[] | null>(null);
  const [casinoType, setCasinoType] = useState<CasinoType>(CasinoType.Casino);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchData, setSearchData] = useState<SearchData>({
    showSearch: false,
    searchValue: '',
    games: [],
    loading: false,
  });
  const [filters, setFilters] = useState<Filters>({
    categoryFilter: null,
    providerFilterGroup: [],
    genreFilterGroup: [],
    themeFilterGroup: [],
    featureFilterGroup: [],
  });
  const [orderBy, setOrderBy] = useState<{ attr: string; type: string } | null>(
    null,
  );
  const location = useLocation();

  const setFavouriteGame = async (games: {
    add?: number[];
    remove?: number[];
  }) => {
    const response: RailsApiResponse<Game[] | null> = await postApi<
      RailsApiResponse<Game[]>
    >('/restapi/v1/casino/set_favourite_games', {
      game_ids: {
        add: games.add,
        remove: games.remove,
      },
    }).catch((response: RailsApiResponse<null>) => {
      return response;
    });
    if (response.Success) {
      favouriteGamesDataMutate();
    }
  };

  const searchGames = async value => {
    setSearchData(prev => ({ ...prev, loading: true }));
    const response: RailsApiResponse<Game[] | null> = await postApi<
      RailsApiResponse<Game[]>
    >('/restapi/v1/casino/games/search', {
      name: value,
    }).catch((response: RailsApiResponse<null>) => {
      return response;
    });
    if (response.Success && response.Data) {
      setSearchData(prev => ({ ...prev, games: response.Data }));
      setSearchData(prev => ({ ...prev, loading: false }));
    }
  };

  const loadGame = (gameData, demo = false) => {
    if (user.logged_in || demo) {
      history.push(`/casino/game/${gameData?.slug}`, {
        id: gameData?.id,
        gameId: gameData?.game_id,
        name: gameData?.name,
        provider: gameData?.provider.name,
        demo: demo,
      });
      window.__config__.componentSettings?.limitsOnAction?.includes(
        'playCasino',
      ) && enableModal(ComponentName.LimitsModal);
    } else {
      Franchise.xCasino
        ? enableModal(ComponentName.LoginModal)
        : history.push(loginPath);
    }
  };

  useEffectSkipInitial(() => {
    searchGames(searchData.searchValue);
  }, [searchData.searchValue]);

  useEffect(() => {
    if (currentGames) {
      const currentGamesCopy = [...currentGames];
      const sortedGames = orderBy
        ? [
            ...currentGamesCopy?.sort((a, b) =>
              orderBy.type === 'asc'
                ? a[orderBy.attr].localeCompare(b[orderBy.attr])
                : b[orderBy.attr].localeCompare(a[orderBy.attr]),
            ),
          ]
        : currentGames;
      const filteredGames = sortedGames
        .filter(
          game =>
            filters.providerFilterGroup?.some(
              providerFilter => providerFilter.id === game.provider.id,
            ) || !filters.providerFilterGroup.length,
        )
        .filter(
          game =>
            (filters.categoryFilter &&
              game.categories.includes(filters.categoryFilter.id)) ||
            !filters.categoryFilter,
        )
        .filter(
          game =>
            filters.genreFilterGroup?.some(
              genreFilter => genreFilter === game.genre,
            ) || !filters.genreFilterGroup.length,
        )
        .filter(
          game =>
            filters.themeFilterGroup?.some(
              themeFilter => themeFilter === game.theme,
            ) || !filters.themeFilterGroup.length,
        )
        .filter(
          game =>
            filters.featureFilterGroup?.some(featureFilter =>
              game?.features?.includes(featureFilter),
            ) || !filters.featureFilterGroup.length,
        );
      setFilteredGames(filteredGames);
    }
  }, [filters, orderBy, currentGames]);

  useEffect(() => {
    setSelectedGame(null);
    setSearchData(prev => ({ ...prev, showSearch: false }));
    location.pathname.includes('live-casino')
      ? setCasinoType(CasinoType.LiveCasino)
      : setCasinoType(CasinoType.Casino);

    if (Franchise.xCasino || Franchise.xCasinoCom) {
      setFilters(prev => ({
        ...prev,
        categoryFilter: null,
        providerFilterGroup: [],
      }));
    }

    if (Franchise.gnogon && !location.pathname.includes('casino')) {
      setFilters(prev => ({
        ...prev,
        providerFilterGroup: [],
        genreFilterGroup: [],
        themeFilterGroup: [],
      }));
      setOrderBy(null);
    }
  }, [location]);

  useEffect(() => {
    if (params?.category && (categoriesData || liveCategoriesData)) {
      const category =
        casinoType === CasinoType.Casino
          ? categoriesData?.Data?.find(
              category => category.slug === params?.category,
            )
          : liveCategoriesData?.Data?.find(
              category => category.slug === params?.category,
            );
      setActiveCategory(category);
      setActiveProvider(null);
      return;
    } else if (params?.provider && providersData) {
      const provider = providersData?.Data?.find(
        provider => provider.slug === params?.provider,
      );
      setActiveProvider(provider);
      setActiveCategory(null);
      return;
    }
    setActiveCategory(null);
    setActiveProvider(null);
  }, [params, providersData, categoriesData]);

  useEffect(() => {
    Franchise.xCasino &&
      setSearchData(prev => ({
        ...prev,
        showSearch: !!searchData.searchValue.length,
      }));
  }, [searchData.searchValue]);

  const value: CasinoConfig = {
    categories:
      casinoType === CasinoType.Casino
        ? categoriesData?.Data
        : liveCategoriesData?.Data,
    providers: providersData?.Data || [],
    activeCategory,
    activeProvider,
    searchData,
    setSearchData,
    setParams,
    games: currentGames,
    setGames: setCurrentGames,
    filteredGames,
    setFilteredGames,
    filters,
    setFilters,
    casinoType,
    orderBy,
    setOrderBy,
    favouriteGames: favouriteGamesData?.Data || [],
    setFavouriteGame,
    recentGames: recentGamesData?.Data || [],
    recentGamesDataMutate,
    selectedGame,
    setSelectedGame,
    loadGame,
  };

  return (
    <casinoConfig.Provider value={value}>
      {props.children}
    </casinoConfig.Provider>
  );
};

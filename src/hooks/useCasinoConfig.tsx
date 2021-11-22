import React, { useState, createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useApi from './useApi';
import { Category, Provider, Game } from '../types/api/Casino';
import { postApi } from '../utils/apiUtils';
import RailsApiResponse from '../types/api/RailsApiResponse';
import useEffectSkipInitial from './useEffectSkipInitial';
import { useAuth } from './useAuth';
import { useHistory } from 'react-router-dom';
import { useModal } from './useModal';
import { ComponentName } from '../constants';

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
  categoryFilter: Category | null;
  setCategoryFilter: (category: Category | null) => void;
  providerFilter: Provider | null;
  setProviderFilter: (provider: Provider | null) => void;
  casinoType: CasinoType;
  orderBy: { attr: string; type: string } | null;
  setOrderBy: (value: { attr: string; type: string } | null) => void;
  searchData: {
    showSearch: boolean;
    searchValue: string;
    games: Game[] | null;
    loading: boolean;
  };
  setSearchData: (value: {
    showSearch: boolean;
    searchValue: string;
    games: Game[] | null;
    loading: boolean;
  }) => void;
  favouriteGames: Game[];
  setFavouriteGame: (games: { add?: number[]; remove?: number[] }) => void;
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  loadGame: (game: Game) => void;
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
  const { data: categoriesData, error: categoriesError } = useApi<any>(
    '/railsapi/v1/casino/categories',
  );
  const { data: providersData, error: providersError } = useApi<any>(
    '/railsapi/v1/casino/custom_providers',
  );
  const { data: liveCategoriesData, error: liveCategoriesError } = useApi<any>(
    '/railsapi/v1/casino/live_categories',
  );
  const {
    data: favouriteGamesData,
    error: favouriteGamesDataError,
    mutate: favouriteGamesDataMutate,
  } = useApi<any>(user.logged_in ? '/railsapi/v1/casino/favourite_games' : '');
  const [params, setParams] = useState<{
    category?: string;
    provider?: string;
  } | null>();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeProvider, setActiveProvider] = useState<Provider | null>(null);
  const [currentGames, setCurrentGames] = useState<Game[] | null>(null);
  const [filteredGames, setFilteredGames] = useState<Game[] | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);
  const [providerFilter, setProviderFilter] = useState<Provider | null>(null);
  const [casinoType, setCasinoType] = useState<CasinoType>(CasinoType.Casino);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchData, setSearchData] = useState<{
    showSearch: boolean;
    searchValue: string;
    games: Game[] | null;
    loading: boolean;
  }>({
    showSearch: false,
    searchValue: '',
    games: [],
    loading: false,
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

  const loadGame = gameData => {
    if (user.logged_in) {
      history.push(`/casino/game/${gameData?.slug}`, {
        id: gameData?.id,
        gameId: gameData?.game_id,
        name: gameData?.name,
        provider: gameData?.provider.name,
      });
      window.__config__.componentSettings?.limitsOnAction?.includes(
        'playCasino',
      ) && enableModal(ComponentName.LimitsModal);
    } else {
      enableModal(ComponentName.LoginModal);
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
          game => game.provider.id === providerFilter?.id || !providerFilter,
        )
        .filter(
          game =>
            (categoryFilter && game.categories.includes(categoryFilter.id)) ||
            !categoryFilter,
        );
      setFilteredGames(filteredGames);
    }
  }, [categoryFilter, providerFilter, orderBy, currentGames]);

  useEffect(() => {
    setSelectedGame(null);
    setSearchData(prev => ({ ...prev, showSearch: false }));
    setCategoryFilter(null);
    setProviderFilter(null);
    location.pathname.includes('live-casino')
      ? setCasinoType(CasinoType.LiveCasino)
      : setCasinoType(CasinoType.Casino);
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
    categoryFilter,
    setCategoryFilter,
    providerFilter,
    setProviderFilter,
    casinoType,
    orderBy,
    setOrderBy,
    favouriteGames: favouriteGamesData?.Data || [],
    setFavouriteGame,
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

import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
  useReducer,
} from 'react';
import { useLocation } from 'react-router-dom';
import useApi from './useApi';
import {
  Category,
  Provider,
  Game,
  Filters,
  SearchData,
  CasinoType,
  FilterActions,
  SearchActions,
} from '../types/api/Casino';
import { postApi } from '../utils/apiUtils';
import RailsApiResponse from '../types/api/RailsApiResponse';
import useEffectSkipInitial from './useEffectSkipInitial';
import { useAuth } from './useAuth';
import { useHistory } from 'react-router-dom';
import { useModal } from './useModal';
import {
  ComponentName,
  Franchise,
  PagesName,
  ComponentSettings,
} from '../constants';
import { useRoutePath } from './index';
import { RootState } from '../state';
import { useDispatch, useSelector } from 'react-redux';
import { setValidationReason } from '../state/reducers/geoComply';

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
  setFilters: Dispatch<SetStateAction<any>>;
  casinoType: CasinoType;
  orderBy: { attr: string; type: string } | null;
  setOrderBy: (value: { attr: string; type: string } | null) => void;
  searchData: SearchData;
  setSearchData: Dispatch<SetStateAction<any>>;
  favouriteGames: Game[];
  setFavouriteGame: (games: { add?: number[]; remove?: number[] }) => void;
  recentGames: Game[];
  recentGamesDataMutate: () => void;
  selectedGame: Game | null;
  setSelectedGame: (game: Game | null) => void;
  loadGame: (game: Game, demo?: boolean) => void;
};

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

const searchReducer = (state, action) => {
  switch (action.type) {
    case SearchActions.Show:
      return { ...state, showSearch: true };
    case SearchActions.Hide:
      return { ...state, showSearch: false };
    case SearchActions.SetValue:
      return { ...state, searchValue: action.payload };
    case SearchActions.SetGames:
      return { ...state, games: action.payload };
    case SearchActions.StartLoading:
      return { ...state, loading: true };
    case SearchActions.FinishLoading:
      return { ...state, loading: false };
    default:
      return state;
  }
};

const filtersReducer = (state, action) => {
  let filterProp;
  switch (action.type) {
    case FilterActions.StartLoading:
      return { ...state, loading: true };
    case FilterActions.FinishLoading:
      return { ...state, loading: false };
    case FilterActions.AddCategory:
    case FilterActions.AddProvider:
    case FilterActions.AddGenre:
    case FilterActions.AddTheme:
    case FilterActions.AddFeature:
      filterProp = `${action.type.replace('-add', '')}FilterGroup`;
      return { ...state, [filterProp]: [...state[filterProp], action.payload] };
    case FilterActions.RemoveCategory:
    case FilterActions.RemoveProvider:
      filterProp = `${action.type.replace('-remove', '')}FilterGroup`;
      return {
        ...state,
        [filterProp]: state[filterProp].filter(
          selectedFilter => selectedFilter.id !== action.payload.id,
        ),
      };
    case FilterActions.RemoveGenre:
    case FilterActions.RemoveTheme:
    case FilterActions.RemoveFeature:
      filterProp = `${action.type.replace('-remove', '')}FilterGroup`;
      return {
        ...state,
        [filterProp]: state[filterProp].filter(
          selectedFilter => selectedFilter !== action.payload,
        ),
      };
    case FilterActions.ResetCategory:
    case FilterActions.ResetProvider:
    case FilterActions.ResetGenre:
    case FilterActions.ResetTheme:
    case FilterActions.ResetFeature:
      filterProp = `${action.type.replace('-reset', '')}FilterGroup`;
      return { ...state, [filterProp]: [] };
    default:
      return state;
  }
};

const checkGameAttr = (
  selectedFilter,
  gameAttr,
  nestedAttr?: string,
  nestedGameAttr?: string,
) => {
  return (
    selectedFilter?.some(value => {
      if (!!nestedAttr && !!nestedGameAttr) {
        return Array.isArray(gameAttr)
          ? gameAttr.some(attr => attr[nestedGameAttr] === value[nestedAttr])
          : value[nestedAttr] === gameAttr[nestedGameAttr];
      } else if (!!nestedAttr) {
        return Array.isArray(gameAttr)
          ? gameAttr.includes(value[nestedAttr])
          : value[nestedAttr] === gameAttr;
      } else {
        return Array.isArray(gameAttr)
          ? gameAttr.includes(value)
          : value === gameAttr;
      }
    }) || !selectedFilter.length
  );
};

export const CasinoConfigProvider = props => {
  const { user } = useAuth();
  const { enableModal } = useModal();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const geoComplyValidationNeeded = useSelector((state: RootState) => {
    if (
      !state.user.logged_in ||
      !ComponentSettings?.geoComply?.checkOnCasinoGame
    ) {
      return false;
    }
    return (
      (state.geoComply.error || state.geoComply.savedState?.geoError) == null &&
      !state.geoComply.isGeoAllowed &&
      state.geoComply.isConnected
    );
  });
  const loginPath = useRoutePath(PagesName.LoginPage, true);
  const casinoPath = useRoutePath(PagesName.CasinoPage);
  const liveCasinoPath = useRoutePath(PagesName.LiveCasinoPage);
  const { data: categoriesData } = useApi<any>('/restapi/v1/casino/categories');
  const { data: providersData } = useApi<any>(
    '/restapi/v1/casino/custom_providers',
  );
  const { data: liveCategoriesData } = useApi<any>(
    '/restapi/v1/casino/live_categories',
  );
  const { data: favouriteGamesData, mutate: favouriteGamesDataMutate } = useApi<
    any
  >(user.logged_in ? '/restapi/v1/casino/favourite_games' : '');
  const { data: recentGamesData, mutate: recentGamesDataMutate } = useApi<any>(
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
  const [orderBy, setOrderBy] = useState<{ attr: string; type: string } | null>(
    null,
  );
  const [searchData, setSearchData] = useReducer(searchReducer, {
    showSearch: false,
    searchValue: '',
    games: [],
    loading: false,
  });
  const [filters, setFilters] = useReducer(filtersReducer, {
    loading: false,
    categoryFilterGroup: [],
    providerFilterGroup: [],
    genreFilterGroup: [],
    themeFilterGroup: [],
    featureFilterGroup: [],
  });

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

  const searchGames = async () => {
    setSearchData({ type: SearchActions.StartLoading });
    const response: RailsApiResponse<Game[] | null> = await postApi<
      RailsApiResponse<Game[]>
    >('/restapi/v1/casino/games/search', {
      name: searchData.searchValue,
    }).catch((response: RailsApiResponse<null>) => {
      return response;
    });
    if (response.Success && response.Data) {
      setSearchData({ type: SearchActions.SetGames, payload: response.Data });
      setSearchData({ type: SearchActions.FinishLoading });
    }
  };

  const loadGame = (gameData, demo = false) => {
    if (user.logged_in || demo) {
      if (!demo && geoComplyValidationNeeded) {
        dispatch(setValidationReason('load casino game'));
      }
      history.push(`/casino/game/${gameData?.slug}`, {
        id: gameData?.id,
        gameId: gameData?.game_id,
        name: gameData?.name,
        provider: gameData?.provider.name,
        demo: demo,
        hasGameTimer: gameData?.has_game_timer,
      });
      window.__config__.componentSettings?.limitsOnAction?.includes(
        'playCasino',
      ) && enableModal(ComponentName.LimitsModal);
    } else {
      history.push(`${loginPath}?message=casino_game_launch_attempt`);
    }
  };

  useEffectSkipInitial(() => {
    searchGames();

    if (Franchise.xCasino || Franchise.xCasinoCom) {
      searchData.searchValue.length
        ? setSearchData({ type: SearchActions.Show })
        : setSearchData({ type: SearchActions.Hide });
    }
  }, [searchData.searchValue]);

  useEffect(() => {
    if (currentGames) {
      setFilters({ type: FilterActions.StartLoading });
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
      const filteredGames = sortedGames.filter(
        game =>
          checkGameAttr(filters.categoryFilterGroup, game.categories, 'id') &&
          checkGameAttr(
            filters.providerFilterGroup,
            game.provider,
            'id',
            'id',
          ) &&
          checkGameAttr(filters.genreFilterGroup, game.genre) &&
          checkGameAttr(filters.themeFilterGroup, game.theme) &&
          checkGameAttr(filters.featureFilterGroup, game.features),
      );
      setFilteredGames(filteredGames);
      setFilters({ type: FilterActions.FinishLoading });
    }
  }, [
    filters.categoryFilterGroup,
    filters.providerFilterGroup,
    filters.genreFilterGroup,
    filters.themeFilterGroup,
    filters.featureFilterGroup,
    orderBy,
    currentGames,
  ]);

  useEffect(() => {
    if (location.pathname !== loginPath) setSelectedGame(null);
    setSearchData({ type: SearchActions.Hide });

    location.pathname.includes(liveCasinoPath) &&
      setCasinoType(CasinoType.LiveCasino);
    location.pathname.includes(casinoPath) && setCasinoType(CasinoType.Casino);
    !location.pathname.includes(casinoPath) &&
      (!location.pathname.includes(liveCasinoPath) || liveCasinoPath === '/') &&
      setCasinoType(CasinoType.Unset);

    if (Franchise.xCasino || Franchise.xCasinoCom) {
      setFilters({ type: FilterActions.ResetCategory });
      setFilters({ type: FilterActions.ResetProvider });
    }
  }, [location]);

  useEffect(() => {
    if (Franchise.gnogon && casinoType === CasinoType.Unset) {
      setFilters({ type: FilterActions.ResetProvider });
      setFilters({ type: FilterActions.ResetGenre });
      setFilters({ type: FilterActions.ResetTheme });
      setOrderBy(null);
    }
  }, [casinoType]);

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

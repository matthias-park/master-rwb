import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import Button from 'react-bootstrap/Button';
import { useUIConfig } from '../../../../hooks/useUIConfig';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import { ComponentName } from '../../../../constants';
import { useAuth } from '../../../../hooks/useAuth';
import { useRoutePath } from '../../../../hooks';
import { PagesName } from '../../../../constants';
import Link from '../../../../components/Link';
import clsx from 'clsx';
import useOnClickOutside from '../../../../hooks/useOnClickOutside';
import { useI18n } from '../../../../hooks/useI18n';
import debounce from 'lodash.debounce';

const CasinoGameSidebar = () => {
  const { t } = useI18n();
  const { backdrop } = useUIConfig();
  const [showSidebar, setShowSidebar] = useState(false);
  const {
    selectedGame,
    setSelectedGame,
    providers,
    loadGame,
    favouriteGames,
    setFavouriteGame,
  } = useCasinoConfig();
  const gameProvider = useMemo(
    () =>
      providers?.find(provider => provider.id === selectedGame?.provider.id),
    [selectedGame?.id],
  );
  const { user } = useAuth();
  const depositPath = useRoutePath(PagesName.DepositPage, true);
  const sidebarContainerRef = useRef<HTMLDivElement | null>(null);
  const isFavourite = useMemo(
    () => favouriteGames.some(game => game.id === selectedGame?.id),
    [favouriteGames, selectedGame],
  );
  const [isFavouriteIconState, setIsFavouriteIconState] = useState(isFavourite);
  const favouriteRef = useRef<boolean>();
  const gameIdRef = useRef<number | undefined>();

  favouriteRef.current = isFavourite;
  gameIdRef.current = selectedGame?.id;

  useEffect(() => {
    setIsFavouriteIconState(false);
  }, [selectedGame]);

  useEffect(() => {
    setIsFavouriteIconState(isFavourite);
  }, [isFavourite]);

  useEffect(() => {
    if (selectedGame) {
      setShowSidebar(true);
      backdrop.toggle(!showSidebar, [ComponentName.RightSidebar]);
    } else {
      setShowSidebar(false);
      backdrop.toggle(false);
    }
  }, [selectedGame]);

  const closeSidebar = () => {
    setSelectedGame(null);
  };

  useOnClickOutside(sidebarContainerRef, () => {
    if (showSidebar) {
      setTimeout(() => {
        closeSidebar();
      }, 100);
    }
  });

  const setFavourite = event => {
    if (gameIdRef.current) {
      event.target.checked
        ? setFavouriteGame({
            [favouriteRef.current ? 'remove' : 'add']: [gameIdRef.current],
          })
        : setFavouriteGame({
            [favouriteRef.current ? 'add' : 'remove']: [gameIdRef.current],
          });
    }
  };

  const setFavouriteCallback = useCallback(debounce(setFavourite, 400), []);

  return (
    <div
      ref={sidebarContainerRef}
      className={clsx(
        'right-sidebar',
        showSidebar && 'show',
        backdrop.ignoredComponents.includes(ComponentName.RightSidebar) &&
          'on-top',
      )}
    >
      {selectedGame && (
        <>
          <div className="game-sidebar__header">
            <div className="d-flex">
              <h5 className="game-sidebar__title">{selectedGame.name}</h5>
              <i
                className="icon-close ml-auto my-auto game-sidebar__close"
                onClick={closeSidebar}
              ></i>
            </div>
            <img
              className="game-sidebar__img"
              alt=""
              src={selectedGame.image}
            ></img>
            <div className="game-sidebar__header-menu">
              <img
                alt=""
                src={gameProvider?.image}
                className="game-sidebar__header-menu-item"
              ></img>
              <label className="game-sidebar__header-menu-item">
                <input
                  type="checkbox"
                  className="d-none"
                  onChange={setFavouriteCallback}
                />
                <i
                  onClick={() => setIsFavouriteIconState(!isFavouriteIconState)}
                  className={clsx(
                    isFavouriteIconState
                      ? 'icon-favourite-on'
                      : 'icon-favourite-off',
                  )}
                ></i>
              </label>
            </div>
          </div>
          <div className="game-sidebar__body">
            <Button
              className="rounded-pill"
              onClick={() => loadGame(selectedGame)}
            >
              {t('play_now')}
            </Button>
            <Button variant="gray-400" className="rounded-pill mt-2">
              {t('try_me')}
            </Button>
            {user.logged_in && (
              <>
                <hr className="divider-solid-light w-100 mt-5 mb-3"></hr>
                <div className="game-sidebar__body-menu">
                  <div className="game-sidebar__balance">
                    <small className="game-sidebar__balance-title">
                      {t('balance')}
                    </small>
                    <h5 className="game-sidebar__balance-amount">
                      {user.currency} {user.balance}
                    </h5>
                  </div>
                  <Button
                    as={Link}
                    to={depositPath}
                    size="sm"
                    variant="secondary"
                    className="rounded-pill px-4"
                  >
                    {t('deposit')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CasinoGameSidebar;

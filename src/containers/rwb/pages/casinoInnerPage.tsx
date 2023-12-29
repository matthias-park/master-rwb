import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { postApi } from '../../../utils/apiUtils';
import { useRoutePath } from '../../../hooks';
import { useCasinoConfig } from '../../../hooks/useCasinoConfig';
import useDesktopWidth from '../../../hooks/useDesktopWidth';
import {
  PagesName,
  ComponentName,
  ComponentSettings,
} from '../../../constants';
import debounce from 'lodash.debounce';
import { StyledCasinoInnerPage } from '../components/styled/casinoStyles';
import { useI18n } from '../../../hooks/useI18n';
import useApi from '../../../hooks/useApi';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { useModal } from '../../../hooks/useModal';
import clsx from 'clsx';
import loadable from '@loadable/component';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state';
import { ThemeSettings } from '../../../constants';
import SessionTimer from '../../../components/SessionTimer';
import Lockr from 'lockr';
import dayjs from 'dayjs';

const LoadableGeoComplyAlert = loadable(
  () => import('../components/header/GeoComplyAlert'),
);

const CasinoInnerPage = () => {
  const { t, jsxT } = useI18n();
  const { icons: icon } = ThemeSettings!;
  const { user } = useAuth();
  const location: any = useLocation();
  const { slug } = useParams<{ slug?: string }>();
  const history = useHistory();
  const showGeoComplyAlert = useSelector((state: RootState) => {
    if (
      !state.user.logged_in ||
      !ComponentSettings?.header?.geoComplyStatusAlert
    ) {
      return false;
    }
    return (
      state.geoComply.geoInProgress ||
      !!state.geoComply.error ||
      !!state.geoComply.savedState?.geoError
    );
  });
  const { id, gameId, name, provider, demo } = location.state || {};
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<
    | (HTMLIFrameElement & {
        mozRequestFullScreen(): Promise<void>;
        webkitRequestFullscreen(): Promise<void>;
        msRequestFullscreen(): Promise<void>;
      })
    | null
  >(null);
  const tablet = useDesktopWidth(768);
  const [error, setError] = useState<string | null>(null);
  const {
    favouriteGames,
    setFavouriteGame,
    recentGamesDataMutate,
  } = useCasinoConfig();
  const { data: gameData, error: gameError } = useApi<any>(
    !id ? `/restapi/v1/casino/game/${slug}` : null,
  );
  const isDataLoading = !gameData && !gameError;
  const isFavourite = useMemo(
    () =>
      favouriteGames.some(
        game => game.id === id || game.id === gameData?.Data?.id,
      ),
    [favouriteGames, gameData],
  );
  const hasDemoParam = !!new URLSearchParams(window.location.search).get(
    'demo',
  );
  const [isFavouriteIconState, setIsFavouriteIconState] = useState(isFavourite);
  const casinoLobbyRoute = useRoutePath(PagesName.CasinoPage);
  const { enableModal } = useModal();

  useEffect(() => {
    if ((id || !!gameData) && (!user.loading || demo || hasDemoParam)) {
      getLaunchUrl();
      return function cleanup() {
        const pragmaticScript = document.getElementById('pragmatic-script');
        pragmaticScript && document.head.removeChild(pragmaticScript);
      };
    }
  }, [gameData, user.logged_in]);

  useEffect(() => {
    if (!location.pathname.includes('casino/game'))
      document.documentElement.style.overflow = '';
  }, [location]);

  useEffect(() => {
    setIsFavouriteIconState(isFavourite);
  }, [favouriteGames, gameData]);

  const addIframeContent = (htmlBase64, url) => {
    if (!iframeRef.current) return;
    if (htmlBase64) {
      if (provider === 'LiveCasinoGames::PragmaticPlayGame') {
        const htmlFromBase64 = new DOMParser().parseFromString(
          atob(htmlBase64),
          'text/html',
        );
        const htmlBase64Iframe = htmlFromBase64.querySelector('iframe');
        const htmlBase64Script = htmlFromBase64.querySelector('script');
        htmlBase64Script?.setAttribute('id', 'pragmatic-script');
        if (htmlBase64Iframe) iframeRef.current.src = htmlBase64Iframe.src;
        if (htmlBase64Script) document.head.appendChild(htmlBase64Script);
      } else {
        iframeRef.current?.contentWindow?.document.open();
        iframeRef.current?.contentWindow?.document.write(atob(htmlBase64));
        iframeRef.current?.contentWindow?.document.close();
      }
    } else if (url) {
      iframeRef.current.src = url;
    }
    recentGamesDataMutate();
  };

  const localStorageTimerKey = 'game-session-timer';
  const getLaunchUrl = async () => {
    Lockr.set(localStorageTimerKey, dayjs());
    const res = await postApi<
      RailsApiResponse<{ url: string; html_base_64: any } | null>
    >('/restapi/v1/casino/launch_url', {
      id: id || gameData?.Data?.id,
      reload_game_url: window.location.href,
      game_provider: provider || gameData?.Data?.provider.name,
      game_id: gameId || gameData?.Data?.game_id,
      source: 1,
      demo: demo || hasDemoParam ? 1 : 0,
    }).catch((res: RailsApiResponse<null>) => {
      if (res.Code === 401) setError(jsxT('game_launch_logged_out_error'));
      return res;
    });
    if (res?.Success && res.Data) {
      (res.Data.html_base_64 || res.Data.url) &&
        addIframeContent(res.Data.html_base_64, res.Data.url);
    } else if (res.Code !== 401) {
      setError(res?.Message);
    }
  };

  const setFavourite = event => {
    const gameId = id || gameData?.Data?.id;
    event.target.checked
      ? setFavouriteGame({ [isFavourite ? 'remove' : 'add']: [gameId] })
      : setFavouriteGame({ [isFavourite ? 'add' : 'remove']: [gameId] });
  };

  const setFavouriteCallback = useCallback(debounce(setFavourite, 400), [
    gameData,
  ]);

  const closeGame = () => {
    history.push(casinoLobbyRoute);
  };

  const fullscreen = () => {
    if (document.fullscreenEnabled && iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  return (
    <StyledCasinoInnerPage className="styled-casino-inner-page">
      <div className="game">
        <div className="game-nav">
          <span className="game-nav-left">
            <span className="game-button" onClick={closeGame}>
              <i className={clsx(icon?.left)} />
            </span>
            {!!gameData?.Data?.has_game_timer && iframeLoaded && (
              <SessionTimer
                needsClock
                className="game-session-timer"
                localStorageKey={localStorageTimerKey}
              />
            )}
          </span>
          {tablet && (
            <div className="title-wrp">
              <h5 className="title-main">
                {name || gameData?.Data?.name}{' '}
                {(demo || hasDemoParam) && t('is_demo')}
              </h5>
            </div>
          )}
          <div className="game-buttons">
            {user.logged_in && (
              <Button
                onClick={() => enableModal(ComponentName.QuickDepositModal)}
                variant="secondary"
                className="pr-2 pl-3 mr-3"
              >
                <NumberFormat
                  value={user.balance}
                  thousandSeparator
                  displayType={'text'}
                  prefix={user.currency}
                />
                <i className={clsx(icon?.plus, 'ml-2')}></i>
              </Button>
            )}
            {user.logged_in && (
              <label className="game-button">
                <input
                  type="checkbox"
                  className="d-none"
                  onChange={e => {
                    setIsFavouriteIconState(!isFavouriteIconState);
                    setFavouriteCallback(e);
                  }}
                />
                <i
                  className={`icon-favourite-${
                    isFavouriteIconState ? 'on' : 'off'
                  }`}
                />
              </label>
            )}
            <span className="game-button" onClick={fullscreen}>
              <i className={clsx(icon?.fullScreen)} />
            </span>
          </div>
        </div>
        {showGeoComplyAlert && <LoadableGeoComplyAlert />}
        <div className="iframe-wrp">
          {(!iframeLoaded || isDataLoading) && (
            <div className="d-flex my-3 mh-50vh justify-content-center">
              {error ? (
                <h4>{error}</h4>
              ) : (
                <Spinner
                  animation="border"
                  variant="white"
                  className="m-auto"
                />
              )}
            </div>
          )}
          {!error && (
            <iframe
              width="100%"
              height="100%"
              ref={iframeRef}
              onLoad={() => setIframeLoaded(true)}
              title="Game"
            />
          )}
        </div>
      </div>
    </StyledCasinoInnerPage>
  );
};

export default CasinoInnerPage;

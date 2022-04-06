import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import { useLocation, useHistory } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { postApi } from '../../../utils/apiUtils';
import { useRoutePath } from '../../../hooks';
import { useCasinoConfig } from '../../../hooks/useCasinoConfig';
import useDesktopWidth from '../../../hooks/useDesktopWidth';
import { PagesName, ComponentName } from '../../../constants';
import clsx from 'clsx';
import debounce from 'lodash.debounce';
import { StyledCasinoInnerPage } from '../components/styled/casinoStyles';
import { Config } from '../../../constants';
import { useModal } from '../../../hooks/useModal';
import NumberFormat from 'react-number-format';
import { useAuth } from '../../../hooks/useAuth';
import Button from 'react-bootstrap/Button';

const CasinoInnerPage = () => {
  const { user } = useAuth();
  const location: any = useLocation();
  const history = useHistory();
  const { id, gameId, name, provider, demo } = location.state;
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const tablet = useDesktopWidth(768);
  const [error, setError] = useState<string | null>(null);
  const {
    favouriteGames,
    setFavouriteGame,
    recentGamesDataMutate,
  } = useCasinoConfig();
  const isFavourite = useMemo(
    () => favouriteGames.some(game => game.id === id),
    [favouriteGames],
  );
  const [isFavouriteIconState, setIsFavouriteIconState] = useState(isFavourite);
  const casinoLobbyRoute = useRoutePath(PagesName.CasinoPage);
  const { enableModal } = useModal();

  useEffect(() => {
    getLaunchUrl();
    return function cleanup() {
      const pragmaticScript = document.getElementById('pragmatic-script');
      pragmaticScript && document.head.removeChild(pragmaticScript);
    };
  }, []);

  useEffect(() => {
    if (!location.pathname.includes('casino/game'))
      document.documentElement.style.overflow = '';
  }, [location]);

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

  const getLaunchUrl = async () => {
    const res = await postApi<
      RailsApiResponse<{ url: string; html_base_64: any } | null>
    >('/restapi/v1/casino/launch_url', {
      id: id,
      reload_game_url: window.location.href,
      game_provider: provider,
      game_id: gameId,
      source: 1,
      demo: demo ? 1 : 0,
    }).catch((res: RailsApiResponse<null>) => {
      return res;
    });
    if (res?.Success && res.Data) {
      (res.Data.html_base_64 || res.Data.url) &&
        addIframeContent(res.Data.html_base_64, res.Data.url);
    } else {
      setError(res?.Message);
    }
  };

  const setFavourite = event => {
    event.target.checked
      ? setFavouriteGame({ [isFavourite ? 'remove' : 'add']: [id] })
      : setFavouriteGame({ [isFavourite ? 'add' : 'remove']: [id] });
  };

  const setFavouriteCallback = useCallback(debounce(setFavourite, 400), []);

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
    <StyledCasinoInnerPage>
      <div
        className="game"
        style={{ backgroundImage: "url('/assets/images/casino-inner-bg.png'" }}
      >
        <div className="game-nav">
          <span className="game-button" onClick={closeGame}>
            <i className={`icon-${Config.name}-left`} />
          </span>
          {tablet && (
            <div className="title-wrp">
              <h5 className="title-main">{name}</h5>
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
                <i className={clsx(`icon-${Config.name}-plus`, 'ml-2')}></i>
              </Button>
            )}
            {user.logged_in && (
              <label className="game-button">
                <input
                  type="checkbox"
                  className="d-none"
                  onChange={setFavouriteCallback}
                />
                <i
                  className={`icon-${Config.name}-favourite-${
                    isFavouriteIconState ? 'on' : 'off'
                  }`}
                  onClick={() => setIsFavouriteIconState(!isFavouriteIconState)}
                />
              </label>
            )}
            <span className="game-button" onClick={fullscreen}>
              <i className={`icon-${Config.name}-full-screen`} />
            </span>
          </div>
        </div>
        <div className="iframe-wrp">
          {!iframeLoaded && (
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
          <iframe
            width="100%"
            height="100%"
            ref={iframeRef}
            onLoad={() => setIframeLoaded(true)}
          />
        </div>
      </div>
    </StyledCasinoInnerPage>
  );
};

export default CasinoInnerPage;

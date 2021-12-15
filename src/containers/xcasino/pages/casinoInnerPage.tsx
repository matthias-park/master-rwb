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
import { PagesName } from '../../../constants';
import clsx from 'clsx';
import debounce from 'lodash.debounce';

const CasinoInnerPage = () => {
  const location: any = useLocation();
  const history = useHistory();
  const { id, gameId, name, provider } = location.state;
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const homeRoute = useRoutePath(PagesName.HomePage);
  const [error, setError] = useState<string | null>(null);
  const { favouriteGames, setFavouriteGame } = useCasinoConfig();
  const isFavourite = useMemo(
    () => favouriteGames.some(game => game.id === id),
    [favouriteGames],
  );
  const [isFavouriteIconState, setIsFavouriteIconState] = useState(isFavourite);

  useEffect(() => {
    getLaunchUrl();
    document.documentElement.style.overflow = 'hidden';
    return function cleanup() {
      document.documentElement.style.overflow = '';
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
  };

  const getLaunchUrl = async () => {
    const res = await postApi<
      RailsApiResponse<{ url: string; html_base_64: any } | null>
    >('/restapi/v1/casino/launch_url', {
      reload_game_url: window.location.href,
      game_provider: provider,
      game_id: gameId,
      source: 1,
      demo: 0,
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

  const redirectHome = () => {
    history.push(homeRoute);
  };

  const closeGame = () => {
    history.goBack();
  };

  const fullscreen = () => {
    if (document.fullscreenEnabled && iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="casino-inner">
      <div className="fade-in">
        <div className="casino-inner__header d-none d-md-flex">
          <i
            className="casino-inner__header-back icon-round-bg icon-left"
            onClick={closeGame}
          ></i>
          <h5 className="casino-inner__header-title">{name}</h5>
          <i
            className="casino-inner__header-home icon-round-bg icon-dashboard"
            onClick={redirectHome}
          ></i>
          <i className="casino-inner__header-search icon-round-bg icon-search"></i>
          <i
            className="casino-inner__header-close icon-round-bg icon-close"
            onClick={closeGame}
          ></i>
        </div>
        <div className="casino-inner__body">
          <div className="casino-inner__body-wrp">
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
              ref={iframeRef}
              onLoad={() => setIframeLoaded(true)}
              className="casino-inner__body-wrp-iframe"
              width="100%"
              height="100%"
            ></iframe>
          </div>
          <div className="casino-inner__body-sidebar d-none d-md-flex">
            <i
              className="casino-inner__header-full icon-round-bg icon-full-screen"
              onClick={fullscreen}
            ></i>
            <label className="casino-inner__header-favourite">
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
                  'icon-round-bg',
                )}
              ></i>
            </label>
            <i className="casino-inner__header-games icon-round-bg icon-games"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoInnerPage;

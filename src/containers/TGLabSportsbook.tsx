import React, { useEffect, useRef } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Dispatch } from 'redux';
import { PagesName } from '../constants';
import { useRoutePath } from '../hooks';
import { useAuth } from '../hooks/useAuth';
import { useConfig } from '../hooks/useConfig';
import { RootState } from '../state';
import {
  fetchUserSbToken,
  setLoadedLocale,
  setRendered,
  setShowBettingHistory,
  setSidebarVisible,
  setSportsbookLoaded,
  updateUselessCounter,
} from '../state/reducers/tgLabSb';
import { TGLabSbPageType } from '../types/TGLabSbConfig';

const containerDivId = 'sb_rooter';
const scriptId = 'tgLabSbScript';

const insertSbConfig = (
  locale: string,
  prematchPath?: string,
  livePath?: string,
  token?: string | null,
) => {
  window.__SB_INIT__ = {
    config: {
      fr: window.__config__.tgLabSb!.id,
      lang: locale,
      country: 'lt',
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      pre_path: prematchPath ? `/${locale}${prematchPath}` : null,
      live_path: livePath ? `/${locale}${livePath}` : null,
      format: window.__config__.tgLabSb!.format,
      preloader: true,
      load_history: false,
      token,
    },
  };
};

const startObserver = (dispatch: Dispatch<any>) => {
  const targetNode = document.getElementById('left-menu-holder');
  if (targetNode) {
    const callback = () => {
      const leftMenu =
        document.getElementById('left-menu') ||
        document.getElementById('left-menu-holder');
      const leftMenuVisible =
        !!leftMenu && window.getComputedStyle(leftMenu).display !== 'none';
      dispatch(setSidebarVisible(leftMenuVisible));
      const leftMenuExternal = document.getElementById('leftMenuExternal');
      if (!leftMenuExternal?.hasChildNodes()) {
        dispatch(updateUselessCounter());
      }
    };
    callback();
    const observer = new MutationObserver(callback);
    const config = { attributes: false, childList: true, subtree: true };
    observer.observe(targetNode, config);
  }
};
interface TGLabSportsbookProps {
  liveSports?: boolean;
}
const TGLabSportsbook = ({ liveSports }: TGLabSportsbookProps) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const state = useSelector((state: RootState) => state.tgLabSb);
  const prematchRoute = useRoutePath(PagesName.SportsPage, true);
  const liveSportsRoute = useRoutePath(PagesName.LiveSportsPage, true);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const { key } = useLocation();

  useEffect(() => {
    dispatch(setRendered(true));
    return () => {
      dispatch(setRendered(false));
    };
  }, []);
  useEffect(() => {
    if (state.loaded && key) {
      window.externalSBPageSwitch?.(
        liveSports ? TGLabSbPageType.InPlay : TGLabSbPageType.Prematch,
        true,
      );
    }
  }, [state.loaded, liveSports, key]);
  useEffect(() => {
    console.log(state.loaded, state.sbShowBettingHistory);
    if (state.loaded && state.sbShowBettingHistory) {
      window.betListCenterShow?.();
      dispatch(setShowBettingHistory(false));
    }
  }, [state.sbShowBettingHistory, state.loaded]);

  useEffect(() => {
    const sbContainer = document.getElementById(containerDivId);
    if (sbContainer) {
      if (state.show) {
        sbContainer.classList.remove('d-none');
      } else {
        sbContainer.classList.add('d-none');
      }
    }
  }, [state.show]);

  useEffect(() => {
    if (locale && locale !== state.loadedLocale) {
      insertSbConfig(locale, prematchRoute, liveSportsRoute, state.userToken);
      window.externalSBReload?.();
    }
  }, [locale]);

  useEffect(() => {
    if (
      locale &&
      window.__config__.tgLabSb &&
      !user.loading &&
      (!user.logged_in || state.userToken)
    ) {
      if (!document.getElementById(containerDivId)) {
        const divContainer = document.createElement('div');
        divContainer.id = containerDivId;
        divContainer.classList.add('d-none');
        document.body.appendChild(divContainer);
      }
      insertSbConfig(locale, prematchRoute, liveSportsRoute, state.userToken);
      window.betSlipLoaded = () => {
        dispatch(setSportsbookLoaded(true));
        dispatch(setLoadedLocale(locale));
        startObserver(dispatch);
      };
      if (!document.getElementById(scriptId)) {
        const scriptElement = document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.async = true;
        scriptElement.setAttribute('type', 'text/javascript');
        scriptElement.setAttribute('src', window.__config__.tgLabSb!.bundle);
        document.head.appendChild(scriptElement);
      }
      const sbContainer = document.getElementById(containerDivId);
      if (sbContainer) {
        sbContainer.classList.remove('d-none');
        pageRef.current?.parentNode?.insertBefore(
          sbContainer as Node,
          pageRef.current.nextSibling,
        );
      }
      return () => {
        const sbContainer = document.getElementById(containerDivId);
        if (sbContainer) {
          sbContainer.classList.add('d-none');
          document.body.appendChild(sbContainer as Node);
        }
      };
    }
  }, [!!locale, user.loading, state.userToken]);

  useEffect(() => {
    if (user.logged_in) {
      dispatch(fetchUserSbToken(0));
    } else if (state.loaded && !user.loading) {
      window.externalLogOut?.();
    }
  }, [user.logged_in]);
  useEffect(() => {
    if (state.loaded && state.userToken) {
      window.betSlipLoginOnSuccess?.();
    }
  }, [state.userToken]);
  return (
    <>
      <div ref={pageRef} />
      {!state.show && (
        <div className="d-flex justify-content-center py-5 mx-auto min-vh-70">
          <Spinner
            animation="border"
            variant="black"
            className="mx-auto mt-5"
          />
        </div>
      )}
    </>
  );
};

export default TGLabSportsbook;

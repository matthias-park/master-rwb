import React from 'react';
import Link from '../../../../components/Link';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import { useAuth } from '../../../../hooks/useAuth';
import { useParams, useLocation } from 'react-router-dom';
import { useI18n } from '../../../../hooks/useI18n';
import clsx from 'clsx';
import { useRoutePath } from '../../../../hooks';
import { PagesName, ThemeSettings } from '../../../../constants';

const CasinoBottomNav = () => {
  const { t } = useI18n();
  const { icons: icon } = ThemeSettings!;
  const location = useLocation();
  const { user } = useAuth();
  const { casinoType } = useCasinoConfig();
  const params = useParams<{ category?: string; provider?: string }>();
  const isLobby = location.pathname === useRoutePath(PagesName.CasinoPage);

  return (
    <ul className="bottom-nav">
      <Link to={`/${casinoType}`}>
        <li className={clsx('bottom-nav__item', isLobby && 'active')}>
          <i className={clsx('active', icon?.home)}></i>
          {t('bottom_casino_home')}
        </li>
      </Link>
      {user.logged_in && (
        <>
          <Link to={`/${casinoType}/recent`}>
            <li
              className={clsx(
                'bottom-nav__item',
                params.category === 'recent' && 'active',
              )}
            >
              <i className={clsx(icon?.recent)}></i>
              {t('bottom_casino_recent')}
            </li>
          </Link>
          <Link to={`/${casinoType}/favourite`}>
            <li
              className={clsx(
                'bottom-nav__item',
                params.category === 'favourite' && 'active',
              )}
            >
              <i className={clsx(icon?.favorite)}></i>
              {t('bottom_casino_favourites')}
            </li>
          </Link>
        </>
      )}
      <Link to={`/${casinoType}/new`}>
        <li
          className={clsx(
            'bottom-nav__item',
            params.category === 'new' && 'active',
          )}
        >
          <i className={clsx(icon?.new)}></i>
          {t('bottom_casino_new')}
        </li>
      </Link>
      <Link to={`/${casinoType}/featured`}>
        <li
          className={clsx(
            'bottom-nav__item',
            params.category === 'featured' && 'active',
          )}
        >
          <i className={clsx(icon?.featured)}></i>
          {t('bottom_casino_featured')}
        </li>
      </Link>
    </ul>
  );
};

export default CasinoBottomNav;

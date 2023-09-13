import React from 'react';
import Link from '../../../../components/Link';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import { useParams, useLocation } from 'react-router-dom';
import { useI18n } from '../../../../hooks/useI18n';
import clsx from 'clsx';
import { useRoutePath } from '../../../../hooks';
import { PagesName, ThemeSettings } from '../../../../constants';
import { SearchActions } from '../../../../types/api/Casino';

const CasinoBottomNav = () => {
  const { t } = useI18n();
  const { icons: icon } = ThemeSettings!;
  const location = useLocation();
  const { casinoType } = useCasinoConfig();
  const params = useParams<{ category?: string; provider?: string }>();
  const isLobby = location.pathname === useRoutePath(PagesName.CasinoPage);
  const { setSearchData, searchData } = useCasinoConfig();

  return (
    <ul className="bottom-nav">
      <Link to={`/${casinoType}`}>
        <li className={clsx('bottom-nav__item', isLobby && 'active')}>
          <i className={clsx(icon?.casino, 'active')}></i>
          {t('bottom_casino_casino')}
        </li>
      </Link>
      <li
        className={clsx('bottom-nav__item', searchData.showSearch && 'active')}
        onClick={() => setSearchData({ type: SearchActions.Show })}
      >
        <i className={clsx(`icon-search`)}></i>
        {t('bottom_casino_search')}
      </li>

      <Link to={`/promotions`}>
        <li
          className={clsx(
            'bottom-nav__item',
            params.category === 'promotions' && 'active',
          )}
        >
          <i className={clsx(icon?.promo)}></i>
          {t('bottom_casino_promo')}
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
          {t('bottom_casino_favorite')}
        </li>
      </Link>
    </ul>
  );
};

export default CasinoBottomNav;

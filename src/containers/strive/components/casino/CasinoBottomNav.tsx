import React from 'react';
import Link from '../../../../components/Link';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import { useAuth } from '../../../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import { useI18n } from '../../../../hooks/useI18n';
import clsx from 'clsx';

const CasinoBottomNav = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const {
    categories,
    casinoType,
    activeCategory,
    activeProvider,
  } = useCasinoConfig();
  const categoryNew = categories?.find(category => category.name === 'New');
  const categoryFeatured = categories?.find(
    category => category.name === 'Featured',
  );
  const params = useParams<{ category?: string; provider?: string }>();
  const isFavouriteCategory = params.category === 'favourite';
  const isLobby = !activeCategory && !activeProvider && !isFavouriteCategory;

  return (
    <ul className="bottom-nav">
      <Link to={`/${casinoType}`}>
        <li className={clsx('bottom-nav__item', isLobby && 'active')}>
          <i className="icon-gnogon-home active"></i>
          {t('bottom_casino_home')}
        </li>
      </Link>
      {user.logged_in && (
        <Link to={`/${casinoType}/favourite`}>
          <li
            className={clsx(
              'bottom-nav__item',
              isFavouriteCategory && 'active',
            )}
          >
            <i className="icon-gnogon-favourite-off"></i>
            {t('bottom_casino_favourites')}
          </li>
        </Link>
      )}
      {categoryNew && (
        <Link to={`/${casinoType}/${categoryNew.slug}`}>
          <li
            className={clsx(
              'bottom-nav__item',
              activeCategory?.slug === categoryNew.slug && 'active',
            )}
          >
            <i className="icon-gnogon-new"></i>
            {t('bottom_casino_new')}
          </li>
        </Link>
      )}
      {categoryFeatured && (
        <Link to={`/${casinoType}/${categoryFeatured.slug}`}>
          <li
            className={clsx(
              'bottom-nav__item',
              activeCategory?.slug === categoryFeatured.slug && 'active',
            )}
          >
            <i className="icon-gnogon-featured"></i>
            {t('bottom_casino_featured')}
          </li>
        </Link>
      )}
    </ul>
  );
};

export default CasinoBottomNav;

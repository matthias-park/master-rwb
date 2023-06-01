import React, { useMemo } from 'react';
import useDesktopWidth from '../../../../hooks/useDesktopWidth';
import CasinoGame from './CasinoGame';
import CasinoGroupSlider from './CasinoGroupSlider';
import useApi from '../../../../hooks/useApi';
import { useI18n } from '../../../../hooks/useI18n';
import Link from '../../../../components/Link';
import clsx from 'clsx';

const LiveCasinoWelcomeGroup = () => {
  const { t } = useI18n();
  const desktopWidth1200 = useDesktopWidth(1200);
  const { data: categories } = useApi<any>(
    '/restapi/v1/casino/live_categories',
  );
  const { data: games } = useApi<any>(
    !!categories
      ? `/restapi/v1/casino/live_categories/${categories.Data[0].id}/games`
      : '',
  );
  const featuredGames = useMemo(
    () => games?.Data?.filter(game => game.features.includes('front_page')),
    [games],
  );
  const featuredCategories = useMemo(
    () =>
      categories?.Data.slice(0, 4).filter(category => category.slug !== 'all'),
    [categories],
  );

  return (
    <div className="livedealer-welcome expand-both mt-2 mt-xl-7">
      <div className="livedealer-welcome__content">
        <i className="icon-live-casino"></i>
        <h3 className="livedealer-welcome__content-title">
          {t('live_casino_title')}
        </h3>
        <p className="livedealer-welcome__content-text">
          {t('live_casino_welcome_note')}
        </p>
        {desktopWidth1200 ? (
          <ul className="livedealer-categorie-games">
            {featuredGames?.slice(0, 6).map(gameData => (
              <li
                className="livedealer-categorie-games__item"
                key={gameData.id}
              >
                <CasinoGame gameData={gameData} noTitle featured />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <CasinoGroupSlider
              noTitle
              featured
              className="expand-right"
              games={featuredGames?.slice(0, featuredGames.length / 2)}
            />
            <CasinoGroupSlider
              noTitle
              featured
              className="expand-right"
              games={featuredGames?.slice(featuredGames.length / 2)}
            />
          </>
        )}
      </div>
      <div className="livedealer-welcome__bg">
        <img
          src="/assets/images/live-casino/live-casino-bg.png"
          className="livedealer-welcome__bg-img"
          alt=""
        ></img>
        <div className="livedealer-welcome__bg-content">
          <h4 className="livedealer-welcome__bg-content-title">
            {t('live_entertainment')}
          </h4>
          <ul className="round-link-buttons">
            {categories &&
              featuredCategories.map(category => (
                <Link
                  to={`live-casino/${category.slug}`}
                  className="round-link-buttons__item"
                  key={category.id}
                >
                  <li className="round-link-buttons__item-wrp">
                    <i
                      className={clsx(
                        'round-link-buttons__item-icon',
                        `icon-${category?.icon}`,
                      )}
                    />
                    <h5 className="round-link-buttons__item-title">
                      {category.name}
                    </h5>
                  </li>
                </Link>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiveCasinoWelcomeGroup;

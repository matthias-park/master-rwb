import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { useConfig } from '../../../hooks/useConfig';
import { useCasinoConfig } from '../../../hooks/useCasinoConfig';
import { useI18n } from '../../../hooks/useI18n';
import { useApi } from '../../../hooks/useApi';
import RailsApiResponse from '../../../types/api/RailsApiResponse';
import Link from '../../../components/Link';
import { Game } from '../../../types/api/Casino';
import CurrentTimeTimer from '../../../components/CurrentTimeTimer';

type GameInfoPages = {
  game: Game;
  id: number;
  main_text: string;
  slug: string;
  title: string;
}[];

const Footer = () => {
  const [gamesDropdown, setGamesDropdown] = useState('Amazonia');
  const { t } = useI18n();
  const { footer } = useConfig((prev, next) => !!prev.footer === !!next.footer);
  const { providers } = useCasinoConfig();
  const { data: infoPagesData } = useApi<RailsApiResponse<GameInfoPages>>(
    '/restapi/v1/casino/info_pages',
  );
  const infoPagesByProvider = useMemo(() => {
    return providers?.reduce((acc: any, current) => {
      const providerInfoPages = infoPagesData?.Data?.filter(
        infoPage => infoPage.game.provider.id === current.id,
      );
      const providerInfoPagesGames = providerInfoPages?.map(
        infoPage => infoPage.game,
      );
      return providerInfoPagesGames?.length
        ? [
            ...acc,
            {
              name: t(`provider_name_${current.slug}`),
              games: providerInfoPagesGames,
            },
          ]
        : acc;
    }, []);
  }, [infoPagesData, providers]);

  return (
    <footer className="footer">
      <div className="footer__current-time-wrp">
        <span className="footer__current-time">
          <i className="icon-live-sports"></i>
          <CurrentTimeTimer timezone={'Europe/Amsterdam'} />
        </span>
      </div>
      <div className="footer__link-groups px-sm-2 px-md-0">
        {footer?.links?.map(group => (
          <ul className="footer__link-group">
            {group.children.map(links => (
              <>
                <li className="footer__link-group-title">{t(links.name)}</li>
                {links.children.map(link => (
                  <a href={link.link}>
                    {!!link.icon ? (
                      <i className={clsx('footer__icon', link.icon)}></i>
                    ) : (
                      <li className="footer__link-group-item">
                        {t(link.name)}
                      </li>
                    )}
                  </a>
                ))}
              </>
            ))}
          </ul>
        ))}
      </div>

      <div className="footer__providers footer-full-bg">
        <div className="footer__providers-content">
          {footer?.providers?.map(provider => (
            <img
              alt=""
              src={provider.img_src}
              className="footer__providers-img"
            />
          ))}
        </div>
      </div>

      <div className="footer__link-groups footer__link-groups--secondary footer-full-bg py-6">
        {infoPagesByProvider?.map(provider => (
          <ul
            className={clsx(
              'footer__link-group footer__link-group--secondary',
              gamesDropdown === provider.name && 'show',
            )}
            onClick={() => setGamesDropdown(provider.name)}
          >
            <li className="footer__link-group-title">{provider.name}</li>
            {provider.games.map(game => (
              <Link to={`/casino/game-info/${game.slug}`}>
                <li className="footer__link-group-item">{game.name}</li>
              </Link>
            ))}
          </ul>
        ))}
      </div>

      <div className="footer__partners footer-full-bg">
        <div className="footer__partners-wrp">
          {footer?.partners?.links.map(partner => (
            <img
              alt=""
              src={partner.img_src}
              className="footer__partners-img"
            />
          ))}
        </div>
      </div>

      <div className="footer__info footer-full-bg">
        <div className="footer__info-content">
          <div
            className="footer__info-col"
            dangerouslySetInnerHTML={{
              __html: t('footer_text_column_1') || '',
            }}
          ></div>
          <div
            className="footer__info-col"
            dangerouslySetInnerHTML={{
              __html: t('footer_text_column_2') || '',
            }}
          ></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

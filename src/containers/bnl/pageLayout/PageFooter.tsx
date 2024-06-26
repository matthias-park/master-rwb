import React, { useMemo } from 'react';
import { iconName, PagesName } from '../../../constants';
import Dropdown from 'react-bootstrap/Dropdown';
import useDesktopWidth from '../../../hooks/useDesktopWidth';
import SessionTimer from '../../../components/SessionTimer';
import { useI18n } from '../../../hooks/useI18n';
import { sortAscending } from '../../../utils/index';
import { useConfig } from '../../../hooks/useConfig';
import { useIsRouteActive, useRoutePath } from '../../../hooks/index';
import { isMobile } from 'react-device-detect';
import useGTM from '../../../hooks/useGTM';
import {
  SubFooter,
  FooterDataLink,
  Social,
  Partners,
} from '../../../types/api/PageConfig';
import Link from '../../../components/Link';
import { useModal } from '../../../hooks/useModal';
import clsx from 'clsx';

const FooterHeader = () => {
  const { t } = useI18n();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const responsibleGamingPath = useRoutePath(
    PagesName.ResponsibleGamingPage,
    true,
  );
  return (
    <div className="footer-pre py-3">
      <div className="session-block">
        <span className="session-block__text text-14">
          {t('time_spent_in_website')}
        </span>
        <i className="icon-clock"></i>
        <span className="session-block__time text-14">
          <SessionTimer />
        </span>
      </div>
      <h3 className="footer-pre__title text-gray-100">
        {t('moderation_gamble')}
      </h3>
      <div className="restrictions-block">
        <img
          loading="lazy"
          className="restrictions-block__img"
          alt=""
          src="/assets/images/restrictions/18-label.webp"
          width="40"
          height="37"
        />
        <span className="restrictions-block__text text-14">
          {t('minimum_age_disclaimer')}
        </span>
        <Link to={responsibleGamingPath}>
          <img
            loading="lazy"
            className="restrictions-block__img mr-3"
            alt="responsible gaming"
            src={`/assets/images/restrictions/bnl-${locale}.svg`}
            width="200"
            height="47"
          />
        </Link>
      </div>
    </div>
  );
};

const FooterBottom = ({ data }: { data?: SubFooter }) => {
  const { t } = useI18n();
  const { locale } = useConfig((prev, next) => prev.locale === next.locale);
  const { enableModal } = useModal();
  const isSports = useIsRouteActive('sportsPrematch');
  const isLive = useIsRouteActive('sportsLive');

  return (
    <div
      className={clsx(
        'row no-gutters footer-sub',
        isMobile && (isSports || isLive) && 'with-bottom-nav',
      )}
    >
      <ul className="footer-sub__nav mr-auto">
        {data?.links
          ?.concat()
          .sort((a, b) => sortAscending(a.order, b.order))
          .map(link => (
            <li
              key={`${link.name}-${link.link}`}
              className="footer-sub__nav-link"
            >
              {link.link ? (
                <Link to={link.link}>{t(link.name)}</Link>
              ) : (
                <span onClick={() => link.modal && enableModal(link.modal)}>
                  {t(link.name)}
                </span>
              )}
            </li>
          ))}
      </ul>
      <ul className="footer-sub__nav flex-row justify-content-center h-auto pb-3 pb-lg-0">
        <li className="footer-sub__nav-img">
          <a target="_blank" rel="noreferrer" href={t('play_legally_href')}>
            <img
              loading="lazy"
              alt="play legally"
              className="mb-2 mb-lg-0 white-corners"
              height="50"
              width="55"
              src="/assets/images/footer/play-legally.webp"
            />
          </a>
        </li>
        <li className="footer-sub__nav-img">
          <a
            target="_blank"
            rel="noreferrer"
            href={t('responsible_gaming_href')}
          >
            <img
              loading="lazy"
              alt="responsible gaming"
              className="ml-2 ml-lg-3 mb-2 mb-lg-0 white-corners"
              height="40"
              width="129"
              src={`/assets/images/footer/res-gaming-${locale}.webp`}
            />
          </a>
        </li>
        <li className="footer-sub__nav-img">
          <a target="_blank" rel="noreferrer" href={t('bgc_href')}>
            <img
              loading="lazy"
              alt="bgc"
              className="ml-2 ml-lg-3 mb-2 mb-lg-0 white-corners"
              height="40"
              width="90"
              src={`/assets/images/footer/bgc-${locale}.webp`}
            />
          </a>
        </li>
        <li className="footer-sub__nav-img">
          <a target="_blank" rel="noreferrer" href={t('bnl_href')}>
            <img
              loading="lazy"
              alt="bnl"
              className="ml-1 ml-lg-2 mb-2 mb-lg-0"
              height="45"
              width="119"
              src={`/assets/images/footer/loterij-${locale}.webp`}
            />
          </a>
        </li>
        <li className="footer-sub__nav-img">
          <a target="_blank" rel="noreferrer" href={t('el_href')}>
            <img
              loading="lazy"
              alt="european lotteries"
              className="ml-1 ml-lg-2 mb-2 mb-lg-0"
              height="45"
              width="114"
              src="/assets/images/footer/european.webp"
            />
          </a>
        </li>
      </ul>
    </div>
  );
};

const SocialSection = ({
  social,
  partners,
}: {
  social?: Social;
  partners?: Partners;
}) => {
  const { t, jsxT } = useI18n();
  const { ...webSocial } = social || {};

  return (
    <>
      <section className="footer-social-block ml-auto pt-4 mt-0 mt-md-4 mt-lg-0 pt-lg-0">
        <div className="section-social">
          <h2 className="section-social__head-title">
            {t('footer_social_title')}
          </h2>
          <p className="section-social__title">{t('find_us_in_social')}</p>
          <p className="section-social__icons">
            {!!webSocial &&
              Object.entries(webSocial)
                .filter(Boolean)
                .map(([key, value]) => {
                  const externalLink = value.includes('http');
                  const Component = externalLink ? 'a' : Link;
                  return (
                    <Component
                      key={key}
                      to={!externalLink ? value : undefined}
                      href={externalLink ? value : undefined}
                      className="section-social__icons-link"
                      target={externalLink ? '_blank' : undefined}
                      rel={externalLink ? 'noreferrer' : undefined}
                      aria-label={iconName[key] || key}
                    >
                      <i className={`icon-${iconName[key] || key}`}></i>
                    </Component>
                  );
                })}
          </p>
          <h2 className="section-social__head-title mt-4">
            {t('official_partners_title')}
          </h2>
          <p className="section-social__icons d-flex align-items-center">
            {!!partners &&
              Object.entries(partners)
                .filter(Boolean)
                .map(([key, value]) => (
                  <a
                    key={key}
                    href={t(value)}
                    className="section-social__icons-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      loading="lazy"
                      alt={`partner-${key}`}
                      height="42"
                      src={`/assets/images/footer/${key}.webp`}
                    />
                  </a>
                ))}
          </p>
        </div>
        <div className="footer-info-text d-none d-xxl-flex align-items-end ml-3 mb-2">
          <p>{jsxT('footer_info_text')}</p>
        </div>
      </section>
      <div className="footer-info-text d-flex d-xxl-none mt-3 mb-2 mb-lg-0">
        <p>{jsxT('footer_info_text')}</p>
      </div>
    </>
  );
};

const SortedFooterLinks = ({ links }: { links?: FooterDataLink[] }): any => {
  const { t, jsxT } = useI18n();
  const desktopWidth = useDesktopWidth(767);
  const sendDataToGTM = useGTM();
  const FooterLink = useMemo(
    () => ({
      Container: desktopWidth ? 'div' : Dropdown,
      Title: desktopWidth ? 'h3' : Dropdown.Toggle,
      Children: desktopWidth ? 'div' : Dropdown.Menu,
    }),
    [desktopWidth],
  );
  const onGtmLinkClick = (name: string) => {
    sendDataToGTM({
      'tglab.ItemClicked': t(name),
      event: 'BottomNavigationClick',
    });
  };

  if (!links) return null;
  return links
    .concat()
    .sort((a, b) => sortAscending(a.order, b.order))
    .map((column, index) => (
      <section key={index} className="footer-links-block">
        {column.children
          .concat()
          .sort((a, b) => sortAscending(a.order, b.order))
          .map(linkContainer => (
            <FooterLink.Container
              key={linkContainer.name}
              className="section-item"
            >
              <FooterLink.Title as="h3" className="section-item__title">
                {jsxT(linkContainer.name)}
              </FooterLink.Title>
              <FooterLink.Children>
                {linkContainer.children
                  .concat()
                  .sort((a, b) => sortAscending(a.order, b.order))
                  .map((child, index) =>
                    child.external ? (
                      <a
                        key={`${child.name}-${index}`}
                        href={child.link || t(child.translationPath!)}
                        target="_blank"
                        rel="noreferrer"
                        className={
                          child.button
                            ? 'btn btn-outline-light btn-sm my-3'
                            : 'section-item__link'
                        }
                      >
                        {t(child.name)}
                      </a>
                    ) : (
                      <Link
                        key={child.name}
                        to={child.link || '#'}
                        onClick={() => onGtmLinkClick(child.name)}
                        className={
                          child.button
                            ? 'btn btn-outline-light btn-sm my-3'
                            : 'section-item__link'
                        }
                      >
                        {t(child.name)}
                      </Link>
                    ),
                  )}
              </FooterLink.Children>
            </FooterLink.Container>
          ))}
      </section>
    ));
};

const PageFooter = () => {
  const { footer } = useConfig((prev, next) => !!prev.footer === !!next.footer);
  return (
    <footer>
      <div className="container-fluid">
        <FooterHeader />
        <div className="row footer-main pt-0 pt-md-4 pb-2 pb-lg-4 pt-lg-5">
          <SortedFooterLinks links={footer?.links} />
          <SocialSection social={footer?.social} partners={footer?.partners} />
        </div>
        <FooterBottom data={footer?.subFooter} />
      </div>
    </footer>
  );
};

export default PageFooter;

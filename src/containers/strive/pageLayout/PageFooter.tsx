import React, { useMemo } from 'react';
import { iconName } from '../../../constants';
import Dropdown from 'react-bootstrap/Dropdown';
import useDesktopWidth from '../../../hooks/useDesktopWidth';
import SessionTimer from '../../../components/SessionTimer';
import { useI18n } from '../../../hooks/useI18n';
import { sortAscending } from '../../../utils/index';
import { useConfig } from '../../../hooks/useConfig';
import { useIsRouteActive } from '../../../hooks/index';
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
import {
  StyledFooter,
  StyledFooterInfoText,
  StyledSectionItem,
  StyledSectionItemDropdown,
  StyledSectionItemExternalLink,
  StyledSectionItemLink,
  StyledSectionItemTitle,
  StyledSocialSection,
  StyledFooterSessionBlock,
  StyledFooterRestrictionBlock,
  StyledFooterSub,
  StyledFooterPreTitle,
} from '../components/styled/StyledFooter';

const FooterHeader = () => {
  const { t } = useI18n();
  return (
    <div className="footer-pre pt-3 pb-0 pb-md-3">
      <StyledFooterSessionBlock className="mb-2 mb-sm-0">
        <span className="session-block__text text-14">
          {t('time_spent_in_website')}
        </span>
        <i className={clsx(`icon-${window.__config__.name}-clock`)}></i>
        <span className="session-block__time text-14">
          <SessionTimer />
        </span>
      </StyledFooterSessionBlock>
      <StyledFooterPreTitle className="text-gray-100">
        {t('moderation_gamble')}
      </StyledFooterPreTitle>
      <StyledFooterRestrictionBlock>
        <img
          loading="lazy"
          className="restrictions-block__img"
          alt=""
          src="/assets/images/restrictions/21-label.webp"
          width={window.__config__.name === 'strive' ? '40' : '38'}
          height={window.__config__.name === 'strive' ? '37' : '38'}
        />
        <span className="restrictions-block__text text-14">
          {t('minimum_age_disclaimer')}
        </span>
      </StyledFooterRestrictionBlock>
    </div>
  );
};

const FooterBottom = ({ data }: { data?: SubFooter }) => {
  const { t } = useI18n();
  const { enableModal } = useModal();
  const isSports = useIsRouteActive('sportsPrematch');
  const isLive = useIsRouteActive('sportsLive');

  return (
    <StyledFooterSub
      className={clsx(
        'row no-gutters',
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
    </StyledFooterSub>
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
        <StyledSocialSection>
          <h2 className="social__head-title">{t('footer_social_title')}</h2>
          <p className="social__title">{t('find_us_in_social')}</p>
          <p className="social__icons">
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
                      className="social__icons-link"
                      target={externalLink ? '_blank' : undefined}
                      rel={externalLink ? 'noreferrer' : undefined}
                      aria-label={iconName[key] || key}
                    >
                      <i
                        className={`icon-${window.__config__.name}-${
                          iconName[key] || key
                        }`}
                      ></i>
                    </Component>
                  );
                })}
          </p>
          {partners && !!Object.keys(partners).length && (
            <h2 className="social__head-title mt-4">
              {t('official_partners_title')}
            </h2>
          )}
          <p className="social__icons d-flex align-items-center">
            {!!partners &&
              Object.entries(partners)
                .filter(Boolean)
                .map(([key, value]) => (
                  <a
                    key={key}
                    href={t(value)}
                    className="social__icons-link"
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
        </StyledSocialSection>
        <StyledFooterInfoText className="d-none d-xxl-flex align-items-end ml-3 mb-2">
          <p>{jsxT('footer_info_text')}</p>
        </StyledFooterInfoText>
      </section>
      <StyledFooterInfoText className="d-flex d-xxl-none mt-3 mb-2 mb-lg-0">
        <p>{jsxT('footer_info_text')}</p>
      </StyledFooterInfoText>
    </>
  );
};

const SortedFooterLinks = ({ links }: { links?: FooterDataLink[] }): any => {
  const { t, jsxT } = useI18n();
  const desktopWidth = useDesktopWidth(768);
  const sendDataToGTM = useGTM();
  const FooterLink = useMemo(
    () => ({
      Container: desktopWidth ? StyledSectionItem : StyledSectionItemDropdown,
      Title: desktopWidth ? StyledSectionItemTitle : Dropdown.Toggle,
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
            <FooterLink.Container key={linkContainer.name}>
              <FooterLink.Title
                as={StyledSectionItemTitle}
                className={clsx(
                  'section-item-title--toggler',
                  !linkContainer.children.length && 'disable-dropdown-arrow',
                )}
              >
                {jsxT(linkContainer.name)}
              </FooterLink.Title>
              <FooterLink.Children>
                {linkContainer.children
                  .concat()
                  .sort((a, b) => sortAscending(a.order, b.order))
                  .map((child, index) =>
                    child.external ? (
                      <StyledSectionItemExternalLink
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
                      </StyledSectionItemExternalLink>
                    ) : (
                      <StyledSectionItemLink
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
                      </StyledSectionItemLink>
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
    <StyledFooter>
      <div className="container-fluid">
        <FooterHeader />
        <div className="row footer-main pt-0 pt-md-4 pb-2 pb-lg-4 pt-lg-5">
          <SortedFooterLinks links={footer?.links} />
          <SocialSection social={footer?.social} partners={footer?.partners} />
        </div>
        <FooterBottom data={footer?.subFooter} />
      </div>
    </StyledFooter>
  );
};

export default PageFooter;

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_DATA, iconName } from '../../constants';
import { FooterLink, SocialLinks, SubFooter } from '../../types/FooterData';
import Dropdown from 'react-bootstrap/Dropdown';
import useDesktopWidth from 'hooks/useDesktopWidth';
import SessionTimer from 'components/SessionTimer';
import { useI18n } from '../../hooks/useI18n';
import { sortAscending } from '../../utils/index';

const FooterHeader = () => {
  const { t } = useI18n();
  return (
    <div className="row footer-pre py-3">
      <div className="session-block mb-2 mb-sm-0">
        <span className="session-block__text text-14">
          {t('time_spent_in_website')}
        </span>
        <i className="icon-clock"></i>
        <span className="session-block__time text-14">
          <SessionTimer />
        </span>
      </div>
      <div className="restrictions-block ml-md-auto">
        <img
          className="restrictions-block__img d-none d-sm-block d-md-none d-lg-block"
          alt=""
          src="/assets/images/restrictions/18-label.png"
          width="37"
          height="37"
        />
        <span className="restrictions-block__text text-14 mr-3 d-none d-sm-block d-md-none d-lg-block">
          {t('minimum_age_disclaimer')}
        </span>
        <img
          className="restrictions-block__img mr-3"
          alt=""
          src="/assets/images/restrictions/bnl.png"
          width="190"
          height="45"
        />
        <img
          className="restrictions-block__img"
          alt=""
          src="/assets/images/restrictions/becommerce.png"
          width="65"
          height="65"
        />
      </div>
    </div>
  );
};

const FooterBottom = ({ data }: { data: SubFooter }) => (
  <div className="row no-gutters footer-sub">
    <span className="footer-sub__title d-none d-lg-inline-block">
      {data.title}
    </span>
    <ul className="footer-sub__nav ml-auto">
      {data.links
        .sort((a, b) => sortAscending(a.order, b.order))
        .map(link => (
          <li
            key={`${link.name}-${link.link}`}
            className="footer-sub__nav-link"
          >
            <Link to={link.link}>{link.name}</Link>
          </li>
        ))}
      <li className="footer-sub__nav-link d-flex d-lg-none">{data.title}</li>
    </ul>
  </div>
);

const SocialSection = ({ social }: { social: SocialLinks }) => {
  const { t } = useI18n();
  const { iosApp, androidApp, ...webSocial } = social;
  return (
    <section className="footer-social-block pt-4 mt-0 mt-md-4 mt-lg-0 pt-lg-0">
      <div className="section-social">
        <h2 className="section-social__head-title">
          {t('footer_social_title')}
        </h2>
        {(androidApp || iosApp) && (
          <>
            <p className="section-social__title font-weight-500">
              {t('footer_download_the_app')}
            </p>
            <div className="section-social__app-img-cont">
              {!!iosApp && (
                <img
                  src="/assets/images/app/ios.png"
                  alt="iOS app"
                  className="section-social__app-img-cont-img mr-2 mr-sm-3"
                  width="120"
                  height="40"
                />
              )}
              {!!androidApp && (
                <img
                  src="/assets/images/app/android.png"
                  alt="Android app"
                  className="section-social__app-img-cont-img"
                  width="120"
                  height="40"
                />
              )}
            </div>
          </>
        )}
        <p className="section-social__title">{t('find_us_in_social')}</p>
        <p className="section-social__icons">
          {Object.entries(webSocial)
            .filter(Boolean)
            .map(([key, value]) => (
              <a key={key} href={value} className="section-social__icons-link">
                <i className={`icon-${iconName[key] || key}`}></i>
              </a>
            ))}
        </p>
      </div>
    </section>
  );
};

const SortedFooterLinks = ({ links }: { links: FooterLink[] }): any => {
  const desktopWidth = useDesktopWidth(768);
  const FooterLink = useMemo(
    () => ({
      Container: desktopWidth ? 'div' : Dropdown,
      Title: desktopWidth ? 'h3' : Dropdown.Toggle,
      Children: desktopWidth ? 'div' : Dropdown.Menu,
    }),
    [desktopWidth],
  );
  return links
    .sort((a, b) => sortAscending(a.order, b.order))
    .map((column, index) => (
      <section key={index} className="footer-links-block">
        {column.children
          .sort((a, b) => sortAscending(a.order, b.order))
          .map(linkContainer => (
            <FooterLink.Container
              key={linkContainer.name}
              className="section-item"
            >
              <FooterLink.Title as="h3" className="section-item__title">
                {linkContainer.name}
              </FooterLink.Title>
              <FooterLink.Children>
                {linkContainer.children
                  .sort((a, b) => sortAscending(a.order, b.order))
                  .map(child => (
                    <Link
                      key={child.name}
                      to={child.link || '#'}
                      className={
                        child.button
                          ? 'btn btn-outline-gray-700 btn-sm my-3'
                          : 'section-item__link'
                      }
                    >
                      {child.name}
                    </Link>
                  ))}
              </FooterLink.Children>
            </FooterLink.Container>
          ))}
      </section>
    ));
};

const PageFooter = () => {
  const footerData = FOOTER_DATA;
  return (
    <footer>
      <div className="container-fluid">
        <FooterHeader />
        <div className="row footer-main pt-0 pt-md-4 pb-2 py-lg-4">
          <SortedFooterLinks links={footerData.links} />
          <SocialSection social={footerData.social} />
        </div>
        <FooterBottom data={footerData.subFooter} />
      </div>
    </footer>
  );
};

export default PageFooter;

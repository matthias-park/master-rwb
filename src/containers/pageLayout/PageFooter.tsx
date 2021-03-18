import React, { useMemo } from 'react';
import { iconName } from '../../constants';
import Dropdown from 'react-bootstrap/Dropdown';
import useDesktopWidth from '../../hooks/useDesktopWidth';
import SessionTimer from '../../components/SessionTimer';
import { useI18n } from '../../hooks/useI18n';
import { useUIConfig } from '../../hooks/useUIConfig';
import { sortAscending } from '../../utils/index';
import { useConfig } from '../../hooks/useConfig';
import useGTM from '../../hooks/useGTM';
import {
  SubFooter,
  FooterDataLink,
  Social,
  Partners,
} from '../../types/api/PageConfig';
import ReactPlaceholder from 'react-placeholder/lib';
import Link from '../../components/Link';

const FooterHeader = () => {
  const { t } = useI18n();
  return (
    <div className="row flex-column flex-sm-row footer-pre align-items-sm-center py-3">
      <div className="session-block mb-2 mb-sm-0">
        <span className="session-block__text text-14">
          {t('time_spent_in_website')}
        </span>
        <i className="icon-clock"></i>
        <span className="session-block__time text-14">
          <SessionTimer />
        </span>
      </div>
      <h3 className="text-gray-100 ml-1 ml-sm-auto mr-md-5 mb-2 mb-sm-0">
        {t('moderation_gamble')}
      </h3>
      <div className="restrictions-block">
        <img
          className="restrictions-block__img d-none d-sm-block d-md-none d-lg-block"
          alt=""
          src="/assets/images/restrictions/18-label.png"
          width="40"
          height="37"
        />
        <span className="restrictions-block__text text-14 mr-3 d-none d-sm-block d-md-none d-lg-block">
          {t('minimum_age_disclaimer')}
        </span>
        <img
          className="restrictions-block__img mr-3"
          alt=""
          src="/assets/images/restrictions/bnl.jpg"
          width="200"
        />
      </div>
    </div>
  );
};

const FooterBottom = ({ data }: { data?: SubFooter }) => {
  const { t } = useI18n();
  const { setShowModal } = useUIConfig();
  return (
    <div className="row no-gutters footer-sub">
      <ReactPlaceholder
        className="footer-sub__nav mr-auto"
        style={{ width: '20%' }}
        showLoadingAnimation
        rows={1}
        type="text"
        ready={!!data}
      >
        <ul className="footer-sub__nav mr-auto">
          {data?.links
            .sort((a, b) => sortAscending(a.order, b.order))
            .map(link => (
              <li
                key={`${link.name}-${link.link}`}
                className="footer-sub__nav-link"
              >
                {link.link ? (
                  <Link to={link.link}>{t(link.name)}</Link>
                ) : (
                  <span onClick={() => setShowModal(link.modal)}>
                    {t(link.name)}
                  </span>
                )}
              </li>
            ))}
        </ul>
      </ReactPlaceholder>
      <ul className="footer-sub__nav flex-row justify-content-center h-auto pb-3 pb-lg-0">
        <li>
          <img
            alt="kansspel"
            height="45"
            src="/assets/images/footer/kansspel.jpg"
          />
        </li>
        <li>
          <img
            alt="loterij"
            className="ml-2 ml-lg-3"
            height="45"
            src="/assets/images/footer/loterij.jpg"
          />
        </li>
        <li>
          <img
            alt="european"
            className="ml-2 ml-lg-3"
            height="45"
            src="/assets/images/footer/european.jpg"
          />
        </li>
        <li>
          <img
            alt="becommerce"
            className="ml-2 ml-lg-3"
            height="45"
            src="/assets/images/footer/becommerce.jpg"
          />
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
  const { t } = useI18n();
  const { ...webSocial } = social || {};

  return (
    <section className="footer-social-block d-flex ml-auto pt-4 mt-0 mt-md-4 mt-lg-0 pt-lg-0">
      <div className="section-social">
        <ReactPlaceholder
          rows={5}
          type="text"
          showLoadingAnimation
          ready={!!social && !!partners}
        >
          <h2 className="section-social__head-title">
            {t('footer_social_title')}
          </h2>
          {/* {(androidApp || iosApp) && (
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
        )} */}
          <p className="section-social__title">{t('find_us_in_social')}</p>
          <p className="section-social__icons">
            {!!webSocial &&
              Object.entries(webSocial)
                .filter(Boolean)
                .map(([key, value]) => (
                  <a
                    key={key}
                    href={value}
                    className="section-social__icons-link"
                  >
                    <i className={`icon-${iconName[key] || key}`}></i>
                  </a>
                ))}
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
                    href={value}
                    className="section-social__icons-link"
                  >
                    <img
                      alt={`partner-${key}`}
                      height="42"
                      src={`/assets/images/footer/${key}.jpg`}
                    />
                  </a>
                ))}
          </p>
        </ReactPlaceholder>
      </div>
      <div className="footer-info-text d-none d-xxl-flex align-items-end ml-3 mb-2">
        <p>{t('footer_info_text')}</p>
      </div>
    </section>
  );
};

const SortedFooterLinks = ({ links }: { links?: FooterDataLink[] }): any => {
  const { t } = useI18n();
  const desktopWidth = useDesktopWidth(768);
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

  if (!links) {
    return (
      <section className="footer-links-block">
        <ReactPlaceholder
          rows={7}
          showLoadingAnimation
          type="text"
          ready={false}
          style={{ maxWidth: '90%' }}
          children={<div />}
        />
      </section>
    );
  }
  return links
    ?.sort((a, b) => sortAscending(a.order, b.order))
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
                {t(linkContainer.name)}
              </FooterLink.Title>
              <FooterLink.Children>
                {linkContainer.children
                  .sort((a, b) => sortAscending(a.order, b.order))
                  .map(child => (
                    <Link
                      key={child.name}
                      to={child.link || '#'}
                      onClick={() => onGtmLinkClick(child.name)}
                      className={
                        child.button
                          ? 'btn btn-outline-light btn-sm mt-3'
                          : 'section-item__link'
                      }
                    >
                      {t(child.name)}
                    </Link>
                  ))}
              </FooterLink.Children>
            </FooterLink.Container>
          ))}
      </section>
    ));
};

const PageFooter = React.forwardRef<HTMLElement>((_, ref) => {
  const { footer } = useConfig((prev, next) => !!prev.footer === !!next.footer);
  return (
    <footer ref={ref}>
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
});

export default PageFooter;

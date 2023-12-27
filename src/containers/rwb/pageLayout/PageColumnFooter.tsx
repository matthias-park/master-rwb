import React from 'react';
import { StyledColumnFooter } from '../components/styled/StyledColumnFooter';
import { useConfig } from '../../../hooks/useConfig';
import { useI18n } from '../../../hooks/useI18n';
import Link from '../../../components/Link';
import SessionTimer from '../../../components/SessionTimer';
import { ThemeSettings } from '../../../constants';
import clsx from 'clsx';
import CurrentTimeTimer from '../../../components/CurrentTimeTimer';
import { isMobile, isTablet } from 'react-device-detect';
import { useAuth } from '../../../hooks/useAuth';

const PageColumnFooter = () => {
  const { icons: icon } = ThemeSettings!;
  const { t } = useI18n();
  const { footer } = useConfig((prev, next) => !!prev.footer === !!next.footer);
  const { user } = useAuth();

  if (!footer) {
    return null;
  }
  const FooterLinks = () => {
    return (
      <div className="footer-item footer-links">
        <div className="footer-links__image">
          <img alt="footer-logo" src={'/assets/images/logo/header-logo.png'} />
          {isMobile && user.logged_in && (
            <>
              <div className="footer-info-timer">
                <div className="footer-info-timer__current">
                  <CurrentTimeTimer timeFormat={'MM/DD/YYYY h:mmA z'} />
                </div>
                <div className="footer-info-timer__session">
                  <span className="timer">
                    <i className={clsx('mr-1', icon?.clock)} />
                    <SessionTimer />
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="footer-links__list">
          {footer?.rowFooterLinks?.map((link, i) => (
            <span
              key={`${link.link}_${i}`}
              className="footer-links__list__link"
            >
              <i className={clsx(icon?.documents)} />
              <Link to={link.link}>{t(link.title_symbol)}</Link>
            </span>
          ))}
        </div>
      </div>
    );
  };
  const FooterDescription = () => {
    return (
      <div className="footer-item footer-description">
        <div className="footer-payments">
          <div className="footer-payments__title">
            <p>{t('depositing_options')}</p>
          </div>
          <div className="footer-payments__images">
            {footer?.rowFooterPayments?.map((src, i) => (
              <img
                alt={`payment-${i}`}
                src={src}
                key={`payment-${i}`}
                className="footer-payments__img"
              />
            ))}
          </div>
        </div>
        <div className="footer-image-text">
          <div className="footer-image-text__images">
            <img
              alt="responsible-gaming"
              src="/assets/images/footer/responsible-gaming.png"
            />
            <img alt="21-label" src="/assets/images/footer/21-label.png" />
          </div>
          <div className="footer-image-text__text">
            <p>{t('gaming_problem_note')}</p>

            <p>{t('gaming_department_note')}</p>
            <p>{t('gaming_licensed_note')}</p>
          </div>
        </div>

        <div className="footer-item footer-note">{t('copyright_text')}</div>
      </div>
    );
  };
  const FooterInfo = () => {
    return (
      <div className="footer-item footer-info">
        {!isMobile && user.logged_in && (
          <>
            <div className="footer-info-timer">
              <div className="footer-info-timer__current">
                <CurrentTimeTimer timeFormat={'MM/DD/YYYY h:mmA z'} />
              </div>
              <div className="footer-info-timer__session">
                <span className="timer">
                  <i className={clsx('mr-1', icon?.clock)} />
                  <SessionTimer />
                </span>
              </div>
            </div>
          </>
        )}
        <div className="footer-info__section">
          <div className="footer-info__section-title">{t('play_anywhere')}</div>
          <div className="footer-info__section-block">
            {footer?.rowFooterApps?.map((app, i) => (
              <a
                target="_blank"
                rel="noreferrer"
                key={`${app.link}_${i}`}
                href={app.link}
              >
                <img alt="footer-apps" src={app.src} />
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };
  return (
    <StyledColumnFooter className="styled-column-footer">
      <FooterLinks />
      {isMobile && !isTablet ? (
        <>
          <FooterInfo />
          <FooterDescription />
        </>
      ) : (
        <>
          <FooterDescription />
          <FooterInfo />
        </>
      )}
    </StyledColumnFooter>
  );
};

export default PageColumnFooter;

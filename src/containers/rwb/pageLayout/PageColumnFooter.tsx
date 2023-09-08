import React from 'react';
import { StyledColumnFooter } from '../components/styled/StyledColumnFooter';
import { useConfig } from '../../../hooks/useConfig';
import { useI18n } from '../../../hooks/useI18n';
import Link from '../../../components/Link';
import SessionTimer from '../../../components/SessionTimer';
import { ThemeSettings } from '../../../constants';
import clsx from 'clsx';

const PageColumnFooter = () => {
  const { icons: icon } = ThemeSettings!;
  const { t, jsxT } = useI18n();
  const { footer } = useConfig((prev, next) => !!prev.footer === !!next.footer);

  if (!footer) {
    return null;
  }

  return (
    <StyledColumnFooter className="styled-column-footer">
      <div className="footer-item footer-sub">
        <div className="footer-sub__section">
          {t('time_spent')}
          <span className="timer">
            <i className={clsx('mr-1', icon?.clock)} />
            <SessionTimer />
          </span>
        </div>
        <div className="footer-sub__section">
          <img
            alt="approved-age"
            src={'/assets/images/footer/approved-age.svg'}
          />
          {jsxT('gambling_problem_text')}
        </div>
      </div>
      <div className="footer-item footer-image-text">
        <div className="footer-image-text__images">
          <img alt="" src="/assets/images/footer/responsible-gaming.png" />
        </div>
        <p>{t('gaming_department_note')}</p>
      </div>
      <div className="footer-item footer-info">
        <div className="footer-info__section">
          {t('play_anywhere')}
          <div className="footer-info__section-block">
            {footer?.rowFooterApps?.map((app, i) => (
              <a
                target="_blank"
                rel="noreferrer"
                key={`${app.link}_${i}`}
                href={app.link}
              >
                <img
                  alt="android"
                  src={
                    app.name === 'android'
                      ? '/assets/images/footer/android.png'
                      : '/assets/images/footer/ios.png'
                  }
                />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-info__section">
          {t('find_us_also')}
          <div className="footer-info__section-icons">
            {footer?.rowFooterSocials?.map((social, i) => (
              <Link
                key={`${social.link}_${i}`}
                to={social.link}
                target={clsx(social.link.includes('https://') && '_blank')}
              >
                <span className="icon">
                  <i className={social.icon}></i>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-item footer-links">
        {footer?.rowFooterLinks?.map((link, i) => (
          <span key={`${link.link}_${i}`} className="footer-links__link">
            <Link to={link.link}>{t(link.title_symbol)}</Link>
          </span>
        ))}
      </div>

      <div className="footer-item footer-note">{t('copyright_text')}</div>
    </StyledColumnFooter>
  );
};

export default PageColumnFooter;

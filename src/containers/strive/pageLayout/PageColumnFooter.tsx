import React from 'react';
import { StyledColumnFooter } from '../components/styled/StyledColumnFooter';
import { useConfig } from '../../../hooks/useConfig';
import { useI18n } from '../../../hooks/useI18n';
import Link from '../../../components/Link';
import { Franchise, Config } from '../../../constants';
import SessionTimer from '../../../components/SessionTimer';
import clsx from 'clsx';

const PageColumnFooter = () => {
  const { t } = useI18n();
  const { footer } = useConfig((prev, next) => !!prev.footer === !!next.footer);

  if (!footer) {
    return null;
  }

  return (
    <StyledColumnFooter>
      <div className="footer-item footer-sub">
        <div className="footer-sub__section">
          {t('time_spent')}
          <span className="timer">
            <i className={`icon-${Config.name}-clock mr-1`} />
            <SessionTimer />
          </span>
        </div>
        <div className="footer-sub__section">
          <img
            alt="21+"
            src={
              Franchise.desertDiamond
                ? '/assets/images/footer/21-label.webp'
                : '/assets/images/footer/21plus.svg'
            }
          />
          {t('gambling_problem_text')}
        </div>
      </div>
      {(Franchise.gnogaz || Franchise.gnogon) && (
        <div className="footer-item footer-payments">
          {footer?.rowFooterPayments?.map(paymentImg => (
            <img
              key={paymentImg}
              alt="payment"
              className="footer-payments__img"
              src={paymentImg}
            />
          ))}
        </div>
      )}
      {Franchise.desertDiamond && (
        <div className="footer-item footer-image-text">
          <div className="footer-image-text__images">
            <img src="/assets/images/footer/gaming-department.png" />
            <img src="/assets/images/footer/responsible-gaming.png" />
          </div>
          <p>{t('gaming_department_note')}</p>
        </div>
      )}
      <div className="footer-item footer-info">
        <div className="footer-info__section">
          {t('play_anywhere')}
          <div className="footer-info__section-block">
            {footer?.rowFooterApps?.map(app => (
              <a target="_blank" key={app.link} href={app.link}>
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
        {(Franchise.gnogaz || Franchise.gnogon) && (
          <div className="footer-info__section partners">
            {footer?.rowFooterPartners?.map(partner => (
              <Link
                key={partner.link}
                to={partner.link}
                target={clsx(partner.link.includes('https://') && '_blank')}
              >
                <img alt="partner" src={partner.image} />
              </Link>
            ))}
          </div>
        )}
        <div className="footer-info__section">
          {t('find_us_also')}
          <div className="footer-info__section-icons">
            {footer?.rowFooterSocials?.map(social => (
              <Link
                key={social.link}
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
        {footer?.rowFooterLinks?.map(link => (
          <span className="footer-links__link">
            <Link to={link.link}>{t(link.title_symbol)}</Link>
          </span>
        ))}
      </div>
      <div className="footer-item footer-note">{t('copyright_text')}</div>
    </StyledColumnFooter>
  );
};

export default PageColumnFooter;

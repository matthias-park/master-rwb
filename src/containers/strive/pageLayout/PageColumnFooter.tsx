import React from 'react';
import { StyledColumnFooter } from '../components/styled/StyledColumnFooter';
import { useConfig } from '../../../hooks/useConfig';
import { useI18n } from '../../../hooks/useI18n';
import Link from '../../../components/Link';
import SessionTimer from '../../../components/SessionTimer';

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
          {t('time_spent')}{' '}
          <span className="text-white mx-1">Golden Nugget</span>
          <span className="timer">
            <i className="icon-gnogaz-clock mr-1"></i>
            <SessionTimer />
          </span>
        </div>
        <div className="footer-sub__section">
          <img alt="21+" src={'/assets/images/footer/21plus.svg'} />
          {t('gambling_problem_text')}
        </div>
      </div>
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
      <div className="footer-item footer-info">
        <div className="footer-info__section">
          {t('play_anywhere')}
          <div className="footer-info__section-block">
            <img alt="android" src={'/assets/images/footer/android.png'} />
            <img alt="ios" src={'/assets/images/footer/ios.png'} />
          </div>
        </div>
        <div className="footer-info__section partners">
          {footer?.rowFooterPartners?.map(partner => (
            <Link key={partner.link} to={partner.link}>
              <img alt="partner" src={partner.image} />
            </Link>
          ))}
        </div>
        <div className="footer-info__section">
          {t('find_us_also')}
          <div className="footer-info__section-icons">
            <span className="icon">
              <i className="icon-strive-facebook"></i>
            </span>
            <span className="icon">
              <i className="icon-strive-twitter"></i>
            </span>
            <span className="icon">
              <i className="icon-strive-youtube"></i>
            </span>
            <span className="icon">
              <i className="icon-strive-nsta"></i>
            </span>
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

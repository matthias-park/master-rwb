import React from 'react';
import Button from 'react-bootstrap/Button';
import useDesktopWidth from '../../../hooks/useDesktopWidth';
import { useAuth } from '../../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { useConfig } from '../../../hooks/useConfig';
import isEqual from 'lodash.isequal';
import { useI18n } from '../../../hooks/useI18n';

const BankingNav = () => {
  const { t } = useI18n();
  const desktopWidth = useDesktopWidth(992);
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { cookies } = useConfig((prev, next) =>
    isEqual(prev.cookies, next.cookies),
  );
  return !desktopWidth && user.logged_in && cookies.accepted ? (
    <div className="banking-nav">
      <Button
        className="rounded-pill banking-nav__btn"
        as={'a'}
        href={!pathname.includes('witdraw') ? 'account/wallet/witdraw' : '#'}
        variant="secondary"
      >
        <i className="icon-cash"></i>
        {user.balance} {user.currency}
      </Button>
      <Button
        className="rounded-pill banking-nav__btn"
        as={'a'}
        href={!pathname.includes('deposit') ? 'account/wallet/deposit' : '#'}
      >
        {t('deposit_link')}
      </Button>
    </div>
  ) : (
    <></>
  );
};

export default BankingNav;

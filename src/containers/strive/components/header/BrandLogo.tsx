import clsx from 'clsx';
import React from 'react';
import Link from '../../../../components/Link';
import { PagesName } from '../../../../constants';
import { useRoutePath } from '../../../../hooks';

interface BrandLogoProps {
  mobile: boolean;
}

const BrandLogo = ({ mobile }: BrandLogoProps) => {
  const logoSuffix = mobile ? '-small' : '';
  const homePageRoute = useRoutePath(PagesName.HomePage, true);
  return (
    <Link
      className={mobile ? 'header__mobile-logo' : 'header__desktop-logo'}
      to={homePageRoute}
    >
      <img
        alt="logo"
        src={`/assets/images/logo/logo${logoSuffix}.png`}
        className={clsx(!mobile && 'mt-4')}
        width={mobile ? 25 : 90}
        height={mobile ? 25 : 50}
      />
    </Link>
  );
};

export default BrandLogo;

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
        src={`/assets/images/logo/logo${logoSuffix}.svg`}
        width={mobile ? 45 : 165}
        height={mobile ? 45 : 120}
      />
    </Link>
  );
};

export default BrandLogo;

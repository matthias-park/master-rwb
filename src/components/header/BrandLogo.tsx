import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  mobile: boolean;
}

const BrandLogo = ({ mobile }: BrandLogoProps) => {
  const logoSuffix = mobile ? '-small' : '';
  return (
    <Link
      className={mobile ? 'header__mobile-logo' : 'header__desktop-logo'}
      to="/"
    >
      <img
        alt="logo"
        src={`/assets/images/logo/logo${logoSuffix}.svg`}
        width={mobile ? 32 : 240}
        height={mobile ? 32 : 45}
      />
    </Link>
  );
};

export default BrandLogo;

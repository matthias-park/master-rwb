import clsx from 'clsx';
import React from 'react';
import { Franchise, PagesName } from '../../../../constants';
import { useRoutePath } from '../../../../hooks';
import { StyledLogo } from '../styled/StyledHeader';

interface BrandLogoProps {
  mobile: boolean;
}
const webpLogo =
  Franchise.strive ||
  Franchise.gnogaz ||
  Franchise.gnogon ||
  Franchise.mothership;
const BrandLogo = ({ mobile }: BrandLogoProps) => {
  const logoSuffix = mobile ? '-small' : '';
  const homePageRoute = useRoutePath(PagesName.HomePage, true);
  const width = webpLogo ? (mobile ? 25 : 90) : mobile ? 90 : 200;
  return (
    <StyledLogo className="styled-logo" mobile={mobile} to={homePageRoute}>
      <img
        alt="logo"
        src={`/assets/images/logo/logo${logoSuffix}.${
          webpLogo ? 'webp' : 'svg'
        }`}
        className={clsx(!mobile && 'mt-4')}
        width={width}
        height={mobile ? 25 : 50}
      />
    </StyledLogo>
  );
};

export default BrandLogo;

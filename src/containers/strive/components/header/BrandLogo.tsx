import clsx from 'clsx';
import React from 'react';
import { PagesName } from '../../../../constants';
import { useRoutePath } from '../../../../hooks';
import { StyledLogo } from '../styled/StyledHeader';

interface BrandLogoProps {
  mobile: boolean;
}

const BrandLogo = ({ mobile }: BrandLogoProps) => {
  const logoSuffix = mobile ? '-small' : '';
  const homePageRoute = useRoutePath(PagesName.HomePage, true);
  return (
    <StyledLogo mobile={mobile} to={homePageRoute}>
      <img
        alt="logo"
        src={`/assets/images/logo/logo${logoSuffix}.webp`}
        className={clsx(!mobile && 'mt-4')}
        width={mobile ? 25 : 90}
        height={mobile ? 25 : 50}
      />
    </StyledLogo>
  );
};

export default BrandLogo;

import { Config } from './constants';
import { FranchiseThemes } from './types/FranchiseNames';

const franchiseTheme = Config.theme;
switch (franchiseTheme) {
  case FranchiseThemes.Bnl: {
    import(`./containers/bnl`);
    break;
  }
  case FranchiseThemes.Xcasino: {
    import(`./containers/xcasino`);
    break;
  }
  case FranchiseThemes.XcasinoCom: {
    import(`./containers/xcasinoCom`);
    break;
  }
  case FranchiseThemes.Strive:
  default: {
    import(`./containers/strive`);
    break;
  }
}

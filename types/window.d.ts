import { DefaultTheme } from 'styled-components';
import { Symbols } from '../src/state/reducers/translations';
import ContentPage from '../src/types/api/content/ContentPage';
import { PageConfig } from '../src/types/api/PageConfig';
import { ComponentSettings } from '../src/types/ComponentSettings';
import DeviceInfo from '../src/types/DeviceInfo';
import { FranchiseNames, FranchiseThemes } from '../src/types/FranchiseNames';
import KambiConfig, { CustomerSettings } from '../src/types/KambiConfig';
import TGLabSbConfig, { TGLabSbPageType } from '../src/types/TGLabSbConfig';

export declare global {
  interface Window {
    //Webpack
    __config__: {
      name: FranchiseNames;
      apiUrl: string;
      gtmId?: string;
      sentryDsn?: string;
      theme: FranchiseThemes;
      kambi?: {
        currency: string;
        market: string;
        online: string;
        retail?: string;
        api: string;
        oddsFormat?: string;
        eventStatistics?: string;
        enableOddsFormatSelector?: boolean;
        fallbackLocale?: string;
        vaixScript?: string;
        historyRouting?: boolean;
      };
      sbTechUrl?: string;
      zendesk?: string;
      smartyStreets?: string;
      tgLabSb?: {
        id: number;
        bundle: string;
        format: string;
      };
      googleRecaptchaKey?: string;
      geoComplyKey?: string;
      xtremepush?: string;
      dateFormat?: string;
      componentSettings?: ComponentSettings;
      themeSettings?: DefaultTheme;
      casino?: boolean;
      ip: string;
      singleLoadPage?: boolean;
      device: DeviceInfo;
      countryNotAllowed?: boolean;
      initPath: string;
      constants: PageConfig;
      translations: Symbols;
      contentPage?: ContentPage;
      seoTitleSeperator: string;
    };
    user_locale: string;
    xtremepush?: any;
    _wbUpdate?: (pathname?: string) => void;
    //Webpack end
    //Kambi sportsbook
    customerSettings?: CustomerSettings;
    _kc?: KambiConfig;
    _kbc?: { dispose: any };
    KambiWidget?: { ready: Promise<any> };
    //Kambi end
    //GeoComply
    GeoComply?: { Client: any };
    //GeoComply end
    //TGLab sportsbook
    __SB_INIT__?: TGLabSbConfig;
    betSlipLoaded?: () => void;
    ExternalBetSlipLogin?: () => void;
    betSlipLoginOnSuccess?: () => void;
    betSlipLoginOnError?: () => void;
    externalSBPageSwitch?: (
      pageType: TGLabSbPageType,
      changePath?: boolean,
    ) => void;
    externalSBReload?: () => void;
    externalLogOut?: () => void;
    betListCenterShow?: () => void;
    //TGLab end
  }
}

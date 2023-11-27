import { ComponentSettings } from '../../types/ComponentSettings';
import { mergeDeep } from '../../utils';

const settings: ComponentSettings = mergeDeep(
  {
    needsNANPFormatting: true, // NANP formatting ===  https://en.wikipedia.org/wiki/North_American_Numbering_Plan
    balancesContainer: true,
    modals: {
      TnC: true,
      ResponsibleGambling: true,
      ValidationFailed: true,
      CookiePolicy: true,
      AddBankAccount: true,
      GeoComply: true,
      PlayerDisabled: true,
      limits: true,
      RegWelcome: false,
      CasinoGameInfo: false,
    },
    header: {
      needsCompanyLogo: false,
      needsBurger: false,
    },
    transactions: {
      needsOverviewTable: false,
    },
    footer: {
      needsServerTime: false,
      needsSessionTime: true,
    },
    assetsOnSportsPage: {
      useAssets: false,
      headerLogo: '',
    },
    personalInfo: {
      needsOccupationInfo: false,
    },
    bonuses: {
      queueBonuses: {
        paginate: false,
        searchBar: false,
      },
    },
    register: {
      parseMiddlename: false,
      flipFormIDs: [''],
      filterFormIDs: [''],
      requiredValidations: {
        needsLength: 7,
        needsLowerCase: true,
        needsUpperase: true,
        needsNumbers: true,
        needsSpecialCharacters: false,
        needsEmail: false,
      },
    },
    communicationPreferences: {
      mobilePref: false,
      endPointVerison: 'v1',
    },
    casino: {
      bottomNav: true,
      searchBar: true,
      casinoFilter: true,
    },
  } as ComponentSettings,
  window.__config__.componentSettings,
);

export default settings;

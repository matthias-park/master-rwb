import { ComponentSettings } from '../../types/ComponentSettings';
import { mergeDeep } from '../../utils';

const settings: ComponentSettings = mergeDeep(
  {
    transactions: {
      needsOverviewTable: false,
    },
    bonuses: {
      queueBonuses: {
        paginate: false,
        searchBar: false,
      },
    },
    register: {
      parseMiddlename: false,
    },
    communicationPreferences: {
      mobilePref: false,
      endPointVerison: 'v1',
    },
    modals: {
      TnC: false,
      ResponsibleGambling: false,
      ValidationFailed: false,
      CookiePolicy: false,
      AddBankAccount: false,
      GeoComply: false,
      PlayerDisabled: false,
      limits: false,
    },
  } as ComponentSettings,
  window.__config__.componentSettings,
);

export default settings;

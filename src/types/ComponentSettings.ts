export interface ComponentSettings {
  v2Auth?: string;
  userIdleTimeout?: number;
  login?: {
    loginCookiesAccept?: boolean;
    emailLogin?: boolean;
  };
  limitsOnAction?: string[];
  useBalancesEndpoint?: boolean;
  modals: {
    TnC: boolean;
    ResponsibleGambling: boolean;
    ValidationFailed: boolean;
    CookiePolicy: boolean;
    AddBankAccount: boolean;
    GeoComply: boolean;
    PlayerDisabled: boolean;
    limits: boolean;
  };
  header?: {
    needsBurger?: boolean;
  };
  transactions: {
    needsOverviewTable?: boolean;
  };
  bonuses: {
    activeBonuses?: {
      paginate: boolean;
      searchBar: boolean;
    };
    queueBonuses: {
      paginate: boolean;
      searchBar: boolean;
    };
  };
  completeRegistration?: boolean;
  communicationPreferences: {
    mobilePref: boolean;
    endPointVerison: string;
  };
}

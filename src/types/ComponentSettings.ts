export interface ComponentSettings {
  v2Auth?: string;
  userIdleTimeout?: number;
  showTimedOutPlayerBanner: boolean;
  showValidatorStatusBanner?: boolean;
  register: {
    multiStepForm: boolean;
  };
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
    DepositThreshold?: boolean;
    KBAQuestions?: boolean;
  };
  header?: {
    needsBurger?: boolean;
    geoComplyStatusAlert?: boolean;
    needsCompanyLogo?: boolean;
  };
  geoComply?: {
    checkOnLogin?: boolean;
    checkOnCasinoGame?: boolean;
  };
  transactions: {
    needsOverviewTable?: boolean;
  };
  bonuses: {
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

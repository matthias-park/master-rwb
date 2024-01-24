export interface ComponentSettings {
  v2Auth?: string;
  userIdleTimeout?: number;
  sessionReminderTime?: number;
  showTimedOutPlayerBanner?: boolean;
  showValidatorStatusBanner?: boolean;
  login?: {
    loginCookiesAccept?: boolean;
    emailLogin?: boolean;
  };
  limitsOnAction?: string[];
  useBalancesEndpoint?: boolean;
  balancesContainer?: boolean;
  register?: {
    multiStepForm?: boolean;
    filterFormIDs: string[];
    flipFormIDs: string[];
    parseMiddlename: boolean;
    requiredValidations: {
      needsLength: number;
      needsLowerCase: boolean;
      needsUpperase: boolean;
      needsNumbers: boolean;
      needsSpecialCharacters: boolean;
      needsEmail: boolean;
    };
  };
  assetsOnSportsPage?: {
    useAssets?: boolean;
    headerLogo?: string;
  };
  useRealityCheck?: boolean;
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
    SessionReminder?: boolean;
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

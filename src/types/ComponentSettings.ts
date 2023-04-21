export interface ComponentSettings {
  v2Auth?: string;
  userIdleTimeout?: number;
  login?: {
    loginCookiesAccept?: boolean;
    emailLogin?: boolean;
  };
  limitsOnAction?: string[];
  useBalancesEndpoint?: boolean;
  balancesContainer?: boolean;
  register?: {
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

export interface ComponentSettings {
  v2Auth?: string;
  userIdleTimeout?: number;
  login?: {
    loginCookiesAccept?: boolean;
    emailLogin?: boolean;
  };
  limitsOnAction?: string[];
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
}

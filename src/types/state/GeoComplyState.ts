export interface LocalStorageState {
  id: number;
  ip: string;
  nextGeoCheck?: string;
  geoError?: number | null;
  retryCount?: number;
}

interface GeoComplyState {
  isReady: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  isGeoAllowed: boolean;
  error: number | null;
  geoLocation: string | null;
  license: string | null;
  licenseExpiresAt: string | null;
  geoInProgress: boolean;
  wasConnected: boolean;
  revalidateIn: string | null | undefined;
  userId: number | null;
  validationReason: string | null;
  userIp: string | null;
  savedState: LocalStorageState | null;
  geoValidationInProgress: boolean;
  retryCount: number;
  userLoggedIn: boolean;
}
export default GeoComplyState;

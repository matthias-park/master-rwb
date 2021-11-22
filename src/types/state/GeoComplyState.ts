export interface LocalStorageState {
  id: number;
  nextGeoCheck: string;
}

interface GeoComplyState {
  isReady: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  isGeoAllowed: boolean;
  error: number | null;
  geoLocation: string | null;
  license: string | null;
  geoInProgress: boolean;
  wasConnected: boolean;
  revalidateIn: string | null | undefined;
  userId: number | null;
  validationReason: string | null;
  savedState: LocalStorageState | null;
}
export default GeoComplyState;

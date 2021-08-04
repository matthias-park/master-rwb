export enum GeoComplyValidateCodes {
  Ok = 0,
  UserRejected = 1,
  WrongUser = 2,
  UnreadableGeopackage = 3,
  WrongCredentials = 4,
  TooOldTimestamp = 5,
  InternalServerError = 500,
}

interface GeoComplyValidate {
  Success: boolean;
  Code: GeoComplyValidateCodes;
  CodeString: string;
  Message: string | null;
  GeolocateIn: string;
}

export default GeoComplyValidate;

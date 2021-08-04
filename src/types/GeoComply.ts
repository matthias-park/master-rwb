export enum GeoComplyErrorCodes {
  FAILED_TO_LOAD_CLIENT = -1,
  CLNT_OK = 0, //No errors
  UserRejected = 1,
  WrongUser = 2,
  UnreadableGeopackage = 3,
  WrongCredentials = 4,
  TooOldTimestamp = 5,
  InternalServerError = 500,
  CLNT_ERROR_UNEXPECTED = 600, // Unexpected error occurs
  CLNT_ERROR_NOT_CERTIFIED_BINARIES = 601, //Signature verification of PLC support binaries fails. Means the binaries have been tampered with.
  CLNT_ERROR_NETWORK_CONNECTION = 602, //Network connection from PLC to Server is not available. Please retry the connection later.
  CLNT_ERROR_SERVER_COMMUNICATION = 603, //The server communication failed.
  CLNT_ERROR_CLIENT_SUSPENDED = 604, //Operator’s account is suspended by administrator at GeoComply Back Office site.
  CLNT_ERROR_DISABLED_SOLUTION = 605, //Geolocation solution is disabled for this operator’s account by administrator at GeoComply Back Office site.
  CLNT_ERROR_INVALID_LICENSE_FORMAT = 606, //Invalid license data. License data is malformed or corrupted
  CLNT_ERROR_CLIENT_LICENSE_UNAUTHORIZED = 607, //Operator’s license is not authorized by GeoComply server.
  CLNT_ERROR_LICENSE_EXPIRED = 608,
  CLNT_ERROR_INVALID_CUSTOM_FIELDS = 609, //Invalid list of custom fields is provided to SDK
  CLNT_ERROR_LOCAL_SERVICE_UNAVAILABLE = 612, //SDK is unable to find PLC (local service) on the user’s computer.
  CLNT_ERROR_LOCAL_SERVICE_COMMUNICATION = 613, //Communication with PLC (local service) failed.
  CLNT_ERROR_REQUEST_GEOLOCATION_IN_PROGRESS = 614, //Operator’s app receives this error if it runs a new geolocation request while previous geolocation request is in progress.
  CLNT_ERROR_LOCAL_SERVICE_UNSUP_VER = 615, //SDK is able to detect PLC (local service) installed on the user’s computer, but installed version is not supported by the current version of the JS library.
  CLNT_ERROR_TRANSACTION_TIMEOUT = 620, //The “create transaction” procedure took more time than what the configuration allows.
}

export interface Storage {
  essential: boolean;
  functional: boolean;
  thirdParty: boolean;
}
export interface StorageSettings {
  cookies: Storage;
  save: (cookies: Storage) => void;
}

export interface Storage {
  functional: boolean;
  marketing: boolean;
  analytics: boolean;
  personalization: boolean;
}
export interface StorageSettings {
  cookies: Storage;
  save: (cookies: Storage) => void;
}

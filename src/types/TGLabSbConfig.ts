export enum TGLabSbPageType {
  Prematch = 1,
  InPlay = 2,
}

interface TGLabSbConfig {
  config: {
    fr: number;
    lang: string;
    country: string;
    tz: string;
    format: string;
    b_history?: string;
    load_history: boolean;
    live_path?: string | null;
    pre_path?: string | null;
    token?: string | null;
    preloader?: boolean;
    external_widgets?: {
      content: string;
      wrapper: string;
    }[];
    jquery?: boolean;
  };
}
export default TGLabSbConfig;

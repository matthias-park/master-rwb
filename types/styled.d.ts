import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      white: {
        main: string;
        light: string;
      };
      gray: {
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
        custom: string;
        custom_100: string;
        custom_200: string;
        custom_300: string;
        custom_400: string;
        dark: string;
      };
      black: {
        main: string;
        custom: string;
        light: string;
      };
      blue: string;
      indigo: string;
      purple: string;
      pink: string;
      red: string;
      orange: string;
      yellow: string;
      green: string;
      teal: string;
      cyan: string;
      success: string;
      warning: string;
      danger: string;
      light: string;
      dark: string;
      subBrand: string;
      lightSpacer: string;
      account: {
        light: string;
      };
      primary: {
        main: string;
        light: string;
        hover: string;
      };
      brand: {
        main: string;
        light: string;
        text: string;
      };
      secondary: string;
    };
    sizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
      xxlg: string;
      xxxlg: string;
      xxxl: string;
    };
  }
}

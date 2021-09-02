import { DefaultTheme } from 'styled-components';
import { mergeDeep } from '../../utils';

const theme: DefaultTheme = mergeDeep(
  {},
  {
    colors: {
      white: {
        main: '#ffffff',
        light: 'rgba(255,255,255,0.75)',
      },
      gray: {
        '100': '#e5e5e5',
        '200': '#cccccc',
        '300': '#b2b2b2',
        '400': '#999999',
        '500': '#7f7f7f',
        '600': '#666666',
        '700': '#4c4c4c',
        '800': '#323232',
        '900': '#c4c4c4',
        custom: '#efeff4',
        custom_100: '#f9f9f9',
        custom_200: '#f6f6f6',
        custom_300: '#fafafa',
        custom_400: '#efeff4',
        dark: '#e2e2eb',
      },
      blue: '#007bff',
      indigo: '#6610f2',
      purple: '#6f42c1',
      pink: '#e83e8c',
      red: '#dc3545',
      orange: '#ff6400',
      yellow: '#ffc107',
      green: '#28a745',
      teal: '#20c997',
      cyan: '#17a2b8',
      primary: {
        hover: '#00C537',
        main: '#44d9e6',
        light: '#5eed53',
      },
      black: {
        main: '#000000',
        custom: '#202020',
        light: '#595959',
      },
      account: {
        light: '#cff3e1',
      },
      brand: {
        main: '#000',
        light: '#000',
        text: '#031442',
      },
      danger: '#e73636',
      dark: '#323232',
      subBrand: '#ccdddb',
      light: '#ffffff',
      lightSpacer: 'rgb(229, 229, 229, 0.2)',
      secondary: '#666666',
      success: '#32ba62',
      warning: '#ffc107',
    },
    sizes: {
      xs: '0',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1366px',
      xxlg: '1460px',
      xxxlg: '1600px',
      xxxl: '1920px',
    },
  } as DefaultTheme,
  window.__config__.themeSettings,
);

export default theme;

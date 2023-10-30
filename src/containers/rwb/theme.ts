import { DefaultTheme } from 'styled-components';
import { Config } from '../../constants';
import { mergeDeep } from '../../utils';

const theme: DefaultTheme = mergeDeep(
  {},
  {
    boxShadow: {
      generic: 'rgb(0 0 0 / 12%) 0px 0px 5px 0px',
    },
    borderRadius: {
      sm: '8px',
    },
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
        main: 'white',
        light: '#444',
        text: '#fff',
        hover: '#bfbfbf',
      },
      danger: {
        main: '#e73636',
        bg: '#fef5f5',
      },
      info: '#FFB140',
      dark: '#323232',
      subBrand: '#ccdddb',
      light: '#ffffff',
      lightSpacer: 'rgb(229, 229, 229, 0.2)',
      secondary: {
        main: '#666666',
      },
      success: {
        main: '#32ba62',
        alt: '#4be48c',
      },
      warning: '#ffc107',
      body: '#202020',
      footer: {
        bottomText: 'rgba(255,255,255,0.75)',
      },
    },
    spacing: {
      bodyPadding: 80,
      bodyPaddingMedium: 45,
      bodyPaddingSmall: 20,
      footerMainTopPadding: 3,
      footerMainBottomPadding: 1.5,
      settingsBodyPadding: '0 25px 0 0',
      settingsMarginTop: 50,
    },
    fonts: {
      family: 'Dax offc',
      weight: {
        bold: 500,
      },
      size: {
        lg: '16px',
      },
    },
    footer: {
      listColor: 'rgba(255, 255, 255, 0.75)',
      listTitleWeight: 500,
      subFooterHeight: 80,
      clockIconSize: 35,
      clockIconMargin: '0',
    },
    communicationPrefs: {
      items: {
        backgroundColor: '#f9f9f9',
        border: '1px solid rgb(229, 229, 229)',
      },
    },
    pageContainer: {
      backgroundColor: '#ECF0F3',
    },
    pageInnerContainer: {
      titleWeight: 400,
    },
    login: {},
    registration: {
      width: 630,
      borderRadius: 10,
      boxShadow: '0 0 5px 0 rgb(0 0 0 / 12%)',
      blockTitleWeight: 500,
      blockTitleFontSize: 16,
      titleWeight: 400,
    },
    inputs: {
      border: '1px solid #cccccc',
      borderRadius: 4,
      padding: '17px 0.75rem 0.375rem 0.75rem',
      fontSize: 15,
      height: 38,
      backgroundColor: '#f9f9f9',
      color: '#4c4c4c',
      labelLeft: 12,
      labelTop: 12,
      labelActiveFontSize: 9,
      labelActiveTop: 4,
      labelActiveLeft: 12,
      labelBackgroundColor: 'transparent',
      labelPadding: 0,
      marginBottom: 8,
      selectPadding: '0 5px',
      disabled: {
        backgroundColor: '#e5e5e5',
        border: '1px solid #cccccc',
        color: '#4c4c4c',
      },
      active: {
        borderColor: '#4be48c',
      },
      invalid: {
        backgroundColor: 'inherit',
      },
    },
    customFileInput: {
      backgroundColor: '#f9f9f9',
      labelColor: '#4c4c4c',
      buttonFontColor: '#4c4c4c',
      buttonFontWeight: 400,
      buttonFontSize: '16px',
      buttonColor: '#ccc',
      border: '1px solid #cccccc',
    },
    toggleCheck: {
      slider: {
        width: '20px',
        height: '20px',
        left: '5px',
        checkedLeft: '60%',
        boxShadow: 'rgb(0 0 0 / 30%) 0px 2px 4px 0px',
      },
      height: '32px',
      minWidth: '62px',
      backgroundColor: 'rgb(229, 229, 229)',
      checkedBgColor: 'rgb(68, 217, 230)',
    },
    helpBlock: {
      titleWeight: 500,
      titleColor: '#202020',
      padding: '12px 16px 0 16px',
      color: '#202020',
      blockTitleWeight: 500,
      iconSize: 36,
    },
    userMenu: {
      boxShadow: '0 -2px 20px 0 rgb(0 0 0 / 30%)',
      borderRadius: 8,
      itemBorder: '1px solid #e5e5e5',
      itemWeight: 400,
      itemHeight: 64,
      itemFontSize: 16,
      width: 330,
      backgroundColor: '#fafafa',
      subItemBgColor: '#efeff4',
    },
    settingsMenu: {
      fontSize: 16,
      color: 'rgba(3, 20, 66, 0.7)',
      subBackgroundColor: 'rgb(239, 239, 244)',
    },
    inputContainer: {
      backgroundColor: '#efeff4',
      padding: 15,
      borderRadius: 8,
      quickBorderRadius: 8,
      quickPadding: '23px 0',
      quickColor: '#051B35',
      quickFontWeight: 500,
      quickBorder: 'none',
    },
    paymentMethods: {
      inRow: 6,
      padding: '15px',
      textAlign: 'center',
      borderRadius: 8,
    },
    settingsPage: {
      titleFontWeight: 500,
      titleMargin: '0',
      subTextMargin: '0 0 24px 0',
    },
    dateFilter: {
      padding: '20px 22px',
      margin: '0 0 1.5rem 0',
      periodBgColor: '#fff',
      periodColor: 'rgba(0,0,0,0.8)',
      periodActiveColor: 'rgba(0,0,0,0.8)',
      periodBorderRadius: 8,
      dateInputBg: '#fff',
      borderColor: '#44d9e6',
    },
    table: {
      headerFontSize: 12,
      headerColor: '#202020',
      itemColor: '#202020',
      itemFontSize: 11,
      itemBorder: '1px solid #cccccc',
    },
    questionsContainer: {
      borderRadius: 8,
      titleFontWeight: 500,
      itemBorder: '1px solid #cccccc',
    },
    infoContainer: {
      bgColor: '#cff3e1',
      color: '#999999',
      boldColor: '#000000',
      borderRadius: 8,
      limitNumberColor: '#44d9e6',
      limitNumberFontSize: 14,
      limitNumberFontWeight: 500,
      limitInfoColor: '#051B35',
      limitInfoTitleWeight: 500,
    },
    alert: {
      color: '#4c4c4c',
      padding: '20px 15px',
      iconColor: '#fff',
      fontSize: 14,
      iconSize: 24,
      iconBgSize: 32,
    },
    promotions: {},
    modals: {
      color: '#323232',
      title: {
        fontWeight: 500,
        fontSize: '1.375rem',
      },
    },
    genericModalWidth: '680px',
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
  Config.themeSettings,
  {},
);

export default theme;

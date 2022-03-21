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
      success: {
        main: string;
        alt: string;
      };
      warning: string;
      danger: {
        main: string;
        bg: string;
      };
      info: string;
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
        hover: string;
      };
      secondary: {
        main: string;
        light?: string;
        hover: string;
      };
      body: string;
      footer: {
        bottomText: string;
      };
      container?: string;
    };
    borderRadius: {
      sm: string;
    };
    boxShadow: {
      generic: string;
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
    spacing: {
      bodyPadding: number;
      bodyPaddingMedium: number;
      bodyPaddingSmall: number;
      footerMainTopPadding: number;
      footerMainBottomPadding: number;
      footerPrePadding: number;
      settingsBodyPadding: string;
      settingsMarginTop: number;
    };
    buttons: {
      borderRadius: number;
      fontSize: number;
      color?: string;
      transform?: string;
      primaryBgColor?: string;
      primaryBgHoverColor?: string;
      secondaryBgColor?: string;
      secondaryBgHoverColor?: string;
      primaryColor?: string;
      secondaryColor?: string;
      paddingY?: number;
      maxHeight?: number;
      disabled?: {
        backgroundColor: string;
        color: string;
      };
    };
    depositIframe: {
      height: string;
    };
    fonts: {
      family: string;
      weight: {
        bold: number;
      };
      size: {
        lg: string;
        md: string;
      };
    };
    header: {
      logoSize?: number;
      logoSizeMobile?: number;
      logoPosition?: string;
      borderBottom?: string;
      topOffset?: number;
      backgroundMobile?: string;
      marginBottom?: number;
      navHeightMobile?: number;
      navFontSize?: number;
    };
    footer: {
      listColor: string;
      listTitleWeight: number;
      timerBgColor?: string;
      iconsBg?: string;
      subFooterHeight: number;
      clockIconSize: number;
      clockIconMargin: string;
      bgColor?: string;
      color?: string;
    };
    translationLink: {
      textDecoration: string;
      color: string;
    };
    pageContainer: {
      smallMaxWidth: number;
      backgroundColor: string;
    };
    communicationPrefs: {
      bgColor?: string;
      color?: string;
      items: {
        backgroundColor: string;
        border: string;
      };
    };
    pageInnerContainer: {
      boxShadow?: string;
      titleWeight: number;
      bgColor?: string;
    };
    login: {
      bgImgTop?: string;
      linkDecoration?: string;
      linkColor?: string;
      linkFontSize?: number;
      buttonFullWidth?: boolean;
      formBorderBottom?: string;
      titleColor?: string;
    };
    registration: {
      width: number;
      left: string;
      borderRadius: number;
      boxShadow: string;
      bgImg?: string;
      titleWeight: number;
      titleColor?: string;
      blockTitleWeight: number;
      blockTitleTransform?: string;
      blockTitleBorder?: string;
      blockTitleColor?: string;
      blockTitleFontSize: number;
      blockTitlePaddingBottom?: number;
      bgColor?: string;
      blockBgColor?: string;
    };
    inputs: {
      border: string;
      borderRadius: number;
      padding: string;
      fontSize: number;
      height: number;
      backgroundColor: string;
      color: string;
      labelTop: number;
      labelLeft: number;
      labelActiveFontSize: number;
      labelActiveTop: number;
      labelActiveLeft: number;
      labelBackgroundColor: string;
      labelPadding: number;
      selectPadding: string;
      marginBottom: number;
      iconColor: string;
      disabled: {
        border: string;
        backgroundColor: string;
        color: string;
      };
      active: {
        borderColor: string;
      };
      invalid: {
        backgroundColor: string;
      };
      dropdownBg?: string;
    };
    customFileInput: {
      buttonColor: string;
      labelColor: string;
      buttonFontColor: string;
      backgroundColor: string;
      buttonFontWeight: number;
      buttonFontSize: string;
      border: string;
    };
    toggleCheck: {
      slider: {
        width: string;
        height: string;
        left: string;
        checkedLeft: string;
        boxShadow: string;
        color?: string;
        checkedColor?: string;
      };
      height: string;
      minWidth: string;
      backgroundColor: string;
      checkedBgColor: string;
      border?: string;
    };
    helpBlock: {
      titleWeight: number;
      titleColor: string;
      padding: string;
      border?: string;
      color: string;
      blockTitleWeight: number;
      blockTitleColor: string;
      iconSize: number;
      iconColor?: string;
      iconBgColor?: string;
      bgColor: string;
    };
    userMenu: {
      boxShadow: string;
      borderRadius: number;
      itemBorder: string;
      itemWeight: number;
      itemTransform?: string;
      itemFontSize: number;
      itemHeight: number;
      itemIconColor?: string;
      width: number;
      backgroundColor: string;
      subItemBgColor: string;
    };
    settingsMenu: {
      fontSize: number;
      color: string;
      fullHeight?: boolean;
      borderRadius?: number;
      activeBgColor?: string;
      fontWeight?: number;
      fontTransform?: string;
      bgColor?: string;
      subBackgroundColor: string;
      subItemBorder?: string;
      iconColor?: string;
      iconSize?: number;
      bottomBorderColor?: string;
    };
    inputContainer: {
      backgroundColor: string;
      borderRadius: number;
      padding: number;
      fullWidthButton?: boolean;
      iconButton?: boolean;
      customInput?: boolean;
      inputHeight?: number;
      inputBgColor?: string;
      inputFontSize?: number;
      inputFontWeight?: number;
      inputAlign?: string;
      inputColor?: string;
      quickBoxShadow?: string;
      quickBorderRadius: number;
      quickPadding: string;
      quickColor: string;
      quickFontWeight: number;
      quickBorder: string;
      quickBg?: string;
      quickBorderColor?: string;
    };
    paymentMethods: {
      inRow: number;
      mobilePadding: string;
      padding: string;
      textAlign: string;
      boxShadow?: string;
      border?: string;
      borderRadius: number;
    };
    settingsPage: {
      titleFontWeight: number;
      titleMargin: string;
      subTextMargin: string;
      minHeight?: string;
      marginTop?: number;
      containerMaxWidth?: number;
    };
    dateFilter: {
      padding: string;
      margin: string;
      periodBgColor: string;
      periodColor: string;
      periodActiveColor: string;
      periodBorderRadius: number;
      dateInputBg: string;
      dateInputColor?: string;
      dateInputBorder?: string;
      borderColor: string;
    };
    table: {
      headerFontSize: number;
      headerColor: string;
      itemColor: string;
      itemFontSize: number;
      itemBorder: string;
    };
    questionsContainer: {
      borderRadius: number;
      bgColor?: string;
      titleFontWeight: number;
      border?: string;
      itemBorder: string;
    };
    infoContainer: {
      bgColor: string;
      textBgColor: string;
      color: string;
      borderRadius: number;
      border?: string;
      borderTop?: string;
      titleMargin?: string;
      limitNumberColor: string;
      limitNumberFontSize: number;
      limitNumberFontWeight: number;
      limitInfoColor: string;
      limitInfoTitleWeight: number;
      limitInfoTitleTransform?: string;
      limitInfoBorder?: string;
      boldColor: string;
      activeHeaderColor?: string;
      activeHeaderButtonBgColor?: string;
    };
    outerInfoBlock: {
      bgColor?: string;
    };
    balancesList: {
      titleColor?: string;
    };
    alert: {
      color: string;
      padding: string;
      iconColor: string;
      iconSize: number;
      iconBgSize: number;
      fontSize: number;
      fontWeight?: number;
      invertedIconBg?: boolean;
      transparentBg?: boolean;
      margin: string;
    };
    promotions: {
      cardPadding?: string;
      cardShadow?: string;
      containerBgColor?: string;
      containerTitleColor?: string;
      containerColor?: string;
    };
    modals: {
      color: string;
      bgColor?: string;
      borderColor?: string;
      title: {
        fontWeight: number;
        fontSize: string;
      };
    };
    genericModalWidth: string;
    backdrop: {
      bgColor?: string;
    };
    spinnerVariant?: string;
    bonuses: {
      containerBgColor?: string;
      subTextColor?: string;
      boxShadow?: string;
      barColor?: string;
      barBgColor?: string;
      editHoverBgColor?: string;
      labelBgColor?: string;
    };
  }
}

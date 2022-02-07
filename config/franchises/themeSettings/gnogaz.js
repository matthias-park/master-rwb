module.exports = {
  boxShadow: {
    generic: 'none',
  },
  borderRadius: {
    sm: '4px',
  },
  colors: {
    primary: {
      main: '#FFDC3E',
      light: '#5eed53',
      hover: '#0790bf',
    },
    brand: {
      main: '#FFDC3E',
      light: '#444',
      text: '#fff',
      hover: '#bfbfbf',
    },
    secondary: {
      main: '#555555',
      hover: '#2c425f',
      light: '#999',
    },
    danger: {
      main: '#F44336',
    },
    success: {
      main: '#5CB660',
    },
    info: '#52ADF5',
    warning: '#EF9A1D',
    footer: {
      bottomText: '#778CA6',
    },
    body: '#000',
    lightSpacer: '#171717',
    container: '#222',
  },
  spacing: {
    bodyPadding: 25,
    bodyPaddingMedium: 20,
    bodyPaddingSmall: 20,
    footerMainTopPadding: 1.5,
    footerMainBottomPadding: 0,
    footerPrePadding: 0,
    settingsBodyPadding: '30px 15px',
    settingsMarginTop: 0,
  },
  buttons: {
    borderRadius: 3,
    fontSize: 16,
    color: '#FFF',
    transform: 'uppercase',
    primaryBgColor: '#FFDC3E',
    primaryBgHoverColor: '#edc200',
    primaryColor: '#000',
    secondaryBgColor: '#444444',
    secondaryBgHoverColor: '#333333',
    secondaryColor: '#fff',
    paddingY: 10,
    maxHeight: 40,
  },
  fonts: {
    family: 'Proxima Nova',
    weight: {
      bold: 700,
    },
    size: {
      lg: '18px',
      md: '16',
    },
  },
  header: {
    logoSize: 125,
    logoSizeMobile: 88,
    logoPosition: 'left',
    borderBottom: '1px solid #333',
    topOffset: 15,
    marginBottom: 40,
    navHeightMobile: 50,
  },
  footer: {
    listColor: '#fff',
    listTitleWeight: 700,
    timerBgColor: '#213956',
    subFooterHeight: 60,
    clockIconSize: 18,
    clockIconMargin: '0 6px',
  },
  translationLink: {
    color: '#FFDC3E',
  },
  communicationPrefs: {
    bgColor: '#222',
    color: '#fff',
    items: {
      backgroundColor: '#222',
      border: '1px solid #000',
    },
  },
  pageContainer: {
    smallMaxWidth: 480,
    backgroundColor: '#000',
  },
  pageInnerContainer: {
    boxShadow: '0px 2px 4px rgba(5, 27, 53, 0.1)',
    titleWeight: 700,
    bgColor: '#222222',
  },
  login: {
    bgImgTop: '/assets/images/container-bg-img.png',
    linkDecoration: 'none',
    linkColor: '#FFDC3E',
    linkFontSize: 16,
    buttonFullWidth: true,
    titleColor: '#FFDC3E',
  },
  registration: {
    width: 520,
    left: '0',
    borderRadius: 4,
    boxShadow: '0px 4px 4px rgba(5, 27, 53, 0.1)',
    bgImg: '/assets/images/container-bg-img.png',
    titleWeight: 700,
    titleColor: '#FFDC3E',
    blockTitleWeight: 700,
    blockTitleTransform: 'uppercase',
    blockTitleBorder: '1px solid #444',
    blockTitleColor: '#999999',
    blockTitleFontSize: 12,
    blockTitlePaddingBottom: 8,
    bgColor: '#222',
    blockBgColor: '#555555',
  },
  inputs: {
    border: '1px solid #4A4A4A',
    borderRadius: 4,
    padding: '10px 30px 10px 13px',
    fontSize: 16,
    height: 48,
    backgroundColor: '#222',
    color: '#fff',
    labelLeft: 20,
    labelTop: 15,
    labelActiveFontSize: 12,
    labelActiveTop: -8,
    labelActiveLeft: 10,
    labelBackgroundColor: '#222',
    labelPadding: 4,
    marginBottom: 18,
    selectPadding: '10px 13px',
    iconColor: '#555555',
    disabled: {
      border: '1px solid #4A4A4A',
      backgroundColor: '#222',
      color: '#666',
    },
    invalid: {
      backgroundColor: '#222',
    },
    active: {
      borderColor: '#FFDC3E',
    },
    dropdownBg: '#444',
  },
  customFileInput: {
    backgroundColor: '#555555',
    labelColor: '#fff',
    buttonFontColor: '#FFF',
    buttonFontWeight: 700,
    buttonFontSize: '15px',
    buttonColor: '#444444',
    border: 'none',
  },
  toggleCheck: {
    slider: {
      width: '18px',
      height: '18px',
      left: '2px',
      checkedLeft: '55%',
      boxShadow: 'none',
      color: '#FFDC3E',
      checkedColor: '#222222',
    },
    height: '24px',
    minWidth: '48px',
    backgroundColor: '#222',
    checkedBgColor: '#FFDC3E',
    border: '1px solid #FFDC3E',
  },
  helpBlock: {
    titleWeight: 700,
    titleColor: '#999999',
    padding: '0',
    color: '#888888',
    blockTitleWeight: 700,
    blockTitleColor: '#fff',
    iconSize: 24,
    iconColor: '#fff',
    iconBgColor: '#222222',
    bgColor: 'transparent',
  },
  userMenu: {
    boxShadow: '0px 4px 4px rgba(5, 27, 53, 0.1)',
    borderRadius: 4,
    itemBorder: '1px solid #000',
    itemWeight: 700,
    itemTransform: 'uppercase',
    itemFontSize: 14,
    itemHeight: 48,
    width: 330,
    backgroundColor: '#222',
    subItemBgColor: '#222',
    itemIconColor: '#888',
  },
  settingsMenu: {
    fontSize: 14,
    color: '#fff',
    borderRadius: 4,
    bgColor: '#222222',
    activeBgColor: '#222222',
    fontWeight: 700,
    fontTransform: 'uppercase',
    subBackgroundColor: '#222222',
    iconColor: '#888888',
    iconSize: 24,
    bottomBorderColor: '#000',
  },
  inputContainer: {
    backgroundColor: '#222222',
    borderRadius: 4,
    padding: 25,
    fullWidthButton: true,
    iconButton: false,
    customInput: true,
    inputHeight: 68,
    inputBgColor: '#555',
    inputFontSize: 24,
    inputFontWeight: 700,
    inputAlign: 'center',
    inputColor: '#fff',
    quickBorderRadius: 4,
    quickPadding: '10px 0',
    quickColor: '#fff',
    quickFontWeight: 700,
    quickBorder: 'none',
    quickBg: '#444444',
    quickBorderColor: '#FFDC3E',
  },
  paymentMethods: {
    inRow: 5,
    padding: '25px 20%',
    mobilePadding: '20px 10px',
    textAlign: 'left',
    border: '1px solid #E6ECF1',
    borderRadius: 4,
    activeOutline: '0px 0px 0px 4px #FFDC3E',
  },
  settingsPage: {
    titleFontWeight: 700,
    titleMargin: '0 0 15px 0',
    subTextMargin: '0 0 16px 0',
    minHeight: 'calc(100vh - 556px)',
    marginTop: -20,
    containerMaxWidth: 1150,
  },
  dateFilter: {
    padding: '0',
    margin: '0',
    periodBgColor: '#444444',
    periodColor: '#fff',
    periodActiveColor: '#000',
    periodBorderRadius: 4,
    borderColor: 'none',
    dateInputBg: '#444444',
    dateInputColor: '#fff',
    dateInputBorder: '1px solid #444',
  },
  table: {
    headerFontSize: 12,
    headerColor: '#999999',
    itemColor: '#fff',
    itemFontSize: 14,
    itemBorder: '1px solid #444',
  },
  questionsContainer: {
    borderRadius: 4,
    bgColor: '#222222',
    titleFontWeight: 700,
    itemBorder: '1px solid #E6ECF1',
  },
  infoContainer: {
    bgColor: '#222',
    textBgColor: '#222',
    color: '#fff',
    boldColor: '#999',
    borderRadius: 4,
    borderTop: '1px solid rgba(119, 140, 166, 0.15)',
    titleMargin: '0',
    limitNumberColor: '#fff',
    limitNumberFontSize: 18,
    limitNumberFontWeight: 700,
    limitInfoColor: '#999999',
    limitInfoTitleWeight: 700,
    limitInfoTitleTransform: 'uppercase',
    limitInfoBorder: '1px solid rgba(119, 140, 166, 0.15)',
    activeHeaderColor: '#444',
    activeHeaderButtonBgColor: '#888',
  },
  outerInfoBlock: {
    bgColor: '#222',
  },
  balancesList: {
    titleColor: '#fff',
  },
  alert: {
    color: '#fff',
    padding: '16px 16px',
    iconColor: '#FFF',
    fontSize: 14,
    fontWeight: 700,
    iconSize: 16,
    iconBgSize: 20,
    margin: '15px 0 !important',
    invertedIconBg: true,
    transparentBg: false,
  },
  promotions: {
    cardPadding: '24px',
    containerBgColor: '#222',
    containerTitleColor: '#FFDC3E',
    containerColor: '#fff',
  },
  modals: {
    color: '#fff',
    bgColor: '#222',
    borderColor: '#333',
    title: {
      fontWeight: 700,
      fontSize: '24px',
    },
  },
  genericModalWidth: '520px',
  backdrop: {
    bgColor: 'rgba(0, 0, 0, 0.8)',
  },
};

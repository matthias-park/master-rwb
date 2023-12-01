const pallete = {
  blue: '#596E95',
  black: '#000000',
  navy: '#1B2C5B',
  red: '#D7182A',
  burgundy: '#A92331',
  offWhite: '#EFF1F5',
  white: '#FFF',
  gray: '#CCD2DE',
  offGray: '#E6E9EF',
  darkGray: '#7f7f7f',
  green: '#14895F',
};

module.exports = {
  buttons: {
    borderRadius: 24,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#000000',
    transform: 'uppercase',
    primary: {
      color: pallete.white,
      bgColor: pallete.red,
      hover: {
        bgColor: pallete.red,
        borderColor: pallete.red,
      },
      active: {
        bgColor: pallete.burgundy,
        borderColor: pallete.burgundy,
        color: pallete.white,
      },
    },
    secondary: {
      bgColor: pallete.gray,
      color: pallete.black,
      active: {
        bgColor: pallete.darkGray,
        borderColor: pallete.darkGray,
        color: pallete.white,
      },
    },
    outlineLight: {
      focus: {
        color: pallete.black,
      },
    },
    paddingY: 10,
    maxHeight: 40,
    primaryBgColor: pallete.red,
    primaryBgHoverColor: pallete.red,
    primaryColor: pallete.white,
    secondaryBgColor: pallete.gray,
    secondaryBgHoverColor: pallete.gray,
    secondaryColor: pallete.darkGray,
  },
  inputs: {
    border: 'none',
    borderRadius: 8,
    padding: '10px 13px',
    fontSize: 16,
    height: 40,
    backgroundColor: pallete.offGray,
    color: pallete.darkGray,
    labelLeft: 20,
    labelTop: 10,
    labelActiveFontSize: 12,
    labelActiveTop: -8,
    labelActiveLeft: 10,
    labelBackgroundColor: pallete.white,
    labelPadding: 4,
    marginBottom: 8,
    selectPadding: '10px 13px',
    iconColor: '#555555',
    placeholderColor: pallete.darkGray,
    disabled: {
      backgroundColor: '#D1D5DB',
      color: '#9CA3AF',
    },
    invalid: {
      backgroundColor: pallete.offWhite,
    },
    active: {
      borderColor: 'none',
    },
    dropdownBg: '#EFF1F5',
    circleIcons: true,
  },
  login: {
    bgImgTop: '/assets/images/container-bg-img.png',
    linkDecoration: 'none',
    linkColor: pallete.red,
    linkFontSize: 16,
    buttonFullWidth: true,
    titleColor: '#D7182A',
    text: {
      color: pallete.darkGray,
    }
  },
  pageInnerContainer: {
    boxShadow: '0px 2px 4px rgba(5, 27, 53, 0.1)',
    titleWeight: 700,
    bgColor: pallete.white,
    color: '#000',
  },
  pageContainer: {
    backgroundColor: pallete.offWhite,
    smallMaxWidth: 480,
  },
  translationLink: {
    color: pallete.red,
  },
  registration: {
    width: 480,
    borderRadius: 8,
    boxShadow: '0px 4px 4px rgba(5, 27, 53, 0.1)',
    bgImg: '/assets/images/container-bg-img.png',
    titleWeight: 700,
    titleColor: pallete.black,
    blockTitleWeight: 700,
    blockTitleTransform: 'uppercase',
    blockTitleBorder: '1px solid #444',
    blockTitleColor: pallete.black,
    blockTitleFontSize: 12,
    blockTitlePaddingBottom: 8,
    bgColor: pallete.white,
    blockBgColor: '#555555',
    left: 0,
    carousel: {
      prevButton: {
        color: pallete.white,
      },
      indicators: {
        color: pallete.white,
      },
    },
  },
  colors: {
    primary: {
      main: pallete.red,
      light: pallete.green,
      hover: pallete.darkGray,
    },
    brand: {
      main: '#000',
      light: pallete.gray,
      text: pallete.black,
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
    footer: {
      bottomText: pallete.darkGray,
    },
    body: pallete.offWhite,
    lightSpacer: '#CCD2DE',
    container: '#fff',
  },
  boxShadow: {
    generic: 'none',
  },
  borderRadius: {
    sm: '4px',
  },
  spacing: {
    bodyPadding: 25,
    bodyPaddingMedium: 20,
    bodyPaddingSmall: 15,
    footerMainTopPadding: 1.5,
    footerMainBottomPadding: 0,
    footerPrePadding: 0,
    settingsBodyPadding: '30px 15px',
    settingsMarginTop: 0,
  },
  fonts: {
    family: 'Roboto',
    weight: {
      bold: 600,
    },
    size: {
      lg: '18px',
      md: '16',
    },
  },
  header: {
    logo: {
      left: '100px',
      width: '160px',
      mobile: {
        width: '130px'
      }
    },
    responsibleGamingLogo: {
      left: '170px',
    },
    borderBottom: 'none',
    boxShadow: '2px 4px 8px rgb(0 0 0 / 10%)',
    bgColor: pallete.white,
    topOffset: 1,
    marginBottom: 25,
    navHeightMobile: 0,
    height: 'unset',
    padding: '55px 25px 25px 25px',
    links: {
      fontStyle: 'italic',
      color: pallete.black,
      active: {
        borderBottomColor: pallete.red,
      },
    },
    breakpoints: {
      xl: {
        padding: '55px 20px 25px 20px',
      },
      lg: {
        padding: '55px 15px 25px 15px',
      },
      xs: {
        height: 'unset',
        padding: '55px 15px 15px 15px',
      },
    },
  },
  footer: {
    links: {
      icon: {
        color: pallete.grey,
      },
    },
    color: pallete.darkGray,
    bgColor: pallete.offWhite,
    listColor: pallete.black,
    listTitleWeight: 700,
    timer: {
      color: pallete.darkGray,
    },
    timerBgColor: '#213956',
    subFooterHeight: 60,
    clockIconSize: 18,
    clockIconMargin: '0 6px',
  },
  communicationPrefs: {
    bgColor: '#fff',
    color: pallete.black,
    items: {
      backgroundColor: '#fff',
      border: '1px solid #E5E7EB',
    },
    title: {
      color: pallete.darkGray,
    },
  },
  customFileInput: {
    backgroundColor: '#EFF1F5',
    labelColor: pallete.black,
    buttonFontColor: pallete.black,
    buttonFontWeight: 700,
    buttonFontSize: '15px',
    buttonColor: '#EFF1F5',
    border: 'none',
  },
  checkBoxes: {
    color: pallete.red,
  },
  toggleCheck: {
    slider: {
      width: '18px',
      height: '18px',
      left: '2px',
      checkedLeft: '55%',
      boxShadow: 'none',
      color: '#CBCBCB',
      checkedColor: '#fff',
    },
    height: '24px',
    minWidth: '48px',
    backgroundColor: '#fff',
    checkedBgColor: '#D7182A',
    border: '2px solid #CBCBCB',
    checkedBorderColor: '#D7182A',
  },
  helpBlock: {
    titleWeight: 700,
    titleColor: '#999999',
    padding: '0',
    color: '#888888',
    blockTitleWeight: 700,
    blockTitleColor: pallete.black,
    iconSize: 24,
    iconColor: '#fff',
    iconBgColor: '#fff',
    bgColor: 'transparent',
  },
  userMenu: {
    boxShadow: '0px 4px 4px rgba(5, 27, 53, 0.1)',
    borderRadius: 4,
    itemBorder: '1px solid #E5E7EB',
    itemWeight: 700,
    itemTransform: 'uppercase',
    itemFontSize: 14,
    itemHeight: 48,
    width: 330,
    backgroundColor: '#fff',
    subItemBgColor: '#fff',
    itemIconColor: pallete.darkGray,
    loginColor: pallete.gray,
    infoBackgroundColor: pallete.black,
  },
  settingsMenu: {
    fontSize: 14,
    color: pallete.black,
    borderRadius: 4,
    bgColor: '#fff',
    activeBgColor: '#fff',
    fontWeight: 700,
    fontTransform: 'uppercase',
    subBackgroundColor: '#fff',
    iconColor: pallete.darkGray,
    iconSize: 18,
    bottomBorderColor: '#E5E7EB',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 25,
    fullWidthButton: true,
    iconButton: false,
    customInput: true,
    inputHeight: 68,
    inputBgColor: '#E5E7EB',
    inputFontSize: 24,
    inputFontWeight: 700,
    inputAlign: 'center',
    inputColor: pallete.black,
    quickBorderRadius: 4,
    quickPadding: '10px 0',
    quickColor: pallete.black,
    quickFontWeight: 700,
    quickBorder: 'none',
    quickBg: '#E5E7EB',
    quickMobileBg: 'transparent',
  },
  paymentMethods: {
    inRow: 4,
    padding: '25px 40px',
    textAlign: 'left',
    border: '1px solid #E6ECF1',
    borderRadius: 4,
    activeOutline: '0px 0px 0px 4px #D7182A',
  },
  settingsPage: {
    titleFontWeight: 700,
    titleMargin: '8px 0 15px 0',
    subTextMargin: '0 0 16px 0',
    marginTop: -10,
  },
  dateFilter: {
    padding: '0',
    margin: '0',
    periodBgColor: pallete.gray,
    periodColor: pallete.black,
    periodActiveColor: pallete.white,
    periodBorderRadius: 76,
    borderColor: 'none',
    dateInputBg: pallete.offWhite,
    dateInputColor: pallete.darkGray,
    dateInputBorder: `1px solid ${pallete.offWhite}`,
  },
  table: {
    headerFontSize: 12,
    headerColor: '#999999',
    itemColor: pallete.black,
    itemFontSize: 14,
    itemBorder: '1px solid #E5E7EB',
  },
  questionsContainer: {
    borderRadius: 4,
    bgColor: '#fff',
    titleFontWeight: 700,
    itemBorder: '1px solid #E6ECF1',
  },
  infoContainer: {
    bgColor: '#fff',
    textBgColor: '#fff',
    color: pallete.black,
    boldColor: '#999',
    borderRadius: 4,
    borderTop: '1px solid rgba(119, 140, 166, 0.15)',
    titleMargin: '0',
    limitNumberColor: pallete.black,
    limitNumberFontSize: 18,
    limitNumberFontWeight: 700,
    limitInfoColor: '#999999',
    limitInfoTitleWeight: 700,
    limitInfoTitleTransform: 'uppercase',
    limitInfoBorder: '1px solid rgba(119, 140, 166, 0.15)',
    activeHeaderColor: '#fff',
    activeHeaderButtonBgColor: '#888',
  },
  outerInfoBlock: {
    bgColor: '#fff',
  },
  balancesList: {
    titleColor: pallete.black,
  },
  transactionsOverview: {
    titleColor: pallete.black,
  },
  alert: {
    color: pallete.black,
    padding: '16px 16px',
    iconColor: pallete.black,
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
    containerBgColor: '#fff',
    containerTitleColor: '#D7182A',
    containerColor: '#fff',
  },
  modals: {
    color: pallete.black,
    bgColor: '#fff',
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
  spinnerVariant: '#fff',
  bonuses: {
    containerBgColor: '#fff',
    subTextColor: '#888888',
    boxShadow: '0px 0px 4px rgb(255 255 255 / 12%)',
    barColor: '#D7182A',
    barBgColor: '#444',
    editHoverBgColor: '#444',
    labelBgColor: '#444',
  },
  documents: {
    exampleTextColor: pallete.darkGray,
  },
  icons: {
    clock: 'icon-clock',
    check: 'icon-check',
    dateNavigation: 'icon-date-navigation',
    exclamation: 'icon-exclamation',
    danger: 'icon-danger',
    success: 'icon-check',
    lock: 'icon-lock',
    phone: 'icon-phone',
    phoneMobile: 'icon-phone-mobile',
    questions: 'icon-questions',
    redirect: 'icon-redirect',
    thumbs: 'icon-thumbs',
    tooltip: 'icon-tooltip',
    account: 'icon-account1',
    plus: 'icon-plus',
    card: 'icon-card',
    close: 'icon-close',
    down: 'icon-down1',
    left: 'icon-left1',
    right: 'icon-right1',
    up: 'icon-up1',
    download: 'icon-download',
    favorite: 'icon-favourite-on',
    lastBulletin: 'icon-last-bulletin',
    menu: 'icon-menu1',
    menuClose: 'icon-menu-close',
    reset: 'icon-reset',
    arrowLabel: 'icon-arrow-label',
    calendar: 'icon-calendar',
    delete: 'icon-delete',
    eyeOff: 'icon-eye-off',
    eyeOn: 'icon-eye-on',
    maximise: 'maximise',
    staistics: 'icon-statistics',
    stop: 'icon-stop',
    video: 'icon-video',
    mail: 'icon-mail',
    facebook: 'icon-facebook',
    instgram: 'icon-instagram',
    youtube: 'icon-youtube',
    twitter: 'icon-twitter',
    linkedIn: 'icon-linkedin',
    cookies: 'icon-cookies',
    deposit: 'icon-deposit',
    star: 'icon-star',
    logout: 'icon-logout',
    promo: 'icon-promo',
    bell: 'icon-bell',
    documents: 'icon-documents',
    responsible: 'icon-responsible',
    withdraw: 'icon-withdraw',
    balance: 'icon-balance',
    windowsLogo: 'icon-windows8',
    appleLogo: 'icon-appleinc',
    androidLogo: 'icon-andoid',
    sports: 'icon-sports',
    home: 'icon-home',
    inPlay: 'icon-in-play',
    jackpot: 'icon-jackpot',
    all: 'icon-all',
    liveDealer: 'icon-livedealer',
    tableGames: 'icon-table-games',
    slots: 'icon-slots',
    megaways: 'icon-megaways',
    new: 'icon-new',
    top: 'icon-top',
    featured: 'icon-featured',
    lobby: 'icon-lobby',
    casino: 'icon-casino',
    search: 'icon-search',
    fullScreen: 'icon-full-screen',
    filter: 'icon-filter',
    gameInfo: 'icon-game-info',
    recent: 'icon-recent',
    playableBalance: 'icon-balance',
    bonusBalance: 'icon-star',
    withdrawableBalance: 'icon-withdraw',
    lockedBalance: 'icon-lock',
  },
};

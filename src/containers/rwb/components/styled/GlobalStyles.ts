import { createGlobalStyle } from 'styled-components';
import accountSettingsStyles from './accountSettingsStyles';
import buttonStyles from './buttonStyles';
import customStyles from './customStyles';
import formStyles from './formStyles';
import languageSelectStyles from './languageSelectStyles';
import { loginStyles } from './loginStyles';
import { navStyles } from './navStyles';
import { promotionsStyles } from './promotionStyles';
import { registrationStyles } from './registrationStyles';
import { mediaBreakpointDown } from './breakpoints';

const GlobalStyles = createGlobalStyle`
  #KambiBC {
    position: relative !important;
    z-index: 2 !important;
    width: calc(100% + ${props =>
      props.theme.spacing.bodyPadding * 2}px) !important;
    right: ${props => props.theme.spacing.bodyPadding}px !important;
    ${mediaBreakpointDown('xl')} {
      width: calc(100% + ${props =>
        props.theme.spacing.bodyPaddingMedium * 2}px) !important;
      right: ${props => props.theme.spacing.bodyPaddingMedium}px !important;
    }
    ${mediaBreakpointDown('lg')} {
      width: calc(100% + ${props =>
        props.theme.spacing.bodyPaddingSmall * 2}px) !important;
      right: ${props => props.theme.spacing.bodyPaddingSmall}px !important;
    }
    &-container {
      overflow-y: hidden !important;
    }
  }
  // world pay deposit iframe styles
  #fCheckout {
    #eProtect-iframe {
      height: 25vh;
    }
    #submitId {
      background-color: ${props => props.theme.colors.primary.main};
      color: ${props => props.theme.colors.brand.text};
      border: none;
      border-radius: 16px;
      font-weight: 600;
      padding: 0.7rem 1rem;
    }
    table {
      width: 100%;
    }
  }
  .sb-hidden {
    #KambiBC {
      border: 0; 
      clip: rect(0 0 0 0);
      height: 1px;  
      margin: -1px;  
      overflow: hidden;  
      padding: 0;  
      position: absolute;  
      width: 1px;
      display: none;
    }
  }
  ${customStyles}
  ${buttonStyles}
  ${languageSelectStyles}
  ${loginStyles}
  ${navStyles}
  ${formStyles}
  ${promotionsStyles}
  ${registrationStyles}
  ${accountSettingsStyles}
`;
export default GlobalStyles;

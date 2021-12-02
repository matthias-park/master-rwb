import styled, { css } from 'styled-components';
import { mediaBreakpointDown } from './breakpoints';
import { fullBg } from './mixins';
import { makeCol, makeColOffset } from './grid';
import Dropdown from 'react-bootstrap/Dropdown';
import Link from '../../../../components/Link';

export const StyledFooterSub = styled.div`
  height: ${props => props.theme.footer.subFooterHeight}px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 0 ${props => props.theme.spacing.bodyPadding}px;
  background-color: ${props => props.theme.colors.brand.main};
  ${mediaBreakpointDown('xl')} {
    padding: 0 45px;
  }
  ${mediaBreakpointDown('lg')} {
    padding: 0 20px;
  }
  ${mediaBreakpointDown('md')} {
    height: auto;
  }
  ${mediaBreakpointDown('sm')} {
    border-top: 1px solid ${props => props.theme.colors.lightSpacer};
  }
  .footer-sub__title {
    color: ${props => props.theme.colors.white.light};
  }
  .footer-sub__nav {
    display: flex;
    margin-bottom: 0;
    padding-left: 0;
    color: ${props => props.theme.colors.white.main};

    ${mediaBreakpointDown('lg')} {
      img {
        height: 36px;
        width: auto;
      }
    }
    ${mediaBreakpointDown('xs')} {
      img {
        height: 30px;
        width: auto;
      }
    }
    ${mediaBreakpointDown('md')} {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      width: 100%;
      padding-bottom: 20px;
      &:last-of-type {
        border-top: 1px solid ${props => props.theme.colors.lightSpacer};
        padding-top: 10px;
      }
    }
    ${mediaBreakpointDown('sm')} {
      color: ${props => props.theme.colors.black.main};
      font-size: 12px;
    }
    &-link {
      cursor: pointer;
      a,
      span {
        color: ${props => props.theme.colors.footer.bottomText};
      }
      ${mediaBreakpointDown('lg')} {
        font-size: 12px;
      }
      ${mediaBreakpointDown('md')} {
        padding-top: 18px;
      }
    }
    &-link:not(:last-of-type) {
      margin-right: 30px;
      ${mediaBreakpointDown('lg')} {
        margin-right: 15px;
      }
      ${mediaBreakpointDown('md')} {
        margin-right: 0;
      }
    }
    &-img {
      display: flex;
      align-items: center;
      img {
        border-radius: 4px;
        &.white-corners {
          border: 3px solid ${props => props.theme.colors.white.main};
        }
      }
    }
    li {
      list-style-type: none;
    }
  }
`;

export const StyledFooterRestrictionBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${mediaBreakpointDown('md')} {
    display: flex;
    flex-direction: column;
    > * {
      margin: 0.35rem 0;
    }
  }
  ${mediaBreakpointDown('sm')} {
    align-items: start;
  }
  .restrictions-block__text {
    display: inline-block;
    max-width: 300px;
    color: ${props => props.theme.colors.white.light};
  }
  .restrictions-block__img {
    margin-right: 10px;
  }
`;

export const StyledFooterSessionBlock = styled.div`
  display: flex;
  align-items: center;
  min-width: 255px;
  ${mediaBreakpointDown('lg')} {
    margin: auto;
  }
  ${mediaBreakpointDown('sm')} {
    margin-left: 0;
  }
  i {
    font-size: ${props => props.theme.footer.clockIconSize}px;
    margin: ${props => props.theme.footer.clockIconMargin};
    color: ${props => props.theme.colors.white.light};
  }
  .session-block__text {
    color: rgba(255, 255, 255, 0.45);
  }
  .session-block__time {
    color: ${props => props.theme.colors.white.light};
    background-color: ${props => props.theme.footer.timerBgColor};
    padding: 5px;
    border-radius: 4px;
    font-weight: 500;
  }
`;

export const StyledFooterInfoText = styled.div`
  font-size: 12px;
  line-height: 21px;
  color: ${props => props.theme.colors.white.main};
  opacity: 0.75;
`;

export const StyledSocialSection = styled.div`
  padding: 0 10px 10px 10px;
  padding-left: 20px;
  border-left: 1px solid ${props => props.theme.colors.lightSpacer};
  color: ${props => props.theme.colors.white.light};
  ${mediaBreakpointDown('md')} {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-left: 0;
  }
  .social__head-title {
    margin-bottom: 18px;
    color: ${props => props.theme.colors.white.main};
  }

  .social__title {
    font-weight: 500;
    margin-bottom: 12px;
  }
  .social__icons {
    &-link {
      display: ${props => !!props.theme.footer.iconsBg && 'inline-block'};
      font-size: 26px;
      color: ${props => props.theme.colors.white.main};
      background-color: ${props => props.theme.footer.iconsBg};
      padding: ${props => !!props.theme.footer.iconsBg && '10px 10px 5px 10px'};
      cursor: pointer;
      &:not(:last-of-type) {
        margin-right: 15px;
        ${mediaBreakpointDown('lg')} {
          margin-right: 10px;
        }
      }
      &:hover {
        color: ${props => props.theme.colors.white.light};
        text-decoration: none;
      }
      ${mediaBreakpointDown('lg')} {
        font-size: 23px;
      }
    }
  }
`;

const SectionItemLink = css`
  display: block;
  line-height: 25px;
  margin-bottom: 0;
  color: ${props => props.theme.colors.white.light};
  margin-bottom: 5px;
  &:hover {
    color: ${props => props.theme.colors.white.main};
  }
  ${mediaBreakpointDown('sm')} {
    height: 48px;
    line-height: 48px;
    margin-bottom: 0;
    &:not(:last-of-type) {
      border-bottom: 1px solid ${props => props.theme.colors.lightSpacer};
    }
  }
`;

export const StyledSectionItemExternalLink = styled.a`
  ${SectionItemLink}
`;
export const StyledSectionItemLink = styled(Link)`
  ${SectionItemLink}
`;

export const StyledSectionItemTitle = styled.h3`
  margin-bottom: 12px;
  font-weight: ${props => props.theme.footer.listTitleWeight};
  a {
    color: ${props => props.theme.footer.listColor};
    font-weight: ${props => props.theme.footer.listTitleWeight};
  }
  ${mediaBreakpointDown('sm')} {
    position: relative;
    padding: 0 20px;
    display: flex;
    align-items: center;
    height: 64px;
    margin-bottom: 0;
    border-bottom: 1px solid ${props => props.theme.colors.lightSpacer};
    font-weight: 400;
    &[aria-expanded='true'] {
      &:after {
        transform: rotate(180deg);
      }
    }
  }
`;

export const StyledFooterPreTitle = styled.h3`
  white-space: nowrap;
  margin-left: auto;
  margin-bottom: 0;
  margin-right: 20px;
  ${mediaBreakpointDown('lg')} {
    margin: auto;
  }
  ${mediaBreakpointDown('sm')} {
    margin-left: 0;
  }
`;

const SectionItem = css`
  margin-bottom: 24px;
  color: ${props => props.theme.footer.listColor};
  .dropdown-menu {
    position: static !important;
    transform: none !important;
    width: 100%;
    box-shadow: none;
    display: block;
    padding: 0;
    background-color: transparent;
    ${mediaBreakpointDown('sm')} {
      display: none;
      background-color: ${props => props.theme.colors.brand.main};
      border-radius: 0;
      margin-top: 0;
      padding: 0 20px;
      opacity: 0;
      transition: opacity 0.6s;
      &.show {
        display: block;
        opacity: 1;
      }
    }
  }
  ${mediaBreakpointDown('sm')} {
    width: calc(100% + 40px);
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0;
  }
`;
export const StyledSectionItem = styled.div`
  ${SectionItem}
`;
export const StyledSectionItemDropdown = styled(Dropdown)`
  ${SectionItem}
`;

export const StyledFooter = styled.footer`
  position: relative;
  ${props => fullBg(props.theme.colors.brand.light)}
  ${mediaBreakpointDown('lg')} {
    &:before {
      z-index: 0;
    }
    .footer-main {
      position: relative;
      z-index: 1;
    }
  }
  .footer-pre {
    position: relative;
    display: flex;
    align-items: center;
    ${mediaBreakpointDown('lg')} {
      flex-direction: column;
    }
    ${mediaBreakpointDown('sm')} {
      align-items: start;
      margin-left: -15px;
      margin-right: -15px;
    }
    ${mediaBreakpointDown('lg')} {
      > * {
        padding-bottom: 1rem;
      }
    }
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% + ${props => props.theme.spacing.bodyPadding}px);
      border-bottom: 1px solid ${props => props.theme.colors.lightSpacer};
      ${mediaBreakpointDown('xl')} {
        width: calc(100% + ${props => props.theme.spacing.bodyPaddingMedium}px);
      }
      ${mediaBreakpointDown('lg')} {
        width: calc(100% + ${props => props.theme.spacing.bodyPaddingSmall}px);
      }
      ${mediaBreakpointDown('sm')} {
        content: none;
      }
    }
  }
  .footer-main {
    padding-top: ${props =>
      props.theme.spacing.footerMainTopPadding}rem !important;
    padding-bottom: ${props =>
      props.theme.spacing.footerMainBottomPadding}rem !important;
    margin-right: -${props => (props.theme.spacing.footerPrePadding ? 0 : 15)}px !important;
    margin-left: -${props => (props.theme.spacing.footerPrePadding ? 0 : 15)}px !important;
    ${mediaBreakpointDown('sm')} {
      padding-top: 0 !important;
    }
    .footer-links-block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex-basis: auto;
      flex-grow: 1;
      ${mediaBreakpointDown('xl')} {
        ${makeCol(3)}
      }
      ${mediaBreakpointDown('md')} {
        ${makeCol(4)}
      }
      ${mediaBreakpointDown('sm')} {
        ${makeCol(12)}
      }
      .disable-dropdown-arrow:after {
        color: ${props => props.theme.colors.brand.main};
      }
    }
    .footer-social-block {
      ${makeCol(5)}
      display: flex;
      height: 90%;
      ${mediaBreakpointDown('xxlg')} {
        ${makeCol(5)}
      }
      ${mediaBreakpointDown('xl')} {
        ${makeCol(3)}
      }
      ${mediaBreakpointDown('md')} {
        ${makeCol(12)}
        display: flex;
        justify-content: center;
        position: relative;
        &:after {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% + 40px);
          border-top: 1px solid ${props => props.theme.colors.lightSpacer};
        }
      }
      ${mediaBreakpointDown('md')} {
        &:after {
          content: none;
        }
      }
      ${StyledSocialSection} {
        ${makeCol(6)}
        ${mediaBreakpointDown('xl')} {
          ${makeCol(12)}
        }
      }
    }
    ${StyledFooterInfoText} {
      ${makeCol(6)}
      ${mediaBreakpointDown('md')} {
        text-align: center;
        margin: auto;
        ${makeCol(5)}
      }
      ${mediaBreakpointDown('xs')} {
        ${makeCol(10)}
      }
    }
    .footer-offset-block {
      ${makeColOffset(2)}
      ${mediaBreakpointDown('xxlg')} {
        ${makeColOffset(0)}
      }
    }
  }
  ${StyledFooterSub} {
    position: relative;
    width: calc(100% + ${props => props.theme.spacing.bodyPadding * 2 + 30}px);
    left: 50%;
    transform: translateX(-50%);
    &.with-bottom-nav {
      padding-bottom: 120px;
      padding-top: 10px;
      ${mediaBreakpointDown('lg')} {
        padding-bottom: 108px;
        padding-top: 15px;
      }
      ${mediaBreakpointDown('md')} {
        padding-bottom: 50px;
        padding-top: 0;
      }
      ${mediaBreakpointDown('xs')} {
        padding-bottom: 100px;
      }
    }
    ${mediaBreakpointDown('xl')} {
      width: calc(
        100% + ${props => props.theme.spacing.bodyPaddingMedium * 2 + 30}px
      );
    }
    ${mediaBreakpointDown('lg')} {
      width: calc(
        100% + ${props => props.theme.spacing.bodyPaddingSmall * 2 + 30}px
      );
    }
  }
`;

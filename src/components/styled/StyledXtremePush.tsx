import Dropdown from 'react-bootstrap/Dropdown';
import styled from 'styled-components';
import { mediaBreakpointDown } from '../../containers/strive/components/styled/breakpoints';

export const BadgeCircle = styled.span`
  position: absolute;
  display: block;
  top: -10px;
  right: 0;
  position: absolute;
  transform: translateX(8px);
  background-color: hsl(10deg 100% 60%);
  font-size: 12px;
  line-height: 0;
  font-weight: 500;
  color: #fff;
  padding: 0.8em 0.5em;
  border-radius: 100vh;
  background: ${props => props.theme.colors.primary.main};
`;
export const OpenCircle = styled(BadgeCircle)`
  cursor: pointer;
  top: 5px;
  right: 20px;
  padding: 0.5em;
`;

export const StyledInboxHeader = styled.div`
  font-weight: 600;
  padding: 10px 0;
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
`;
export const StyledMessageContent = styled.div`
  padding: 0 5px;
  text-align: start;
  .date-sent {
    font-size: 12px;
    color: #a19f9f;
  }
`;
export const StyledMessageContainer = styled.div`
  padding: 0 5px;
  display: flex;
  flex-direction: row;
`;
export const StyledInboxMessage = styled.li`
  position: relative;
  padding: 10px 0;
  margin-top: 10px;
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  }
`;
export const StyledMessageList = styled.ul`
  margin-top: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  .title {
    font-weight: 500;
  }
`;

export const StyledContainer = styled(Dropdown)`
  margin-top: auto;
  margin-bottom: auto;
  .dropdown-menu {
    width: 350px;
    left: calc(100% - 125px) !important;
    transform: translateX(-50%) !important;
    top: calc(100% + 15px) !important;
    padding: 0;
    background-color: ${props => props.theme.modals.bgColor};
    color: ${props => props.theme.modals.color};
    text-align: center;
    padding-bottom: 0;
    z-index: 1100;
    border-radius: 4px;
    box-shadow: 0px 2px 4px rgba(5, 27, 53, 0.1);
    ${mediaBreakpointDown('lg')} {
      transform: translateX(-5%);
      width: 330px;
      div {
        max-height: calc(100vh - 180px);
        overflow-y: auto;
      }
    }
    div {
      border-color: ${props => props.theme.modals.borderColor};
    }
    &:after {
      content: '';
      position: absolute;
      top: -7px;
      right: 15.5%;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid ${props => props.theme.modals.bgColor};
      color: ${props => props.theme.modals.color};
      border-radius: 2px;
      ${mediaBreakpointDown('lg')} {
        right: 13.5%;
      }
    }
  }
`;

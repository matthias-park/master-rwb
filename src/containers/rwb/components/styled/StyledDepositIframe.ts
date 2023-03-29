import styled from 'styled-components';

const StyledIframe = styled.iframe`
  width: 100%;
  height: ${props => props.theme.depositIframe.height || 75}vh;
  border: none;
`;

export default StyledIframe;

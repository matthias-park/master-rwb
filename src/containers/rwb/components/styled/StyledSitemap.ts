import styled from 'styled-components';

export const StyledSitemapItemToggle = styled.i`
  position: absolute;
  left: -10px;
  top: -12px;
  font-size: 40px;
  color: ${props => props.theme.colors.brand.light};
  cursor: pointer;
  &.active {
    color: ${props => props.theme.colors.primary.hover};
  }
`;

export const StyledSitemapItemTitle = styled.div`
  a:hover,
  a:focus,
  a:active {
    text-decoration: underline;
  }
`;

export const StyledSitemapItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-left: 26px;
  margin-top: 20px;
  .sitemap-accordion__item-body {
    flex-basis: 100%;
  }
`;

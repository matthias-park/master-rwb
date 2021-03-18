import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Link: typeof RouterLink = props => (
  <RouterLink
    {...props}
    onClick={e => {
      if (window._wbUpdate) window.location.pathname = props.to.toString();
      if (props.onClick) props.onClick(e);
    }}
  />
);

export default Link;

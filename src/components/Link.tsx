import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Link: typeof RouterLink = React.forwardRef((props, ref) => {
  return props.to.toString().includes('https://') ? (
    <a
      href={props.to.toString()}
      ref={ref}
      {...props}
      onClick={e => props.onClick?.(e)}
    >
      {props.children}
    </a>
  ) : (
    <RouterLink
      {...props}
      ref={ref}
      onClick={e => {
        if (window._wbUpdate) window.location.pathname = props.to.toString();
        if (props.onClick) props.onClick(e);
      }}
    />
  );
});

export default Link;

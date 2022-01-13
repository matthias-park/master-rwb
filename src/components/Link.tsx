import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Config } from '../constants';

const Link: typeof RouterLink = React.forwardRef((props, ref) => {
  if (typeof props.to !== 'string') return null;
  if (props.to.includes('https://') || Config.singleLoadPage) {
    return (
      <a
        href={props.to.toString()}
        ref={ref}
        {...props}
        onClick={e => props.onClick?.(e)}
      >
        {props.children}
      </a>
    );
  }
  return (
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

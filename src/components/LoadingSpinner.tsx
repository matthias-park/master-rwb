import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { isIOS } from 'react-device-detect';

interface Props {
  show?: boolean;
  className?: string;
  wrapperClassName?: string;
  small?: boolean;
  variant?: string;
}

const LoadingSpinner = ({
  show,
  className,
  small,
  variant,
  wrapperClassName,
}: Props) => {
  return (
    <span className={wrapperClassName}>
      {show && (
        <Spinner
          as="span"
          animation="border"
          size={small ? 'sm' : undefined}
          role="status"
          className={className + `${isIOS ? ' ios' : ''}`}
          variant={variant}
        />
      )}
    </span>
  );
};

export default LoadingSpinner;

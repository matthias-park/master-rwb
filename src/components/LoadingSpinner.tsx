import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

interface Props {
  show?: boolean;
  className?: string;
  small?: boolean;
}

const LoadingSpinner = ({ show, className, small }: Props) => {
  return (
    <span>
      {show && (
        <Spinner
          as="span"
          animation="border"
          size={small ? 'sm' : undefined}
          role="status"
          className={className}
        />
      )}
    </span>
  );
};

export default LoadingSpinner;

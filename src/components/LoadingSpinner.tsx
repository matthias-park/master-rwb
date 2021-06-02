import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

interface Props {
  show?: boolean;
  className?: string;
}

const LoadingSpinner = ({ show, className }: Props) => {
  return (
    <span>
      {show && (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          className={className}
        />
      )}
    </span>
  );
};

export default LoadingSpinner;

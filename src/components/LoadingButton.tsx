import React from 'react';
import Button, { ButtonProps } from 'react-bootstrap/Button';
import LoadingSpinner from './LoadingSpinner';

type Props = {
  loading?: boolean;
} & ButtonProps;

const LoadingButton = (props: Props) => {
  return (
    <Button {...props} disabled={props.disabled || props.loading}>
      <div className="d-flex align-items-center justify-content-center">
        <LoadingSpinner
          wrapperClassName="d-inline-flex"
          show={props.loading}
          small
          className="mr-1"
        />
        {props.children}
      </div>
    </Button>
  );
};
export default LoadingButton;

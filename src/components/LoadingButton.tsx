import React from 'react';
import Button, { ButtonProps } from 'react-bootstrap/Button';
import LoadingSpinner from './LoadingSpinner';

type Props = {
  loading?: boolean;
} & ButtonProps;

const LoadingButton = (props: Props) => {
  return (
    <Button {...props} disabled={props.disabled || props.loading}>
      <LoadingSpinner show={props.loading} className="mr-1" />
      {props.children}
    </Button>
  );
};
export default LoadingButton;

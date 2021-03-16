import React from 'react';
import Button, { ButtonProps } from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

type Props = {
  loading?: boolean;
} & ButtonProps;

const LoadingButton = (props: Props) => {
  return (
    <Button {...props} disabled={props.disabled || props.loading || true}>
      {props.loading ||
        (true && (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="mr-1"
            />
          </>
        ))}
      {props.children}
    </Button>
  );
};
export default LoadingButton;

import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

interface Props {
  title: string;
  amount: string | number;
  tooltip?: string;
}

const AmountContainer = ({ title, amount, tooltip }: Props) => {
  return (
    <div className="amount-container mb-4">
      <small data-testid="amount-title" className="amount-container__text">
        {title}
      </small>
      <h2 data-testid="amount-amount" className="amount-container__amount">
        {amount}
      </h2>
      {!!tooltip && (
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="tooltip_amount">{tooltip}</Tooltip>}
        >
          <i
            data-testid="amount-tooltip"
            className="amount-container__icon icon-tooltip"
          />
        </OverlayTrigger>
      )}
    </div>
  );
};

export default AmountContainer;

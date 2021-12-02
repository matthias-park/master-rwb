import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { BankAccount } from '../../../../types/api/user/Withdrawal';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

interface PaymentMethodObj {
  id: string;
  value: string;
  icon?: string;
  title: string;
  toSelect?: BankAccount;
  onChange?: () => void;
}

interface PaymentMethodsProps {
  acc?: PaymentMethodObj;
  data?: PaymentMethodObj[];
  selected?: string | number | undefined;
  registerName?: string;
  register?: (name: any, options: any) => void;
  registerOptions?: any;
}

const PaymentMethod = ({
  acc,
  selected,
  registerName,
  registerOptions,
  register,
}: PaymentMethodsProps) => {
  const titleRef = useRef<HTMLSpanElement>(null);
  const paymentContainer = useRef<HTMLLabelElement>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const checkOverflow = () => {
    if (titleRef?.current) {
      const width = titleRef.current.offsetWidth;
      const scrollWidth = titleRef.current.scrollWidth;
      acc && scrollWidth > width && setShowTooltip(acc.id);
    }
  };

  return (
    <li key={acc?.id}>
      <input
        {...(register && register(registerName || '', registerOptions))}
        className="d-none"
        type="radio"
        name="payment_method_id"
        id={acc?.id}
        value={acc?.value}
        checked={acc?.id === selected}
        onChange={() => acc?.onChange && acc?.onChange()}
      />
      <label
        ref={paymentContainer}
        htmlFor={acc?.id}
        className={clsx('payment-method', acc?.id === selected && 'selected')}
        onMouseOver={e => checkOverflow()}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <img alt="" src={acc?.icon} className="payment-method__img" />
        <span ref={titleRef} className="payment-method__title">
          {acc?.title}
        </span>
        <Overlay
          placement="bottom"
          target={titleRef.current}
          show={!!showTooltip && showTooltip === acc?.id}
        >
          {({ placement, arrowProps, show: _show, popper, ...props }) => (
            <Tooltip
              {...props}
              id={`tooltip-${acc?.id}`}
              className="tooltip--no-arrow"
            >
              {acc?.title}
            </Tooltip>
          )}
        </Overlay>
      </label>
    </li>
  );
};

const PaymentMethods = ({
  data,
  selected,
  registerName,
  registerOptions,
  register,
}: PaymentMethodsProps) => {
  return (
    <ul className="payment-methods">
      {data?.map(acc => {
        return (
          <PaymentMethod
            key={acc.id}
            acc={acc}
            selected={selected}
            registerName={registerName}
            registerOptions={registerOptions}
            register={register}
          />
        );
      })}
    </ul>
  );
};

export default PaymentMethods;

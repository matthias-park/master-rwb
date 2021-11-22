import React, { useRef } from 'react';
import clsx from 'clsx';
import { BankAccount } from '../../../../types/api/user/Withdrawal';

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
  const paymentContainer = useRef<HTMLLabelElement>(null);

  return (
    <li
      key={acc?.id}
      className={clsx(
        'payments-select__item',
        acc?.id === selected && 'selected',
      )}
    >
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
      <label ref={paymentContainer} className="w-100" htmlFor={acc?.id}>
        <span className="payments-select__item-card">
          <img src={acc?.icon} />
        </span>
        <div className="payments-select__item-info">
          {acc?.title && (
            <div className="payments-select__item-info-line mb-1">
              <span className="ellipsis-overflow">{acc?.title}</span>
            </div>
          )}
          <div className="payments-select__item-info-line">
            Min <span className="ml-auto">10,00 €</span>
          </div>
          <div className="payments-select__item-info-line">
            Max <span className="ml-auto">5000,00 €</span>
          </div>
        </div>
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
    <ul className="payments-select">
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

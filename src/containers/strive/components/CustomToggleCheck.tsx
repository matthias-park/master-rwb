import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useI18n } from '../../../hooks/useI18n';
import { useFormContext } from 'react-hook-form';
import { Franchise } from '../../../constants';

const CustomToggleCheck = React.forwardRef(
  (
    props: {
      id: string;
      checked: boolean;
      name?: string;
      onChange?: (e: any) => void;
      onClick: (e: any) => void;
      className?: string;
      label?: string;
      errMsg?: string;
      rules?: {
        required: boolean;
      };
    },
    ref: any,
  ) => {
    const { t } = useI18n();
    const [isInvalid, setIsInvalid] = useState(false);
    const [toggleCount, setToggleCount] = useState(0);
    const formContext = useFormContext();

    useEffect(() => {
      const hasErrors =
        (formContext?.formState?.isSubmitted || !!toggleCount) &&
        !props.checked &&
        props?.rules?.required;
      if (hasErrors) {
        setIsInvalid(true);
      }
      props.checked && setIsInvalid(false);
    }, [formContext?.formState, props.checked]);

    return (
      <>
        <label
          className={clsx(
            'd-flex toggle-check-wrp',
            props.className,
            isInvalid && 'is-invalid',
          )}
        >
          <div
            className={clsx(
              'toggle-check',
              props.checked && 'toggle-check--checked',
              isInvalid && 'is-invalid',
            )}
          >
            <input
              type="checkbox"
              id={props.id}
              ref={ref}
              name={props.name}
              onChange={e => {
                setToggleCount(toggleCount + 1);
                !!props.onChange && props.onChange(e);
              }}
              onClick={props.onClick}
              readOnly
            ></input>
            <span className="toggle-check__slider"></span>
            {!(Franchise.desertDiamond || Franchise.gnogaz) && (
              <span className="toggle-check__checked">
                {t('custom_checkbox_checked')}
              </span>
            )}
            {!(Franchise.desertDiamond || Franchise.gnogaz) && (
              <span className="toggle-check__unchecked">
                {t('custom_checkbox_unchecked')}
              </span>
            )}
          </div>
          {props.label && <p className="toggle-check__label">{props.label}</p>}
        </label>
        {props.errMsg && isInvalid && (
          <p className="invalid-feedback toggle-check__errMsg">
            {props.errMsg}
          </p>
        )}
      </>
    );
  },
);

export default CustomToggleCheck;

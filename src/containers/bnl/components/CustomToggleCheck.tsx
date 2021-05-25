import React from 'react';
import clsx from 'clsx';
import { useI18n } from '../../../hooks/useI18n';

const CustomToggleCheck = React.forwardRef(
  (
    props: {
      id: string;
      checked: boolean;
      name?: string;
      onChange?: (e: any) => void;
      onClick: (e: any) => void;
    },
    ref: any,
  ) => {
    const { t } = useI18n();

    return (
      <label className="d-flex mb-0">
        <div
          className={clsx(
            'toggle-check',
            props.checked && 'toggle-check--checked',
          )}
        >
          <input
            type="checkbox"
            id={props.id}
            ref={ref}
            name={props.name}
            onChange={props.onChange}
            onClick={props.onClick}
            readOnly
          ></input>
          <span className="toggle-check__slider"></span>
          <span className="toggle-check__checked">
            {t('custom_checkbox_checked')}
          </span>
          <span className="toggle-check__unchecked">
            {t('custom_checkbox_unchecked')}
          </span>
        </div>
      </label>
    );
  },
);

export default CustomToggleCheck;

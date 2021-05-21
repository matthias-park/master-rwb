import React from 'react';
import clsx from 'clsx';
import { useI18n } from '../../../hooks/useI18n';

const CustomToggleCheck = ({ id, checked, onChange }) => {
  const { t } = useI18n();

  return (
    <div
      className={clsx('toggle-check', checked && 'toggle-check--checked')}
      onClick={onChange}
    >
      <input type="checkbox" id={id} checked={checked} readOnly></input>
      <span className="toggle-check__slider"></span>
      <span className="toggle-check__checked">
        {t('custom_checkbox_checked')}
      </span>
      <span className="toggle-check__unchecked">
        {t('custom_checkbox_unchecked')}
      </span>
    </div>
  );
};

export default CustomToggleCheck;

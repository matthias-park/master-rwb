import React, { useState } from 'react';
import { Control, FieldValues, useController } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import clsx from 'clsx';
import Dropdown from 'react-bootstrap/Dropdown';
import { useI18n } from '../../hooks/useI18n';

interface Props {
  id: string;
  control?: Control<FieldValues>;
  rules?: any;
  disabled?: boolean;
  values: { value: any; text: string }[];
  title?: string;
  setValue: any;
  defaultValue?: string | number | undefined | null;
  defaultTitle?: string | undefined | null;
  className?: string;
  disableTranslation?: boolean;
}

const SelectInput = ({
  id,
  control,
  rules,
  disabled,
  values,
  title,
  setValue,
  defaultValue,
  defaultTitle,
  className,
  disableTranslation,
}: Props) => {
  const { t } = useI18n();
  const { field, fieldState } = useController({
    name: id,
    control,
    defaultValue: defaultValue?.toString() ? defaultValue?.toString() : '-1',
    rules: {
      ...rules,
      validate: value => {
        if (typeof rules?.required === 'string' && value === '-1')
          return rules.required;
        return rules.required && value !== '-1';
      },
    },
  });
  const { ...fields } = field;
  const [selectText, setSelectText] = useState(defaultTitle || values[0].text);
  const [isOpen, setIsOpen] = useState(false);

  const setSelectValue = (value, text) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldTouch: true,
      shouldDirty: true,
    });
    setSelectText(text);
  };

  const isValid = !!!fieldState.error && fieldState.isDirty && rules.required;
  const isInvalid = !!fieldState.error;

  return (
    <Dropdown
      className={clsx('custom-form-select', className)}
      onToggle={show => setIsOpen(show)}
    >
      <Form.Group
        className={clsx(
          isInvalid && 'has-error',
          fieldState.error?.message && 'with-message',
          isValid && 'success',
        )}
      >
        <div className="form-control-wrp">
          <input {...fields} type="hidden"></input>
          <Dropdown.Toggle
            as="div"
            bsPrefix="custom-form-select__toggle"
            className={clsx(isOpen && !fieldState.isDirty && 'active')}
          >
            <Form.Control
              as="span"
              disabled={disabled}
              isInvalid={isInvalid}
              isValid={isValid}
            >
              {disableTranslation ? selectText : t(selectText)}
            </Form.Control>
            <label htmlFor={id} className="text-14">
              {title}
            </label>
            <div className="form-group__icons">
              <i className="icon-check"></i>
              <i className="icon-exclamation"></i>
              <i className={clsx('icon-arrow-dropdown', isOpen && 'open')}></i>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu bsPrefix="custom-form-select__menu" as="ul">
            {values.map(item => (
              <Dropdown.Item
                onClick={() => setSelectValue(item.value, item.text)}
                bsPrefix="custom-form-select__menu-item"
                as="li"
              >
                <span className="custom-form-select__menu-item-text">
                  {disableTranslation ? item.text : t(item.text)}
                </span>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </div>
        <small className="form-group__error-msg">
          {fieldState.error?.message}
        </small>
      </Form.Group>
    </Dropdown>
  );
};

export default SelectInput;

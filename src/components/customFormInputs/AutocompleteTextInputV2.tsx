import React, { useState } from 'react';
import Downshift from 'downshift';
import { Control, FieldValues, useController } from 'react-hook-form';
import { UncontrolledTextInput } from './TextInput';
import { FormFieldValidation } from '../../constants';

interface Props {
  id: string;
  control?: Control<FieldValues>;
  defaultValue?: unknown;
  rules: any;
  title?: string;
  options: any[];
  onInput?: (value: string) => void;
  filterItems?: (item: any, value: string) => boolean;
  formatSuggestionValue: (
    item: any,
    inputValue?: string | null,
  ) => string | JSX.Element;
  formatInputValue: (item: any) => string;
  onSelectOption: (item: any) => void;
  isMenuOpen: boolean;
  loading: boolean;
  validation?: FormFieldValidation;
}

const AutocompleteTextInputV2 = ({
  id,
  control,
  defaultValue,
  rules,
  title,
  options,
  onInput,
  filterItems,
  formatSuggestionValue,
  formatInputValue,
  onSelectOption,
  isMenuOpen,
  loading,
  validation,
}: Props) => {
  const { field, fieldState } = useController({
    name: id,
    control,
    defaultValue,
    rules,
  });
  const [hasFocus, setHasFocus] = useState(false);

  const isValid =
    !!field.value &&
    !fieldState.error &&
    !fieldState.isValidating &&
    !loading &&
    (validation == null || validation === FormFieldValidation.Valid);
  return (
    <Downshift
      ref={field.ref}
      isOpen={isMenuOpen}
      onChange={item => {
        onSelectOption(item);
        field.onChange(formatInputValue(item));
      }}
      inputValue={field.value}
      onInputValueChange={value => {
        onInput?.(value);
      }}
      itemToString={formatInputValue}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        inputValue,
        selectedItem,
        getRootProps,
      }) => (
        <div
          style={{ position: 'relative' }}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        >
          <div {...getRootProps(undefined, { suppressRefError: true })}>
            <UncontrolledTextInput
              {...(getInputProps({
                onBlur: field.onBlur,
                id,
                errorMsg: fieldState.error?.message,
                isInvalid: !!fieldState.error,
                autoComplete: 'nope',
                title,
                onChange: field.onChange,
                validation: loading
                  ? FormFieldValidation.Validating
                  : validation,
                isValid,
              }) as any)}
            />
          </div>
          {isOpen && !!inputValue && hasFocus && (
            <div
              className="rbt-menu dropdown-menu show w-100"
              role="listbox"
              {...getMenuProps()}
            >
              {options
                .filter(
                  item =>
                    !!inputValue &&
                    (!filterItems || filterItems(item, inputValue)),
                )
                .map((item, index) => (
                  <div
                    key={formatSuggestionValue(item, '')}
                    aria-selected={selectedItem === item}
                    role="option"
                    className="dropdown-item cursor-pointer"
                    {...getItemProps({
                      key: item.value,
                      index,
                      item,
                    })}
                  >
                    {formatSuggestionValue(item, inputValue)}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
};

export default AutocompleteTextInputV2;

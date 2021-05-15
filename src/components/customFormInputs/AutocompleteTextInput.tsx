import React, { useState, useRef, useCallback } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {
  Control,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';
import { UncontrolledTextInput } from './TextInput';

interface Props {
  id: string;
  autoComplete: (value: string) => Promise<any>;
  labelkey: (value: any, inputValue?: string) => string;
  control?: Control<FieldValues>;
  defaultValue?: unknown;
  rules: any;
  title?: string;
  onBlur?: () => void;
  invalidTextError: string;
}

const AutocompleteTextInput = ({
  id,
  control,
  defaultValue = '',
  rules,
  title,
  onBlur,
  autoComplete,
  labelkey,
  invalidTextError,
}: Props) => {
  const gotFocus = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const { setError, clearErrors } = useFormContext();
  const { field, fieldState } = useController({
    name: id,
    control,
    defaultValue,
    rules,
  });

  const search = useCallback((query: string) => {
    setIsLoading(true);
    autoComplete(query)
      .then((result: any[]) => {
        setIsLoading(false);
        setOptions(result);
        if (fieldState.error) clearErrors(id);
      })
      .catch(err => {
        setIsLoading(false);
        setError(id, err);
        if (options.length) setOptions([]);
      });
  }, []);

  const filteredOptions = options.filter(option => {
    const value = field.value as string;
    const formatedLabel = labelkey(option, value).toLocaleLowerCase();
    return (
      formatedLabel.includes(value?.toLocaleLowerCase()) &&
      formatedLabel !== value?.toLocaleLowerCase()
    );
  });
  const open =
    !isLoading &&
    gotFocus.current &&
    !!filteredOptions.length &&
    field.value.length > 1;
  return (
    <AsyncTypeahead
      {...field}
      isLoading={isLoading}
      labelKey={value => labelkey(value, field.value)}
      id={`${id}-select`}
      promptText={title}
      useCache={false}
      open={open}
      onChange={values => {
        if (values.length) {
          field.onChange(labelkey(values[0], field.value));
          setOptions(values);
        } else {
          field.onChange('');
        }
      }}
      onInputChange={value => {
        field.onChange(value);
      }}
      onFocus={() => {
        gotFocus.current = true;
      }}
      searchText=""
      emptyLabel=""
      defaultInputValue={field.value}
      onBlur={() => {
        gotFocus.current = false;
        field.onBlur();
        onBlur?.();
        if (
          !options?.some(
            option => labelkey(option, field.value) === field.value,
          ) &&
          !fieldState.error
        ) {
          setError(id, { type: 'manual', message: invalidTextError });
        }
      }}
      highlightOnlyResult
      renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
        return (
          <UncontrolledTextInput
            {...inputProps}
            title={title}
            id={id}
            errorMsg={fieldState.error?.message}
            isInvalid={!!fieldState.error && !isLoading}
            ref={ref => {
              referenceElementRef(ref);
              inputRef(ref);
            }}
          />
        );
      }}
      onSearch={search}
      options={options}
    />
  );
};

export default AutocompleteTextInput;

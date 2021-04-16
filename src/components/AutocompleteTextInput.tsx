import React, { useState, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Controller } from 'react-hook-form';
import { PostCodeInfo } from '../types/api/user/Registration';
import TextInput from './TextInput';

interface Props {
  autoComplete: (value: string) => Promise<any>;
  id: string;
  name?: string;
  type?: string;
  placeholder: string;
  error?: { message: string };
  setError?: (error: string | null) => void;
  labelkey: (value: any) => string;
  invalidTextError: string;
  rules?: any;
  onBlur?: () => void;
}

const AutocompleteTextInput = (props: Props) => {
  const gotFocus = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<PostCodeInfo[]>([]);

  const search = (query: string) => {
    setIsLoading(true);
    props
      .autoComplete(query)
      .then((result: PostCodeInfo[]) => {
        setIsLoading(false);
        setOptions(result);
        if (props.error && props.setError) props.setError(null);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
        props.setError?.(err);
        if (options.length) setOptions([]);
      });
  };

  return (
    <Controller
      name={props.name || props.id}
      rules={props.rules}
      defaultValue=""
      render={({ field: controlProps }) => {
        const filteredOptions = options.filter(option => {
          const formatedLabel = props.labelkey(option);
          return (
            formatedLabel.includes(controlProps.value) &&
            formatedLabel !== controlProps.value
          );
        });
        const open =
          !isLoading &&
          gotFocus.current &&
          !!filteredOptions.length &&
          controlProps.value.length > 1;

        return (
          <AsyncTypeahead
            isLoading={isLoading}
            labelKey={props.labelkey}
            id={`${props.id}-select`}
            promptText={props.placeholder}
            useCache={false}
            open={open}
            onChange={values => {
              if (values.length) {
                controlProps.onChange(props.labelkey(values[0]));
                setOptions(values);
              } else {
                controlProps.onChange('');
              }
            }}
            onInputChange={value => {
              controlProps.onChange(value);
            }}
            onFocus={() => {
              gotFocus.current = true;
            }}
            searchText=""
            emptyLabel=""
            defaultInputValue={controlProps.value}
            onBlur={() => {
              gotFocus.current = false;
              controlProps.onBlur();
              props.onBlur?.();
              if (
                props.setError &&
                !options.some(
                  option => props.labelkey(option) === controlProps.value,
                ) &&
                !props.error
              ) {
                props.setError(props.invalidTextError);
              }
            }}
            highlightOnlyResult
            renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
              const { autoComplete, onBlur, ...textProps } = props;
              return (
                <TextInput
                  {...inputProps}
                  {...textProps}
                  ref={ref => {
                    inputRef(ref);
                    referenceElementRef(ref);
                  }}
                />
              );
            }}
            onSearch={search}
            options={options}
          />
        );
      }}
    />
  );
};

export default AutocompleteTextInput;

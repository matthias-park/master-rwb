import React, { useState, forwardRef, useRef } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { Control } from 'react-hook-form';
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
}

const AutocompleteTextInput = (props: Props) => {
  const selectedValue = useRef<string>('');
  const gotFocus = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<PostCodeInfo[]>([]);
  const open =
    !isLoading &&
    gotFocus.current &&
    (options.length > 1 ||
      (!!options.length &&
        props.labelkey(options[0]) !== selectedValue.current));
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
          selectedValue.current = props.labelkey(values[0]);
          setOptions(values);
        } else {
          selectedValue.current = '';
        }
      }}
      onInputChange={value => (selectedValue.current = value)}
      onFocus={() => {
        gotFocus.current = true;
      }}
      searchText=""
      emptyLabel=""
      onBlur={() => {
        gotFocus.current = false;
        if (
          props.setError &&
          !options.some(
            option => props.labelkey(option) === selectedValue.current,
          ) &&
          !props.error
        ) {
          props.setError(props.invalidTextError);
        }
      }}
      highlightOnlyResult
      renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
        <TextInput
          {...inputProps}
          {...props}
          ref={ref => {
            inputRef(ref);
            referenceElementRef(ref);
          }}
        />
      )}
      onSearch={(query: string) => {
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
      }}
      options={options}
    />
  );
};

export default AutocompleteTextInput;

import React, {
  memo,
  useState,
  useCallback,
  CSSProperties,
  useRef,
  useLayoutEffect,
} from 'react';
import { usePrevious } from '../../hooks';

export interface PINInputProps {
  length: number;
  onChangePIN: (pin: string) => any;

  autoFocus?: boolean;
  isNumberInput?: boolean;
  disabled?: boolean;

  style?: CSSProperties;
  className?: string;

  inputStyle?: CSSProperties;
  inputClassName?: string;
}

interface SinglePINInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  focus?: boolean;
}

function SinglePINInputComponent(props: SinglePINInputProps) {
  const { focus, autoFocus, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFocus = usePrevious(!!focus);
  useLayoutEffect(() => {
    if (inputRef.current) {
      if (focus && autoFocus) {
        inputRef.current.focus();
      }
      if (focus && autoFocus && focus !== prevFocus) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [autoFocus, focus, prevFocus]);

  return <input ref={inputRef} {...rest} />;
}

const SingleInput = memo(SinglePINInputComponent);

export function PINInputComponent(props: PINInputProps) {
  const {
    length,
    isNumberInput,
    autoFocus,
    disabled,
    onChangePIN,
    inputClassName,
    inputStyle,
    ...rest
  } = props;

  const [activeInput, setActiveInput] = useState(0);
  const [pinValues, setPINValues] = useState(Array<string>(length).fill(''));

  // Helper to return PIN from inputs
  const handleOtpChange = useCallback(
    (pin: string[]) => {
      const pinValue = pin.join('');
      onChangePIN(pinValue);
    },
    [onChangePIN],
  );

  // Helper to return value with the right type: 'text' or 'number'
  const getRightValue = useCallback(
    (str: string) => {
      let changedValue = str;

      if (!isNumberInput || !changedValue) {
        return changedValue;
      }

      return Number(changedValue) >= 0 ? changedValue : '';
    },
    [isNumberInput],
  );

  // Change PIN value at focussing input
  const changeCodeAtFocus = useCallback(
    (str: string) => {
      const updatedPINValues = [...pinValues];
      updatedPINValues[activeInput] = str[0] || '';
      setPINValues(updatedPINValues);
      handleOtpChange(updatedPINValues);
    },
    [activeInput, handleOtpChange, pinValues],
  );

  // Focus `inputIndex` input
  const focusInput = useCallback(
    (inputIndex: number) => {
      const selectedIndex = Math.max(Math.min(length - 1, inputIndex), 0);
      setActiveInput(selectedIndex);
    },
    [length],
  );

  const focusPrevInput = useCallback(() => {
    focusInput(activeInput - 1);
  }, [activeInput, focusInput]);

  const focusNextInput = useCallback(() => {
    focusInput(activeInput + 1);
  }, [activeInput, focusInput]);

  // Handle onFocus input
  const handleOnFocus = useCallback(
    (index: number) => () => {
      focusInput(index);
    },
    [focusInput],
  );

  // Handle onChange value for each input
  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = getRightValue(e.currentTarget.value);
      if (!val) {
        e.preventDefault();
        return;
      }
      changeCodeAtFocus(val);
      focusNextInput();
    },
    [changeCodeAtFocus, focusNextInput, getRightValue],
  );

  // Handle onBlur input
  const onBlur = useCallback(() => {
    setActiveInput(-1);
  }, []);

  // Handle onKeyDown input
  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const pressedKey = e.key;

      switch (pressedKey) {
        case 'Backspace':
        case 'Delete': {
          e.preventDefault();
          if (pinValues[activeInput]) {
            changeCodeAtFocus('');
          } else {
            focusPrevInput();
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          focusPrevInput();
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          focusNextInput();
          break;
        }
        default: {
          if (pressedKey.match(/^[^a-zA-Z0-9]$/)) {
            e.preventDefault();
          }

          break;
        }
      }
    },
    [activeInput, changeCodeAtFocus, focusNextInput, focusPrevInput, pinValues],
  );

  const handleOnPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData('text/plain')
        .trim()
        .slice(0, length - activeInput)
        .split('');
      if (pastedData) {
        let nextFocusIndex = 0;
        const updatedPINValues = [...pinValues];
        updatedPINValues.forEach((val, index) => {
          if (index >= activeInput) {
            const changedValue = getRightValue(pastedData.shift() || val);
            if (changedValue) {
              updatedPINValues[index] = changedValue;
              nextFocusIndex = index;
            }
          }
        });
        setPINValues(updatedPINValues);
        setActiveInput(Math.min(nextFocusIndex + 1, length - 1));
      }
    },
    [activeInput, getRightValue, length, pinValues],
  );

  return (
    <div {...rest}>
      {Array(length)
        .fill('')
        .map((_, index) => (
          <SingleInput
            key={`SingleInput-${index}`}
            type={isNumberInput ? 'number' : 'text'}
            focus={activeInput === index}
            value={pinValues && pinValues[index]}
            autoFocus={autoFocus}
            onFocus={handleOnFocus(index)}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
            onBlur={onBlur}
            onPaste={handleOnPaste}
            style={inputStyle}
            className={inputClassName}
            disabled={disabled}
          />
        ))}
    </div>
  );
}

const PINInput = memo(PINInputComponent);
export default PINInput;

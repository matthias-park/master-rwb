import React, { useRef, useState } from 'react';
import { cache } from 'swr';
import { useI18n } from '../../hooks/useI18n';
import { getApi } from '../../utils/apiUtils';
import { useFormContext } from 'react-hook-form';
import SmartyStreetsAutocomplete from '../../types/SmartyStreetsAutocomplete';
import RailsApiResponse from '../../types/api/RailsApiResponse';
import AutocompleteTextInputV2 from './AutocompleteTextInputV2';
import { Config, RailsApiResponseFallback } from '../../constants';
import { core, usAutocompletePro } from 'smartystreets-javascript-sdk';
import * as Sentry from '@sentry/react';

const credentials =
  Config.smartyStreets && new core.SharedCredentials(Config.smartyStreets);
const client = credentials && core.buildClient.usAutocompletePro(credentials);

const formatInputValue = (item?: SmartyStreetsAutocomplete) => {
  if (!item) return '';
  return `${item.streetLine} ${item.secondary}`;
};
const formatSuggestionValue = (
  item: SmartyStreetsAutocomplete,
  inputValue?: string | null,
) => {
  if (!item) return '';
  const formattedValue = `${item.streetLine} ${item.secondary}${
    item.entries > 1 ? ' (' + item.entries + ')' : ''
  } ${item.city} ${item.state} ${item.zipcode}`;
  const lowerCaseFormattedValue = formattedValue.toLowerCase();
  const lowerCaseInputValue = inputValue && inputValue?.toLowerCase();
  if (
    lowerCaseInputValue &&
    lowerCaseFormattedValue.includes(lowerCaseInputValue)
  ) {
    const overlapStartIndex = lowerCaseFormattedValue.indexOf(
      lowerCaseInputValue,
    );
    const stringStart = overlapStartIndex
      ? formattedValue.substring(0, overlapStartIndex)
      : '';
    const stringMiddle = formattedValue.substring(
      overlapStartIndex,
      inputValue!.length,
    );
    const stringEnd = formattedValue.substring(
      overlapStartIndex + inputValue!.length,
    );
    return (
      <>
        {stringStart}
        <span className="font-weight-bold">{stringMiddle}</span>
        {stringEnd}
      </>
    );
  }
  return formattedValue;
};

const selectedFormatKey = (value: SmartyStreetsAutocomplete) =>
  `${value.streetLine} ${value.secondary} (${value.entries}) ${value.city} ${value.state} ${value.zipcode}`;

const getAvailableProvinces = async () => {
  const cacheId = `registration_provinces`;
  let response = cache.has(cacheId) && cache.get(cacheId);
  if (!response) {
    const url = '/restapi/v1/provinces';
    const res = await getApi<RailsApiResponse<any | null>>(url).catch(res => {
      Sentry.captureMessage(
        `Request failed ${url} with status ${res.status}`,
        Sentry.Severity.Fatal,
      );
      return RailsApiResponseFallback;
    });
    if (res.Success && res.Data && Array.isArray(res.Data)) {
      response = res.Data.map(province => ({
        text: province.name,
        code: province.code,
        value: province.id.toString(),
      }));
      cache.set(cacheId, response);
    }
  }
  return response || [];
};

interface Props {
  id: string;
  translationPrefix?: string;
  required?: boolean;
  defaultValue?: string;
  validate?: () => boolean;
}

const fakeFieldId = 'temp_field_autocomplete_address';
const AutocompleteSmartyStreets = ({
  id,
  translationPrefix = '',
  required,
  defaultValue,
  validate,
}: Props) => {
  const { setValue } = useFormContext();
  const { t } = useI18n();
  const fetchSuggestionsLock = useRef<number>(0);
  const selectedValue = useRef<SmartyStreetsAutocomplete | null>(null);
  const [options, setOptions] = useState<SmartyStreetsAutocomplete[]>([]);
  const [loading, setLoading] = useState(false);
  const inputValue = useRef('');

  const autoComplete = async (
    value: string,
    validate?: boolean,
    noWait?: boolean,
  ): Promise<SmartyStreetsAutocomplete[]> => {
    setLoading(true);
    const cacheId = `registration_address_${value.trim()}_${
      selectedValue.current
    }`;
    if (fetchSuggestionsLock.current) {
      clearTimeout(fetchSuggestionsLock.current);
    }
    let response = cache.has(cacheId) && cache.get(cacheId);
    if (!response && value) {
      const search = async () => {
        let lookup = new usAutocompletePro.Lookup(value);
        if (selectedValue.current) {
          lookup.selected = selectedFormatKey(selectedValue.current);
        }
        const result = await client.send(lookup).catch(() => null);
        if (result?.result) cache.set(cacheId, result?.result);
        if (!validate) {
          setOptions(result?.result || []);
        }
        setLoading(false);
        return result?.result || [];
      };
      if (validate || noWait) {
        response = await search();
      } else {
        fetchSuggestionsLock.current = setTimeout(search, 500);
      }
    } else {
      if (response) {
        setOptions(response);
      }
      setLoading(false);
    }
    return response || [];
  };

  const fillDataFields = (item?: SmartyStreetsAutocomplete) => {
    setOptions(item ? [item] : []);
    if (item) {
      setValue('city', item?.city || '', {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('address', formatInputValue(item), {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue('postal_code', item?.zipcode || '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (item?.state) {
      getAvailableProvinces().then(res => {
        const province = res.find(state => state.code === item.state);
        setValue('province_id', province?.value?.toString() || '', {
          shouldValidate: true,
          shouldDirty: true,
        });
      });
    }
  };
  const onSelectOption = (item: SmartyStreetsAutocomplete) => {
    if (!item) {
      selectedValue.current = null;
    } else {
      selectedValue.current = item;
    }
    if (item.entries > 1) {
      autoComplete(formatInputValue(item), false, true);
    } else {
      fillDataFields(item);
    }
  };
  const onInputHandler = (value: string) => {
    const valueLowerCaseTrim = value.toLowerCase().trim();
    const currentSelectionEqual =
      !!selectedValue.current &&
      formatInputValue(selectedValue.current).toLowerCase().trim() ===
        valueLowerCaseTrim;
    if (!currentSelectionEqual) {
      const availableOptions = options.filter(option =>
        formatInputValue(option)
          .toLowerCase()
          .trim()
          .includes(valueLowerCaseTrim),
      );
      const equalOption =
        availableOptions.length === 1 &&
        inputValue.current.length <= valueLowerCaseTrim.length;
      inputValue.current = valueLowerCaseTrim;
      if (equalOption) {
        selectedValue.current = availableOptions[0];
      } else {
        selectedValue.current = null;
      }
      if (!equalOption || availableOptions[0].entries > 1) {
        autoComplete(value);
      } else if (equalOption) {
        fillDataFields(availableOptions[0]);
      }
    }
    setValue('address', value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const isMenuOpen =
    !!options.length &&
    (!selectedValue.current || selectedValue.current.entries > 1);

  return (
    <>
      <AutocompleteTextInputV2
        id={fakeFieldId}
        rules={{
          required:
            required &&
            `${t(`${translationPrefix}${id}`)} ${t(
              `${translationPrefix}required`,
            )}`,
          validate: validate,
        }}
        title={t(`${translationPrefix}${id}`)}
        defaultValue={defaultValue}
        options={options}
        onInput={onInputHandler}
        formatSuggestionValue={formatSuggestionValue}
        formatInputValue={formatInputValue}
        onSelectOption={onSelectOption}
        isMenuOpen={isMenuOpen}
        loading={loading}
      />
    </>
  );
};

export default AutocompleteSmartyStreets;

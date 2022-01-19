import React, { useEffect } from 'react';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import debounce from 'lodash.debounce';
import clsx from 'clsx';
import { useI18n } from '../../../../hooks/useI18n';

const CasinoSearch = () => {
  const { searchData, setSearchData } = useCasinoConfig();
  const { t } = useI18n();

  useEffect(() => {
    setSearchData({ ...searchData, searchValue: '' });
  }, []);

  const setSearchQuery = event => {
    setSearchData({ ...searchData, searchValue: event.target.value });
  };

  const debouncedChangeHandler = debounce(setSearchQuery, 400);

  return (
    <div className="casino-search-input">
      <input
        className="casino-search-input__input"
        placeholder={t('casino_filter_placeholder')}
        onChange={debouncedChangeHandler}
      />
      <i
        className={clsx(
          'casino-search-input__icon icon-search',
          searchData.showSearch && 'active',
        )}
      />
    </div>
  );
};

export default CasinoSearch;

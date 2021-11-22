import React, { useEffect } from 'react';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import debounce from 'lodash.debounce';
import clsx from 'clsx';

const CasinoSearch = () => {
  const { searchData, setSearchData } = useCasinoConfig();

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
        placeholder="Search Games"
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

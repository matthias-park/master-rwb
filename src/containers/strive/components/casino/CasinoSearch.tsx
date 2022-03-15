import React, { useEffect } from 'react';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import debounce from 'lodash.debounce';
import clsx from 'clsx';
import { StyledCasinoSearch } from '../styled/casinoStyles';
import { Config } from '../../../../constants';

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
    <StyledCasinoSearch>
      <i className={clsx(`icon-${Config.name}-search`)} />
      <input placeholder="Search Games" onChange={debouncedChangeHandler} />
      <i
        className={clsx(`icon-${Config.name}-close`, 'close-btn')}
        onClick={() => setSearchData({ ...searchData, showSearch: false })}
      />
    </StyledCasinoSearch>
  );
};

export default CasinoSearch;

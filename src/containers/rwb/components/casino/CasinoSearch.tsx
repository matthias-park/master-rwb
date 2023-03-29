import React, { useEffect } from 'react';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import debounce from 'lodash.debounce';
import clsx from 'clsx';
import { StyledCasinoSearch } from '../styled/casinoStyles';
import { Config } from '../../../../constants';
import { SearchActions } from '../../../../types/api/Casino';

const CasinoSearch = () => {
  const { setSearchData } = useCasinoConfig();

  useEffect(() => {
    setSearchData({ type: SearchActions.SetValue, payload: '' });
  }, []);

  const setSearchQuery = event => {
    setSearchData({
      type: SearchActions.SetValue,
      payload: event.target.value,
    });
  };

  const debouncedChangeHandler = debounce(setSearchQuery, 700);

  return (
    <StyledCasinoSearch>
      <i className={clsx(`icon-${Config.name}-search`)} />
      <input placeholder="Search Games" onChange={debouncedChangeHandler} />
      <i
        className={clsx(`icon-${Config.name}-close`, 'close-btn')}
        onClick={() => setSearchData({ type: SearchActions.Hide })}
      />
    </StyledCasinoSearch>
  );
};

export default CasinoSearch;

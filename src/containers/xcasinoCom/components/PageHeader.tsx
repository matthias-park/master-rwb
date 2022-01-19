import clsx from 'clsx';
import React from 'react';
import CasinoFilters from './casino/CasinoFilters';
import CasinoSearch from './casino/CasinoSearch';
import RewardsFilter from './RewardsFilter';

interface PageHeaderProps {
  title?: string;
  icon?: string;
  isCasino?: boolean;
  isRewards?: boolean;
}

function PageHeader({ title, icon, isCasino, isRewards }: PageHeaderProps) {
  return (
    <>
      {isCasino ? (
        <div className="casino-page-header page-content pb-0">
          <h3 className="casino-page-header__title">
            <i className={clsx('casino-page-header__title-icon', icon)} />
            {title}
          </h3>
          <CasinoFilters />
        </div>
      ) : (
        <>
          <div
            className={clsx(
              'page-header d-none d-lg-flex',
              isRewards && 'rewards-header',
            )}
          >
            <h3 className="page-header__title">
              <i className={clsx('page-header__title-icon', icon)} />
              {title}
            </h3>
            {isRewards ? <RewardsFilter /> : <CasinoSearch />}
          </div>
          <hr className="divider-secondary d-none d-lg-block mx-4 my-0" />
        </>
      )}
    </>
  );
}

export default PageHeader;

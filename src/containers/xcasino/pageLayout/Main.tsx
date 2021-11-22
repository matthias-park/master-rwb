import React from 'react';
import PageHeader from '../components/PageHeader';
import { useCasinoConfig } from '../../../hooks/useCasinoConfig';
import CasinoSearchResults from '../components/casino/CasinoSearchResults';
import CasinoGameSidebar from '../components/casino/CasinoGameSidebar';
import clsx from 'clsx';

const Main = ({
  children,
  title,
  icon,
  noHeader,
  isCasino,
  isRewards,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  icon?: string;
  noHeader?: boolean;
  isCasino?: boolean;
  isRewards?: boolean;
  className?: string;
}) => {
  const { searchData } = useCasinoConfig();

  return (
    <div className={clsx(className)}>
      {!noHeader && (
        <PageHeader
          title={title}
          icon={icon}
          isCasino={isCasino}
          isRewards={isRewards}
        />
      )}
      {searchData.showSearch ? <CasinoSearchResults /> : children}
      <CasinoGameSidebar />
    </div>
  );
};

export default Main;

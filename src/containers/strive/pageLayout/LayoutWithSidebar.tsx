import React from 'react';
import Sidebar from '../components/Sidebar';
import HelpBlock from '../components/HelpBlock';
import { Sidebar as SidebarProps } from '../../../types/api/PageConfig';
import { Franchise } from '../../../constants';
import loadable from '@loadable/component';
import { useAuth } from '../../../hooks/useAuth';

const LoadablePageColumnFooter = loadable(() => import('./PageColumnFooter'));
const LoadablePageFooter = loadable(() => import('./PageFooter'));
interface Props {
  sidebar: SidebarProps[];
  rightSidebar: boolean;
  children: React.ReactNode;
  spacingClasses: string | null;
}
const LayoutWithSidebar = ({
  sidebar,
  rightSidebar,
  children,
  spacingClasses,
}: Props) => {
  const { user } = useAuth();

  return (
    <>
      <div
        className={
          rightSidebar
            ? `account-settings pb-4 min-vh-70`
            : `page-container ${spacingClasses}`
        }
      >
        {!(
          (Franchise.desertDiamond || Franchise.gnogaz || Franchise.gnogon) &&
          !user.logged_in
        ) && <Sidebar links={sidebar} />}
        {children}
        {rightSidebar && !Franchise.desertDiamond && (
          <div className="right-sidebar">
            <HelpBlock
              title={'user_help_title'}
              blocks={['faq', 'phone', 'email']}
              className="default"
            />
          </div>
        )}
      </div>
      {Franchise.gnogaz || Franchise.desertDiamond || Franchise.gnogon ? (
        <LoadablePageColumnFooter />
      ) : (
        <LoadablePageFooter />
      )}
    </>
  );
};

export default LayoutWithSidebar;

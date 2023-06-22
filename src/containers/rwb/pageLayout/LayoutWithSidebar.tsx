import React from 'react';
import Sidebar from '../components/Sidebar';
import { Sidebar as SidebarProps } from '../../../types/api/PageConfig';
import loadable from '@loadable/component';
import { useAuth } from '../../../hooks/useAuth';

const LoadablePageColumnFooter = loadable(() => import('./PageColumnFooter'));
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
          sidebar
            ? `account-settings pb-4 min-vh-70`
            : `page-container ${spacingClasses}`
        }
      >
        {user.logged_in && <Sidebar links={sidebar} />}
        {children}
      </div>
      <LoadablePageColumnFooter />
    </>
  );
};

export default LayoutWithSidebar;

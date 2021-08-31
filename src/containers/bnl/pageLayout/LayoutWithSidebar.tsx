import React from 'react';
import PageFooter from './PageFooter';
import Sidebar from '../components/Sidebar';
import HelpBlock from '../components/HelpBlock';
import { Sidebar as SidebarProps } from '../../../types/api/PageConfig';

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
}: Props) => (
  <>
    <div
      className={
        rightSidebar
          ? `account-settings pb-4 min-vh-70`
          : `page-container ${spacingClasses}`
      }
    >
      <Sidebar links={sidebar} />
      {children}
      {rightSidebar && (
        <div className="right-sidebar d-none d-xl-block">
          <HelpBlock
            title={'user_help_title'}
            blocks={['faq', 'phone', 'email']}
            className="default"
          />
        </div>
      )}
    </div>
    <PageFooter />
  </>
);

export default LayoutWithSidebar;

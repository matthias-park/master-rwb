import React from 'react';
import PageFooter from './PageFooter';
import Sidebar from '../../components/Sidebar';
import HelpBlock from '../../components/HelpBlock';
import { Sidebar as SidebarProps } from '../../types/api/PageConfig';

interface Props {
  sidebar: SidebarProps[];
  rightSidebar: boolean;
  children: React.ReactNode;
}
const LayoutWithSidebar = ({ sidebar, rightSidebar, children }: Props) => (
  <>
    <div
      className={
        rightSidebar ? 'account-settings pb-4' : 'page-container pt-xl-4'
      }
    >
      <Sidebar links={sidebar} />
      {children}
      {rightSidebar && (
        <div className="right-sidebar">
          <HelpBlock
            title={'user_help_title'}
            blocks={['phone']}
            className={'default'}
          />
        </div>
      )}
    </div>
    <PageFooter />
  </>
);

export default LayoutWithSidebar;

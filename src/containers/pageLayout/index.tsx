import React from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import CookieConsent from '../../components/CookieConsent';
import { useLocation } from 'react-router-dom';
import LayoutWithSidebar from './LayoutWithSidebar';

const pathsWithSidebar = [
  '/bonus',
  '/deposit',
  '/limits',
  '/settings',
  '/withdrawal',
  '/transactions',
  '/cookie-policy',
  '/faq',
];

const pathsWithRightSidebar = [
  '/bonus',
  '/deposit',
  '/limits',
  '/settings',
  '/withdrawal',
  '/transactions',
  '/cookie-policy',
  '/faq',
];

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const sidebarLayout = pathsWithSidebar.includes(pathname);
  const rightSidebarLayout = pathsWithRightSidebar.includes(pathname);
  return (
    <>
      <PageHeader />
      {sidebarLayout ? (
        <LayoutWithSidebar rightSidebar={rightSidebarLayout}>
          {children}
        </LayoutWithSidebar>
      ) : (
        <>
          {children}
          <PageFooter />
        </>
      )}
      <CookieConsent />
    </>
  );
};

export default PageLayout;

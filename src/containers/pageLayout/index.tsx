import React from 'react';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import CookieConsent from '../../components/CookieConsent';
import UserPageLayout from './UserPageLayout';
import { useLocation } from 'react-router-dom';

const helpRoutes = ['/cookie-policy', '/faq'];
const userRoutes = [
  '/bonus',
  '/deposit',
  '/limits',
  '/settings',
  '/withdrawal',
];

const PageLayout = ({ children }) => {
  let { pathname } = useLocation();
  const playerPage =
    userRoutes.includes(pathname) || helpRoutes.includes(pathname);
  console.log(pathname);
  return (
    <>
      <PageHeader />
      {playerPage ? (
        <UserPageLayout>{children}</UserPageLayout>
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

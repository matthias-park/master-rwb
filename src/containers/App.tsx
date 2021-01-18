import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Routes from './pages';
import { HEAD_DATA } from '../constants';
import HeadData from '../types/HeadData';
import { useConfig } from '../hooks/useConfig';

const App = () => {
  const headData: HeadData = HEAD_DATA;
  const { locale } = useConfig();
  return (
    <BrowserRouter basename={`/${locale}`}>
      <Helmet htmlAttributes={{ lang: locale }}>
        <title>{headData.title}</title>
        {headData.links?.map(linkProps => (
          <link {...linkProps} />
        ))}
        {headData.scripts?.map(scriptProps => (
          <script {...scriptProps} />
        ))}
        {headData.metas?.map(metaProps => (
          <meta {...metaProps} />
        ))}
      </Helmet>
      <ErrorBoundary>
        <Routes />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;

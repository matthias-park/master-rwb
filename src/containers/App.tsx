import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import NotFoundPage from './pages/notFoundPage';
import PageLayout from './pageLayout';
import ErrorBoundary from './ErrorBoundary';
import Routes from './pages';
import { useConfig } from '../hooks/useConfig';

const App = () => {
  const { headData } = useConfig();
  return (
    <BrowserRouter>
      <Helmet>
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
        <PageLayout>
          <Switch>
            <Routes />
            <Route component={NotFoundPage} />
          </Switch>
        </PageLayout>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;

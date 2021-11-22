import React, { useMemo, useEffect } from 'react';
import CasinoGroupSlider from '../components/casino/CasinoGroupSlider';
import BlockLinksSlider from '../components/BlockLinksSlider';
import { ComponentName } from '../../../constants';
import { useModal } from '../../../hooks/useModal';
import Banner from '../components/Banner';
import Main from '../pageLayout/Main';
import { useCasinoConfig } from '../../../hooks/useCasinoConfig';
import { useConfig } from '../../../hooks/useConfig';
import { useParams } from 'react-router-dom';
import LiveCasinoWelcomeGroup from '../components/casino/LiveCasinoWelcomeGroup';

const WelcomePage = () => {
  const { welcomeCasinoCategories } = useConfig();
  const { categories } = useCasinoConfig();
  const { enableModal } = useModal();
  const casinoCategories = useMemo(
    () =>
      categories?.filter(category =>
        welcomeCasinoCategories?.some(slug => slug === category.slug),
      ),
    [welcomeCasinoCategories, categories],
  );
  const { code } = useParams<{ code: string }>();

  useEffect(() => {
    code && enableModal(ComponentName.ResetPasswordModal);
  }, [code]);

  return (
    <Main noHeader className="fade-in">
      <Banner zone="welcome" />
      <div className="welcome-page">
        <div className="welcome-page__content page-content">
          <BlockLinksSlider
            className="expand-right"
            cardClassName="white"
            items={[
              {
                link: '#',
                img: '/assets/images/payments/sofort.svg',
              },
              {
                link: '#',
                img: '/assets/images/payments/sofort.svg',
              },
              {
                link: '#',
                img: '/assets/images/payments/trustly.svg',
              },
              {
                link: '#',
                img: '/assets/images/payments/sofort.svg',
              },
              {
                link: '#',
                img: '/assets/images/payments/trustly.svg',
              },
              {
                link: '#',
                img: '/assets/images/payments/sofort.svg',
              },
              {
                link: '#',
                img: '/assets/images/payments/trustly.svg',
              },
            ]}
          />
          {casinoCategories?.map(category => (
            <CasinoGroupSlider
              key={category.id}
              name={category.name}
              category={{ id: category.id, slug: category.slug }}
              className="expand-right"
            />
          ))}
          <LiveCasinoWelcomeGroup />
        </div>
      </div>
    </Main>
  );
};

export default WelcomePage;

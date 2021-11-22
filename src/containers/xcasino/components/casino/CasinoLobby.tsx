import React from 'react';
import CasinoGroupSlider from './CasinoGroupSlider';
import BlockLinksSlider from '../BlockLinksSlider';
import Spinner from 'react-bootstrap/Spinner';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import { useI18n } from '../../../../hooks/useI18n';

const CasinoLobby = () => {
  const { t } = useI18n();
  const { categories, providers, favouriteGames } = useCasinoConfig();

  return (
    <>
      {(!categories || !favouriteGames) && (
        <div className="d-flex my-3">
          <Spinner animation="border" variant="white" className="mx-auto" />
        </div>
      )}
      {categories && favouriteGames && (
        <>
          {!!favouriteGames.length && (
            <CasinoGroupSlider
              name={t('favourite_casino_games_title')}
              games={favouriteGames}
              className="expand-right"
            />
          )}
          {categories.slice(0, 4).map(category => (
            <CasinoGroupSlider
              name={category.name}
              category={{ id: category.id, slug: category.slug }}
              className="expand-right"
            />
          ))}
          {providers && (
            <BlockLinksSlider
              className="mt-3 mb-1 expand-right"
              cardClassName="light-grey"
              title={t('providers_title')}
              items={providers.map(provider => ({
                link: `/casino/providers/${provider.slug}`,
                img: provider.image,
              }))}
            />
          )}
          {categories.slice(4).map(category => (
            <CasinoGroupSlider
              name={category.name}
              category={{ id: category.id, slug: category.slug }}
              className="expand-right"
            />
          ))}
        </>
      )}
    </>
  );
};

export default CasinoLobby;

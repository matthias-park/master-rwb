import React from 'react';
import CasinoGroupSlider from './CasinoGroupSlider';
import Spinner from 'react-bootstrap/Spinner';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';

const LiveCasinoLobby = () => {
  const { categories } = useCasinoConfig();

  return (
    <>
      {!categories && (
        <div className="d-flex my-3">
          <Spinner animation="border" variant="white" className="mx-auto" />
        </div>
      )}
      {categories && (
        <>
          {categories.map(category => (
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

export default LiveCasinoLobby;

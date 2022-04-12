import React, { useEffect } from 'react';
import CasinoGroupSlider from './CasinoGroupSlider';
import Spinner from 'react-bootstrap/Spinner';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import LazyLoad from 'react-lazyload';

const CasinoLobby = () => {
  const { categories } = useCasinoConfig();

  return (
    <>
      {!categories && (
        <div className="d-flex my-3">
          <Spinner animation="border" variant="white" className="mx-auto" />
        </div>
      )}
      {categories?.map(category => (
        <LazyLoad once>
          <CasinoGroupSlider
            key={`casino-slider-${category.id}`}
            id={category.id}
            name={category.name}
            category={{
              id: category.id,
              slug: category.slug,
              icon: category.icon,
            }}
            className="expand-right"
          />
        </LazyLoad>
      ))}
    </>
  );
};

export default CasinoLobby;

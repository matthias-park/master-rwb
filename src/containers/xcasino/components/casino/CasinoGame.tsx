import React from 'react';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import LazyLoad from 'react-lazyload';
import Spinner from 'react-bootstrap/Spinner';
import { Game } from '../../../../types/api/Casino';
import useDesktopWidth from '../../../../hooks/useDesktopWidth';

interface CasinoGameProps {
  featured?: boolean;
  noTitle?: boolean;
  gameData?: Game;
}

const CasinoGame = ({ noTitle, gameData }: CasinoGameProps) => {
  const { setSelectedGame, loadGame } = useCasinoConfig();
  const isFeatured = gameData?.features?.includes('front_page');
  const label = gameData?.features?.filter(item => item !== 'front_page')[0];
  const desktopWidth = useDesktopWidth(768);

  return (
    <div
      className={clsx('casino-game', isFeatured && 'casino-game--featured')}
      onClick={() =>
        setSelectedGame(gameData && !desktopWidth ? gameData : null)
      }
    >
      <div className="casino-game__img-wrp">
        <LazyLoad
          height={'100%'}
          style={{ height: '100%' }}
          offset={100}
          debounce={300}
          placeholder={
            <div className="d-flex h-100 py-5">
              <Spinner animation="border" variant="white" className="m-auto" />
            </div>
          }
        >
          <img
            className="casino-game__img fade-in"
            src={gameData?.image}
            alt=""
          />
        </LazyLoad>
        {desktopWidth && (
          <div className="casino-game__img-wrp-hover">
            <Button
              variant="primary"
              size="sm"
              className="mb-1 rounded-pill"
              onClick={() => gameData && loadGame(gameData)}
            >
              Play now
            </Button>
            <Button variant="secondary" size="sm" className="rounded-pill">
              Try
            </Button>
          </div>
        )}
        {label && (
          <div className={clsx('casino-game__img-wrp-ribbon', label)}>
            <span>{label}</span>
          </div>
        )}
      </div>
      {!noTitle && <p className="casino-game__title">{gameData?.name}</p>}
    </div>
  );
};

export default CasinoGame;

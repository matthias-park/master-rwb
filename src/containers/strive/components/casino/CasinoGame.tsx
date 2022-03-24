import React from 'react';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import LazyLoad from 'react-lazyload';
import Spinner from 'react-bootstrap/Spinner';
import { Game } from '../../../../types/api/Casino';
import { StyledCasinoGame } from '../styled/casinoStyles';
import { Config, ComponentName } from '../../../../constants';
import { useI18n } from '../../../../hooks/useI18n';
import { useModal } from '../../../../hooks/useModal';
import useDesktopWidth from '../../../../hooks/useDesktopWidth';

interface CasinoGameProps {
  featured?: boolean;
  gameData?: Game;
}

const CasinoGame = ({ gameData }: CasinoGameProps) => {
  const { t } = useI18n();
  const { loadGame, setSelectedGame } = useCasinoConfig();
  const labels = gameData?.features?.filter(feature => feature !== 'big_image');
  const { enableModal } = useModal();
  const tablet = useDesktopWidth(992);

  const showGameInfo = e => {
    e.stopPropagation();
    gameData && setSelectedGame(gameData);
    enableModal(ComponentName.CasinoGameInfoModal);
  };

  return (
    <StyledCasinoGame onClick={e => !tablet && showGameInfo(e)}>
      <div className="img-wrp">
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
            className="img fade-in"
            src={gameData?.image || '/assets/images/casino-game.png'}
            alt=""
          />
        </LazyLoad>
        <div className="labels-wrp">
          {!!labels?.length &&
            labels.slice(0, 2).map((label, i) => (
              <div
                key={`${label}_${i}`}
                className={clsx('game-label', label)}
                style={{ zIndex: labels.length - i }}
              >
                <span>{label.replace(/_/g, ' ')}</span>
              </div>
            ))}
        </div>
        {gameData?.bottom_ribbon && (
          <span className="bottom-label">{gameData.bottom_ribbon}</span>
        )}
        {tablet && (
          <div className="hover">
            <span className="game-info-btn" onClick={showGameInfo}>
              <i className={clsx(`icon-${Config.name}-game-info`)}>
                <span className="path1"></span>
                <span className="path2"></span>
              </i>
            </span>
            <div className="buttons-wrp">
              <Button
                variant="primary"
                className="mb-1"
                onClick={() => gameData && loadGame(gameData)}
              >
                {t('play')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => gameData && loadGame(gameData, true)}
              >
                {t('try')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </StyledCasinoGame>
  );
};

export default CasinoGame;

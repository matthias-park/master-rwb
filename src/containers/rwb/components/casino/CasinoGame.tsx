import React from 'react';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import { useCasinoConfig } from '../../../../hooks/useCasinoConfig';
import LazyLoad from 'react-lazyload';
import { Game } from '../../../../types/api/Casino';
import { StyledCasinoGame } from '../styled/casinoStyles';
import { ThemeSettings, ComponentName } from '../../../../constants';
import { useI18n } from '../../../../hooks/useI18n';
import { useModal } from '../../../../hooks/useModal';
import useDesktopWidth from '../../../../hooks/useDesktopWidth';
import { CSSTransition } from 'react-transition-group';

interface CasinoGameProps {
  featured?: boolean;
  gameData?: Game;
}

const CasinoGame = ({ gameData }: CasinoGameProps) => {
  const { icons: icon } = ThemeSettings!;
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
    <StyledCasinoGame
      className="styled-casino-game"
      onClick={e => !tablet && showGameInfo(e)}
    >
      <div className="img-wrp">
        <LazyLoad
          height={'100%'}
          offset={100}
          debounce={200}
          once
          placeholder={
            <div className="load">
              <img
                className="img"
                src={'/assets/images/casino-game.png'}
                alt=""
              />
            </div>
          }
        >
          <CSSTransition
            in={true}
            appear={true}
            timeout={1000}
            overflow="true"
            classNames="fade"
          >
            <div>
              <img
                className="img"
                src={gameData?.image || '/assets/images/casino-game.png'}
                alt=""
              />
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
                    <i className={clsx(icon?.gameInfo)}>
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
          </CSSTransition>
        </LazyLoad>
      </div>
    </StyledCasinoGame>
  );
};

export default CasinoGame;

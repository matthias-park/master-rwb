import React from 'react';
import clsx from 'clsx';
import Button from 'react-bootstrap/Button';
import { useModal } from '../../../../hooks/useModal';
import { ComponentName } from '../../../../constants';
import { useAuth } from '../../../../hooks/useAuth';

interface CasinoGameProps {
  featured?: boolean;
  label?: 'hot' | 'new' | 'jackpot';
  noTitle?: boolean;
}

const LiveCasinoGame = ({ featured, label, noTitle }: CasinoGameProps) => {
  const { enableModal } = useModal();
  const { user } = useAuth();

  const showLimitsModal = () => {
    if (
      window.__config__.componentSettings?.limitsOnAction?.includes(
        'playCasino',
      ) &&
      user.logged_in
    ) {
      enableModal(ComponentName.LimitsModal);
    }
  };

  return (
    <div className={clsx('casino-game', featured && 'casino-game--featured')}>
      <div className="casino-game__img-wrp">
        <img
          className="casino-game__img"
          src={
            featured
              ? '/assets/images/live-casino/live-casino-categorie.png'
              : '/assets/images/live-casino/live-casino-game.png'
          }
        ></img>
        <div className="casino-game__img-wrp-hover">
          <Button
            variant="primary"
            size="sm"
            className="mb-1 rounded-pill"
            onClick={showLimitsModal}
          >
            Play now
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="rounded-pill"
            onClick={showLimitsModal}
          >
            Try
          </Button>
        </div>
        {label && (
          <div className={clsx('casino-game__img-wrp-ribbon', label)}>
            <span>{label}</span>
          </div>
        )}
      </div>
      {!noTitle && <p className="casino-game__title">Game Title</p>}
    </div>
  );
};

export default LiveCasinoGame;

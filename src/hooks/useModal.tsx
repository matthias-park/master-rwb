import { useDispatch, useSelector } from 'react-redux';
import { ComponentName } from '../constants';
import { RootState } from '../state';
import { disableModal, enableModal } from '../state/reducers/modals';

interface ModalContext {
  allActiveModals: ComponentName[];
  activeModal?: ComponentName;
  enableModal: (name: ComponentName) => void;
  disableModal: (name: ComponentName) => void;
}
export function useModal(): ModalContext {
  const state = useSelector((state: RootState) => state.modals);
  const dispatch = useDispatch();

  return {
    allActiveModals: state,
    activeModal: state[0],
    enableModal: (name: ComponentName) => dispatch(enableModal(name)),
    disableModal: (name: ComponentName) => dispatch(disableModal(name)),
  };
}

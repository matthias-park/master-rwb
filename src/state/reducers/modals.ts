import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ComponentName, ModalPriority } from '../../constants';
import { sortAscending } from '../../utils';
import { setLogin } from './user';
import { changeBodyScroll } from '../../utils/uiUtils';

type ModalsState = ComponentName[];

const initialState: ModalsState = [];

const sortModalsPriority = (modals: ModalsState) =>
  modals.sort((a, b) => {
    const aPriority = ModalPriority[a] || 100;
    const bPriority = ModalPriority[b] || 100;
    return sortAscending(aPriority, bPriority);
  });

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    enableModal: (state, action: PayloadAction<ComponentName>) => {
      if (action.payload && !state.includes(action.payload)) {
        changeBodyScroll(false);
        return sortModalsPriority([...state, action.payload]);
      }
    },
    disableModal: (state, action: PayloadAction<ComponentName>) => {
      if (action.payload && state.includes(action.payload)) {
        const elIndex = state.indexOf(action.payload);
        state.splice(elIndex, 1);
        if (!state.length) {
          changeBodyScroll(true);
        }
        return state;
      }
    },
  },
  extraReducers: {
    [setLogin.toString()]: state => {
      if (window.__config__.componentSettings?.modals.ResponsibleGambling) {
        return sortModalsPriority([
          ...state,
          ComponentName.ResponsibleGamblingModal,
        ]);
      }
    },
  },
});

export const { enableModal, disableModal } = modalsSlice.actions;

export default modalsSlice.reducer;

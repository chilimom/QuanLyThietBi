import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    isLoading: false,
    isShowModal: false,
    modalChildren: null,
  },
  reducers: {
    showModal: (state, action) => {
      ((state.isShowModal = action.payload.isShowModal),
        (state.modalChildren = action.payload.modalChildren));
    },
  },
});

export const { showModal } = loadingSlice.actions;

export default loadingSlice.reducer;

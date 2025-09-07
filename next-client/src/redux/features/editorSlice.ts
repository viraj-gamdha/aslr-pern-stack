import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit/react";

const initialState: { isEditorDirty: boolean } = {
  isEditorDirty: false,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setEditorDirty: (state, action: PayloadAction<boolean>) => {
      state.isEditorDirty = action.payload;
    },
  },
});

///setters of state using useAppDispatch
export const { setEditorDirty } = editorSlice.actions;
///can get current state of this slice using useAppSelector

///to register to the store
export const editorReducer = editorSlice.reducer;

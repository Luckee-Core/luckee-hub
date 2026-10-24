import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ProjectFavoritesState = {
  ids: string[];
};

const initialState: ProjectFavoritesState = {
  ids: [],
};

export const projectFavoritesSlice = createSlice({
  name: 'projectFavorites',
  initialState,
  reducers: {
    setFavoriteIds: (state, action: PayloadAction<string[]>) => {
      state.ids = action.payload;
    },
  },
});

export const ProjectFavoritesActions = projectFavoritesSlice.actions;
export const projectFavoritesReducer = projectFavoritesSlice.reducer;

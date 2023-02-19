import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { SiteProcess } from '../../types/state';
import type { CityName, ImagesFile, SortName } from '../../types/types';
import { CITIES, CityLocation, Sorting, StoreSlice } from '../../const';

const initialState: SiteProcess = {
  city: {
    name: CITIES[0],
    location: CityLocation[CITIES[0]],
  },
  sorting: Sorting.Popular,
  imagesFileArr: [{
    title: '',
    files: []
  }]
};

export const siteProcess = createSlice({
  name: StoreSlice.SiteProcess,
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<CityName>) => {
      state.city = {
        name: action.payload,
        location: CityLocation[action.payload],
      };
    },
    setSorting: (state, action: PayloadAction<SortName>) => {
      state.sorting = action.payload;
    },
    setImagesFileArr: (state, action: PayloadAction<ImagesFile>) => {
      const currentElement = state.imagesFileArr.find((el) => el.title === action.payload.title);
      const index = currentElement ? state.imagesFileArr.indexOf(currentElement) : null;
      if (index) {
        state.imagesFileArr = [...state.imagesFileArr.slice(0, index), action.payload, ...state.imagesFileArr.slice(index + 1)];
      } else {
        state.imagesFileArr.push(action.payload);
      }
    }
  },
});

export const { setCity, setSorting, setImagesFileArr } = siteProcess.actions;

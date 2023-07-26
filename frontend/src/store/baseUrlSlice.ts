/*
We need to disable ESLINT argument mutation rule for these files,
because it clashes with the ability to mutate the state, 
that is provided by RTK 
*/
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

type BaseUrlStateSlice = {
  baseUrl: string;
};

const initialState: BaseUrlStateSlice = {
  baseUrl: '',
};

type IApiConfigJson = {
  FAST_API_BACKEND_URL: string;
};
/* 
// Thunk to fetch apiConfig.json from public
apiConfig.json is injected into the optimised build image of the frontend service, through a Docker volume.
It can be fetched through /apiConfig.json as it resides at the root of the static server.
The reason we use AsyncThunk is because baseUrl does not interact with any React state 
*/
export const fetchBaseUrl = async () => {
  try {
    const response = (await (await fetch('/apiConfig.json')).json()) as IApiConfigJson;
    return response;
  } catch (error) {
    return { FAST_API_BACKEND_URL: 'cannot-find-api-config' } as IApiConfigJson;
  }
};
export const fetchBaseUrlThunk = createAsyncThunk('/apiConfig.json', fetchBaseUrl);

const baseUrlSlice = createSlice({
  name: 'baseUrl',
  initialState,
  reducers: {
    setBaseUrl(state: BaseUrlStateSlice, { payload }: { payload: BaseUrlStateSlice }) {
      state.baseUrl = payload.baseUrl;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchBaseUrlThunk.fulfilled, (state, action) => {
      state.baseUrl = action.payload.FAST_API_BACKEND_URL;
    });

    builder.addCase(fetchBaseUrlThunk.rejected, (state) => {
      state.baseUrl = 'cannot-find-api-config';
    });
  },
});

export const baseUrlSliceActions = baseUrlSlice.actions;

export default baseUrlSlice.reducer;

export const getBaseUrl = (state: BaseUrlStateSlice) => state.baseUrl;

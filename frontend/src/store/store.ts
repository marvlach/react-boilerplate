import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import apiSlice from '../api/apiSlice';
import baseUrlReducer from './baseUrlSlice';
import languageReducer from './languageSlice';
import themeReducer from './themeSlice';
import userReducer from './userSlice';

// Create the root reducer independently to obtain the RootState type
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  userSlice: userReducer,
  baseUrlSlice: baseUrlReducer,
  themeSlice: themeReducer,
  languageSlice: languageReducer,
});

export default function setupStore(preloadedState?: PreloadedState<Store>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  });
}
/*
use useAppDispatch to dispatch asyncThunk actions
for more info: 
https://stackoverflow.com/questions/68812319/redux-toolkit-argument-of-type-asyncthunkaction-is-not-assignable-to-param
*/
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch: () => AppDispatch = useDispatch;

export type AppStore = ReturnType<typeof setupStore>;
export type Store = ReturnType<typeof rootReducer>;

export const useAppSelector: TypedUseSelectorHook<Store> = useSelector;

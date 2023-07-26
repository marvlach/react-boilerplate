import type { PreloadedState } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouterProps, RouterProvider } from 'react-router-dom';
import routesConfig, { setupMemoryRouter } from '../router/Routing';
import type { Store } from '../store/store';
import setupStore from '../store/store';
// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<Store>;
  initialEntries?: MemoryRouterProps['initialEntries'];
}

/**
 * Wrapper around a React App
 *
 * @param state of type ExtendedRenderOptions
 * @returns an object with the store, memory router and all of RTL's query functions
 */
export default function renderWithProviders({
  preloadedState = {},
  initialEntries,
  ...renderOptions
}: ExtendedRenderOptions = {}) {
  const router = setupMemoryRouter(routesConfig, initialEntries);
  const store = setupStore(preloadedState);
  const routerProvider = <RouterProvider router={router} />;
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, router, initialEntries, ...render(routerProvider, { wrapper: Wrapper, ...renderOptions }) };
}

/**
 * Wrapper around the App component.
 * This is only used to test fetching of baseUrl
 *
 * @param ui The react component to wrap(only used to wrap App)
 * @param state of type ExtendedRenderOptions
 * @returns an object with the store and all of RTL's query functions
 */
export function renderWithStoreOnly(
  ui: React.ReactElement,
  { preloadedState = {}, ...renderOptions }: ExtendedRenderOptions = {}
) {
  const store = setupStore(preloadedState);
  function Wrapper({ children }: PropsWithChildren<object>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

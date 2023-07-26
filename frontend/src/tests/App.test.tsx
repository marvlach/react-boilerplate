// Imports
import { createAsyncThunk } from '@reduxjs/toolkit';
import { screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it } from 'vitest';
import App from '../App';
import { deleteAccessTokenFromLocalStorage, setAccessTokenToLocalStorage } from '../utils/localStorage';
import renderWithProviders, { renderWithStoreOnly } from './testUtils';

// we mock the async thunk as if it requests from the backend
// because it's the only request from the public folder
// and it requires client side mock server worker, aka too much unnecessary work
vi.mock('../store/baseUrlSlice', async (importOriginal) => {
  const mod: object = await importOriginal();
  return {
    ...mod,
    // replace fetchBaseUrlThunk
    fetchBaseUrlThunk: createAsyncThunk('/apiConfig.json', async () => {
      try {
        const response = await (await fetch('http://localhost:2233/backendUrl')).json();
        return response;
      } catch (error) {
        return { FAST_API_BACKEND_URL: 'cannot-find-api-config' };
      }
    }),
  };
});

// Tests // https://redux.js.org/usage/writing-tests#setting-up-a-reusable-test-render-function
describe('Renders landing page correctly', async () => {
  afterEach(() => deleteAccessTokenFromLocalStorage());

  it('Should retrieve baseUrl from public folder and render the app', async () => {
    /* SUPER IMPORTANT 
    This is the only place we render without the router provider, and use the browser router of App.tsx.
    Every other component test uses renderWithProviders that provides a memoryRouter, suitable for testing. 
    */
    const { store } = renderWithStoreOnly(<App />);

    // wait for the fetch of backendUrl from apiConfig.json(mocked)
    await waitFor(() => {
      expect(store.getState().baseUrlSlice.baseUrl).toBe('http://localhost:2233/api/v1');
    });

    // wait for the redirect to login
    await waitFor(() => {
      const h1 = screen.queryByTestId('login-header');
      expect(h1).toBeTruthy();

      const usernameInput = screen.queryByTestId('username-input') as HTMLInputElement;
      expect(usernameInput).toBeTruthy();

      const passwordInput = screen.queryByTestId('password-input') as HTMLInputElement;
      expect(passwordInput).toBeTruthy();

      const submitButton = screen.queryByTestId('submit-button') as HTMLInputElement;
      expect(submitButton).toBeTruthy();
    });
  });

  it('Should land on login page, when not auth', async () => {
    // Arrange
    const { router } = renderWithProviders({
      preloadedState: {
        baseUrlSlice: {
          baseUrl: 'http://localhost:2233/api/v1',
        },
      },
    });
    // initially
    expect(router.state.location.pathname).toBe('/');

    // after redirect
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });
  });

  it('Should land on dashboard page, when localStorage has an active token', async () => {
    // Arrange
    setAccessTokenToLocalStorage('some-active-token');
    const { router } = renderWithProviders({
      preloadedState: {
        baseUrlSlice: {
          baseUrl: 'http://localhost:2233/api/v1',
        },
      },
    });

    // initially
    expect(router.state.location.pathname).toBe('/');

    // after redirect
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/dashboard');
    });
    const logoutButton = await waitFor(() => screen.queryByText('Logout'));
    expect(logoutButton).toBeTruthy();
  });

  it('Should land on login page, when localStorage has an inactive token', async () => {
    // Arrange
    setAccessTokenToLocalStorage('some-inactive-token');
    const { router } = renderWithProviders({
      preloadedState: {
        baseUrlSlice: {
          baseUrl: 'http://localhost:2233/api/v1',
        },
      },
    });
    // initially
    expect(router.state.location.pathname).toBe('/');

    // after redirect
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });
  });

  it('Should land on login page, when not logged in and trying to access a protected route', async () => {
    // Arrange
    setAccessTokenToLocalStorage('some-inactive-token');
    const { router } = renderWithProviders({
      preloadedState: {
        baseUrlSlice: {
          baseUrl: 'http://localhost:2233/api/v1',
        },
      },
      initialEntries: ['/dashboard'], // a protected route
    });
    // initially
    expect(router.state.location.pathname).toBe('/dashboard');

    // after redirect
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });
  });

  it('Should land on dashboard page, when logged in and trying to access an inverse protected route', async () => {
    // Arrange
    setAccessTokenToLocalStorage('some-active-token');
    const { router } = renderWithProviders({
      preloadedState: {
        baseUrlSlice: {
          baseUrl: 'http://localhost:2233/api/v1',
        },
      },
      initialEntries: ['/login'], // an inverse protected route
    });
    // initially
    expect(router.state.location.pathname).toBe('/login');

    // after redirect
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/dashboard');
    });
  });

  it('Should land on login page, when not logged in and trying to access an invalid route', async () => {
    // Arrange
    setAccessTokenToLocalStorage('some-inactive-token');
    const { router } = renderWithProviders({
      preloadedState: {
        baseUrlSlice: {
          baseUrl: 'http://localhost:2233/api/v1',
        },
      },
      initialEntries: ['/invalid'], //  an invalid route
    });
    // initially
    expect(router.state.location.pathname).toBe('/invalid');

    // after redirect
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });
  });

  it('Should land on not found page, when logged in and trying to access an invalid route', async () => {
    // Arrange
    setAccessTokenToLocalStorage('some-active-token');
    const { router } = renderWithProviders({
      preloadedState: {
        baseUrlSlice: {
          baseUrl: 'http://localhost:2233/api/v1',
        },
      },
      initialEntries: ['/invalid'], // an invalid route
    });
    // initially
    expect(router.state.location.pathname).toBe('/invalid');

    // after redirect the url should have the wrong path
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/invalid');
    });

    // but the rendered component should be the not found
    await waitFor(() => {
      expect(screen.getByText('Not found!!')).toBeTruthy();
    });
  });
});

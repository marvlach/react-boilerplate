// Imports
import { act, fireEvent, screen, waitFor } from '@testing-library/react';

// import { act } from 'react-dom/test-utils';
import { describe, it } from 'vitest';
import renderWithProviders from '../testUtils';

// every test in this suite starts at /login, with a redux store with preloaded state
const initialTestState = {
  preloadedState: {
    baseUrlSlice: {
      baseUrl: 'http://localhost:2233/api/v1',
    },
  },
  initialEntries: ['/login'],
};

describe('Renders Login correctly', async () => {
  it('Should render Login correctly', async () => {
    // Arrange
    const { router } = renderWithProviders(initialTestState);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });

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

  it('Should disable submit button, when at least one empty field, else enable it', async () => {
    // Arrange
    renderWithProviders(initialTestState);

    // empty username, disables button
    // Arrange, Act, Assert
    await waitFor(() => {
      const usernameInput = screen.queryByTestId('username-input') as HTMLInputElement;
      const passwordInput = screen.queryByTestId('password-input') as HTMLInputElement;
      const submitButton = screen.queryByTestId('submit-button') as HTMLInputElement;
      fireEvent.change(usernameInput, { target: { value: '' } });
      fireEvent.change(passwordInput, { target: { value: 'something' } });
      expect(submitButton).toHaveProperty('disabled');
    });

    // empty password, disables button
    await waitFor(() => {
      const usernameInput = screen.queryByTestId('username-input') as HTMLInputElement;
      const passwordInput = screen.queryByTestId('password-input') as HTMLInputElement;
      const submitButton = screen.queryByTestId('submit-button') as HTMLInputElement;
      fireEvent.change(usernameInput, { target: { value: 'something' } });
      fireEvent.change(passwordInput, { target: { value: '' } });
      expect(submitButton).toHaveProperty('disabled');
    });

    // non empty fields, enables button
    await waitFor(() => {
      const usernameInput = screen.queryByTestId('username-input') as HTMLInputElement;
      const passwordInput = screen.queryByTestId('password-input') as HTMLInputElement;
      const submitButton = screen.queryByTestId('submit-button') as HTMLInputElement;
      fireEvent.change(usernameInput, { target: { value: 'something' } });
      fireEvent.change(passwordInput, { target: { value: 'something else' } });
      expect(submitButton).toHaveProperty('disabled', false);
    });
  });

  it('Should render a helpful message after username or password is erased', async () => {
    // Arrange
    const { container } = renderWithProviders(initialTestState);

    const usernameInput = (await waitFor(() => screen.getByTestId('username-input'))) as HTMLInputElement;
    const passwordInput = (await waitFor(() => screen.getByTestId('password-input'))) as HTMLInputElement;

    // Act: fill username and then erase it
    act(() => {
      fireEvent.change(usernameInput, { target: { value: 'some username' } });
      fireEvent.change(usernameInput, { target: { value: '' } });
    });

    // get the error message by id
    await waitFor(() => {
      // https://github.com/ant-design/ant-design/blob/master/components/form/__tests__/index.test.tsx
      expect(container.querySelector('#login_username_help')).toBeTruthy();
    });

    // Act: fill password and then erase it
    act(() => {
      fireEvent.change(passwordInput, { target: { value: 'some passwordInput' } });
      fireEvent.change(passwordInput, { target: { value: '' } });
    });

    // get the error message by id
    await waitFor(() => {
      // https://github.com/ant-design/ant-design/blob/master/components/form/__tests__/index.test.tsx
      expect(container.querySelector('#login_password_help')).toBeTruthy();
    });
  });

  it('Should rerender the helpful validation error message when language changes', async () => {
    // Arrange setup validation messages
    const { container } = renderWithProviders({
      preloadedState: {
        baseUrlSlice: {
          baseUrl: 'http://localhost:2233/api/v1',
        },
        languageSlice: {
          language: 'gr',
        },
      },
      initialEntries: ['/login'],
    });

    const usernameInput = (await waitFor(() => screen.getByTestId('username-input'))) as HTMLInputElement;
    const passwordInput = (await waitFor(() => screen.getByTestId('password-input'))) as HTMLInputElement;
    const languageSwitch = await waitFor(() => screen.getByTestId('language-switch'));

    // Act: fill username and then erase it
    act(() => {
      fireEvent.change(usernameInput, { target: { value: 'some username' } });
      fireEvent.change(usernameInput, { target: { value: '' } });
    });

    // get the error message by id
    await waitFor(() => {
      // https://github.com/ant-design/ant-design/blob/master/components/form/__tests__/index.test.tsx
      expect(container.querySelector('#login_username_help')).toBeTruthy();
      expect(container.querySelector('#login_username_help')?.textContent).toBe('Παρακαλώ εισάγετε το όνομα χρήστη!');
    });

    // Act: fill password and then erase it
    act(() => {
      fireEvent.change(passwordInput, { target: { value: 'some passwordInput' } });
      fireEvent.change(passwordInput, { target: { value: '' } });
    });

    // get the error message by id
    await waitFor(() => {
      // https://github.com/ant-design/ant-design/blob/master/components/form/__tests__/index.test.tsx
      expect(container.querySelector('#login_password_help')).toBeTruthy();
      expect(container.querySelector('#login_password_help')?.textContent).toBe(
        'Παρακαλώ εισάγετε το κωδικό πρόσβασης!'
      );
    });

    // CHANGE LANGUAGE
    act(() => {
      fireEvent.click(languageSwitch);
    });

    // verify that the error message has changed language
    await waitFor(() => {
      // https://github.com/ant-design/ant-design/blob/master/components/form/__tests__/index.test.tsx
      expect(container.querySelector('#login_username_help')?.textContent).toBe('Please input your username!');
    });

    // verify that the error message has changed language
    await waitFor(() => {
      // https://github.com/ant-design/ant-design/blob/master/components/form/__tests__/index.test.tsx
      expect(container.querySelector('#login_password_help')?.textContent).toBe('Please input your password!');
    });
  });

  it('Should submit form, with correct credentials and update store with token and redirect to /dashboard', async () => {
    // Arrange
    const { store, router } = renderWithProviders(initialTestState);
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });

    const usernameInput = (await waitFor(() => screen.queryByTestId('username-input'))) as HTMLInputElement;
    const passwordInput = (await waitFor(() => screen.queryByTestId('password-input'))) as HTMLInputElement;
    const submitButton = (await waitFor(() => screen.queryByTestId('submit-button'))) as HTMLInputElement;

    // Act
    act(() => {
      fireEvent.change(usernameInput, { target: { value: 'correct-username' } });
      fireEvent.change(passwordInput, { target: { value: 'correct-password' } });
      fireEvent.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(store.getState().userSlice.accessToken).toBe('valid-token');
      expect(router.state.location.pathname).toBe('/dashboard');
    });
  });

  it('Should submit form with wrong credentials and stay in login and display an alert message', async () => {
    // Arrange
    const { store, router } = renderWithProviders(initialTestState);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });
    const usernameInput = (await waitFor(() => screen.queryByTestId('username-input'))) as HTMLInputElement;
    const passwordInput = (await waitFor(() => screen.queryByTestId('password-input'))) as HTMLInputElement;
    const submitButton = (await waitFor(() => screen.queryByTestId('submit-button'))) as HTMLInputElement;
    const initialStoreToken = store.getState().userSlice.accessToken;

    // Act
    act(() => {
      fireEvent.change(usernameInput, { target: { value: 'wrong-username' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong-password' } });
      fireEvent.click(submitButton);
    });

    // Assert
    await waitFor(() => {
      expect(store.getState().userSlice.accessToken).toBe(initialStoreToken);
    });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login');
    });
    await waitFor(() => {
      expect(screen.getByTestId('error-alert')).toBeTruthy();
    });
  });
});

export const setAccessTokenToLocalStorage = (token: string) => {
  localStorage.setItem('token', token);
};

export const getAccessTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('token');
};

export const deleteAccessTokenFromLocalStorage = () => {
  localStorage.removeItem('token');
};

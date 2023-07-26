import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import InitialLoadingPage from './components/UI/InitialLoadingPage/InitialLoadingPage';
import routesConfig, { setupBrowserRouter } from './router/Routing';
import { fetchBaseUrlThunk } from './store/baseUrlSlice';
import type { Store } from './store/store';
import { useAppDispatch } from './store/store';

export default function App() {
  const appDispatch = useAppDispatch(); // useAppDispatch for asyncThunk
  const baseUrl = useSelector((store: Store) => store.baseUrlSlice.baseUrl);

  useEffect(() => {
    if (baseUrl === '') {
      appDispatch(fetchBaseUrlThunk());
    }
  }, [appDispatch, baseUrl]);

  if (baseUrl === '') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <InitialLoadingPage />
      </div>
    );
  }
  return <RouterProvider router={setupBrowserRouter(routesConfig)} />;
}

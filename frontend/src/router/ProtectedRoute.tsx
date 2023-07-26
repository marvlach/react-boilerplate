import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useLazyGetUserProfileQuery, useLazyGetUserQuery } from '../api/userApiSlice/userApiSlice';
import InitialLoadingPage from '../components/UI/InitialLoadingPage/InitialLoadingPage';
import { useAppSelector } from '../store/store.js';
import { userActions } from '../store/userSlice';

function ProtectedRoute({ outlet }: { outlet: React.ReactNode }) {
  const user = useAppSelector((store) => store.userSlice);
  const location = useLocation();
  const [getUser, { isLoading: getUserIsLoading, isError: getUserError }] = useLazyGetUserQuery();
  const [getUserProfile, { isLoading: getUserProfileIsLoading, isError: getUserProfileError }] =
    useLazyGetUserProfileQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseUser = await getUser().unwrap();
        dispatch(userActions.setUser(responseUser));
        const responseUserProfile = await getUserProfile().unwrap();
        dispatch(userActions.setUserProfile(responseUserProfile));
        dispatch(userActions.setUserIsAuth(true));
      } catch (error) {
        // error will redirect so we don't need to take any action
        // console.log('error', error);
      }
    };

    if (!user.isAuth) {
      fetchUser();
    }
  }, [user.isAuth, dispatch, getUser, getUserProfile]);

  if (user.isAuth) {
    return outlet || <Outlet />;
  }
  return (
    <>
      {(getUserError || getUserProfileError) && (
        <Navigate to="/login" replace state={{ from: location, unathorized: true }} />
      )}
      {(getUserIsLoading || getUserProfileIsLoading) && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <InitialLoadingPage />
        </div>
      )}
    </>
  );
}

export default ProtectedRoute;

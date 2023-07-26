import { ConfigProvider, Layout, theme } from 'antd';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { Store, useAppSelector } from '../../../store/store';
import MainHeader from '../MainHeader/MainHeader';
import MainSideBar from '../MainSideBar/MainSideBar';

const { Content } = Layout;

export default function ContextualLayout() {
  const user = useAppSelector((store) => store.userSlice);
  const currentTheme = useSelector((store: Store) => store.themeSlice.theme);

  return (
    <ConfigProvider
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ height: '100vh', width: '100vw' }}>
        <MainHeader />
        {!user.isAuth ? (
          <Content>
            <Outlet />
          </Content>
        ) : (
          <Layout hasSider>
            <MainSideBar />
            <Content>
              <Outlet />
            </Content>
          </Layout>
        )}
      </Layout>
    </ConfigProvider>
  );
}

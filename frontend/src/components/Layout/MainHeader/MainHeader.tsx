import { AlertOutlined, AlertTwoTone } from '@ant-design/icons';
import { Button, Layout, Switch } from 'antd';
import { useDispatch } from 'react-redux';
import logo from '../../../assets/react.svg';
import { languageActions } from '../../../store/languageSlice';
import { useAppSelector } from '../../../store/store';
import { themeActions } from '../../../store/themeSlice';
import { userActions } from '../../../store/userSlice';
import { deleteAccessTokenFromLocalStorage } from '../../../utils/localStorage';

const { Header } = Layout;

export default function MainHeader() {
  const dispatch = useDispatch();
  const user = useAppSelector((store) => store.userSlice);
  const currentTheme = useAppSelector((store) => store.themeSlice.theme);

  const handleLogout = () => {
    dispatch(userActions.logout());
    deleteAccessTokenFromLocalStorage();
  };

  const handleToggleTheme = () => {
    dispatch(themeActions.toggleTheme());
  };

  const handleToggleLanguage = () => {
    dispatch(languageActions.toggleLanguage());
  };

  // antd Header does not support theme prop
  const headerBackgroundColor = currentTheme === 'light' ? '#001529' : '#141414';
  /* Some other neutral colors to choose from
  #d9d9d9, #bfbfbf, #8c8c8c, #595959, #434343, #262626, #1f1f1f, #141414
  */

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: headerBackgroundColor,
      }}
    >
      <img src={logo} className="logo" alt="logo" />
      {user.isAuth && <Button onClick={handleLogout}>Logout</Button>}
      <div style={{ transform: 'rotate(-90deg)' }}>
        <Switch
          checkedChildren={<AlertOutlined />}
          unCheckedChildren={<AlertTwoTone />}
          onChange={handleToggleTheme}
          data-testid="theme-switch"
        />
      </div>
      <Switch
        checkedChildren="en"
        unCheckedChildren="gr"
        onChange={handleToggleLanguage}
        data-testid="language-switch"
      />
    </Header>
  );
}

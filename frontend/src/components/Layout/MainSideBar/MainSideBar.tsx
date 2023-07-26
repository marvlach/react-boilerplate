import { FileOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, MenuProps } from 'antd';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../../store/store';

type MenuItem = Required<MenuProps>['items'][number];

const { Sider } = Layout;

export default function MainSideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const currentTheme = useAppSelector((store) => store.themeSlice.theme);

  const menuItems: MenuItem[] = [
    {
      key: 'income',
      label: 'Income',
      icon: <PieChartOutlined />,
      children: [
        {
          key: 'income_all',
          label: <NavLink to="/income/all">All</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'income_report',
          label: <NavLink to="/income/report">Report</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'income_deficiencies',
          label: <NavLink to="/income/deficiencies">Deficiencies</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'income_to_send',
          label: <NavLink to="/income/to_send">To send</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'income_to_cancel',
          label: <NavLink to="/income/to_cancel">To cancel</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'income_sent',
          label: <NavLink to="/income/sent">Sent</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'income_cancelled',
          label: <NavLink to="/income/cancelled">Cancelled</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'income_from_aade',
          label: <NavLink to="/income/from_aade">From AADE</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'income_deviations_from_aade',
          label: <NavLink to="/income/deviations_from_aade">Deviations</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'income_omissions_from_aade',
          label: <NavLink to="/income/omissions_from_aade">Omissions</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'income_ignored',
          label: <NavLink to="/income/ignored">Ignored</NavLink>,
          icon: <PieChartOutlined />,
        },
      ],
    } as MenuItem,
    {
      key: 'expenses',
      label: 'Expenses',
      icon: <PieChartOutlined />,
      children: [
        {
          key: 'expenses_all',
          label: <NavLink to="/expenses/all">All</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'expenses_report',
          label: <NavLink to="/expenses/report">Report</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'expenses_deficiencies',
          label: <NavLink to="/expenses/deficiencies">Deficiencies</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'expenses_to_send',
          label: <NavLink to="/expenses/to_send">To send</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'expenses_to_cancel',
          label: <NavLink to="/expenses/to_cancel">To cancel</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'expenses_sent',
          label: <NavLink to="/expenses/sent">Sent</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'expenses_cancelled',
          label: <NavLink to="/expenses/cancelled">Cancelled</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'expenses_from_aade',
          label: <NavLink to="/expenses/from_aade">From AADE</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'expenses_deviations_from_aade',
          label: <NavLink to="/expenses/deviations_from_aade">Deviations</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'expenses_omissions_from_aade',
          label: <NavLink to="/expenses/omissions_from_aade">Omissions</NavLink>,
          icon: <PieChartOutlined />,
        },
        {
          key: 'expenses_ignored',
          label: <NavLink to="/expenses/ignored">Ignored</NavLink>,
          icon: <PieChartOutlined />,
        },
      ],
    } as MenuItem,
    {
      key: 'other',
      label: 'Other',
      icon: <PieChartOutlined />,
      children: [{ key: '3.1', label: 'Option 3.1', icon: <UserOutlined /> }],
    } as MenuItem,
    {
      key: 'settings',
      label: 'Settings',
      icon: <FileOutlined />,
      children: [{ key: '4.1', label: 'Option 4.1', icon: <TeamOutlined /> }],
    } as MenuItem,
  ];
  const sidebarTheme = currentTheme === 'dark' ? 'light' : 'dark';
  return (
    <Sider theme={sidebarTheme} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <Menu theme={sidebarTheme} defaultSelectedKeys={['1']} mode="inline" items={menuItems} />
    </Sider>
  );
}

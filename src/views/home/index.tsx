/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Switch } from 'antd';
import getItems from './sider/menuItem';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getMenuKeys, getRoutes } from './sider/getRoutes';
import './index.less'
import siderLogo from '@/assets/images/logo_name.svg';
import LayoutHeader from './header';
import RefreshToken from '../token';
const { Sider, Content, Footer } = Layout;
const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = getItems();
  const [selectKey, setSelectKey] = useState<string>()
  const [selectedKey, setSelectedKey] = useState(getMenuKeys(location.pathname));
  const [collapsed, setCollapsed] = useState(false);
  const [globaltheme, setGlobalTheme] = useState<'light' | 'dark'>('light');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (selectKey) {

      navigate(getRoutes(selectKey));
    }
    setIsDarkTheme(globaltheme === 'dark');
  }, [selectKey, globaltheme]);
  useEffect(() => {

    setSelectedKey(getMenuKeys(location.pathname));

  }, [location.pathname]);

  const changeTheme = (value: boolean) => {
    setGlobalTheme(value ? 'dark' : 'light');
  };

  return (
    <>
      <RefreshToken />
      <Layout>
        <Sider
          theme={globaltheme}
          trigger={null}
          collapsible
          collapsed={collapsed}
        // style={{ background: colorBgContainer }}
        >
          <div className="logo-container"
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'top', padding: '10px 0px'
            }}>
            <img src={siderLogo} style={{ width: '300px', marginTop: '-40px' }} />
          </div>
          <div
            style={{ margin: '-1vw 1.8vw' }}
          >
            <Switch onChange={changeTheme} /> {!collapsed && (<>模式切换</>)}
          </div>
          <br />
          <br />
          <Menu
            theme={globaltheme}
            mode='inline'
            onSelect={({ key }) => {
              setSelectKey(key);
            }}
            selectedKeys={[selectedKey]}
            // defaultSelectedKeys={['menu5']}
            items={items} />
          <Button
            type={isDarkTheme ? 'primary' : 'text'}
            icon={collapsed ? <MenuUnfoldOutlined rev={undefined} /> : <MenuFoldOutlined rev={undefined} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Sider>
        <Layout>
          <LayoutHeader />
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 500,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Graduation Design ©{new Date().getFullYear()} Created by Cheng xinxin
          </Footer>
        </Layout>

      </Layout>

    </>

  );
};

export default Home;

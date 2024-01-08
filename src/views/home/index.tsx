/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import { Layout, Menu, Button, theme, Switch } from 'antd';
import getItems from './sider/menuItem';
import { Outlet, useNavigate } from 'react-router-dom';
import { getRoutes } from './sider/getRoutes';
import './index.less'
import siderLogo from '@/assets/images/siderlogo.png';
import LayoutHeader from './header';

const { Sider, Content } = Layout;
const Home: React.FC = () => {
  const navigate = useNavigate()
  const items = getItems();
  const [selectKey, setSelectKey] = useState<string>()
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<'vertical' | 'inline'>('inline');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (selectKey) {
      navigate(getRoutes(selectKey));
    }
  }, [selectKey])

  const changeMode = (value: boolean) => {
    setMode(value ? 'vertical' : 'inline');
  };

  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: colorBgContainer }}>
          <div className="logo-container" style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '30px 0px'
          }}>
            <img src={siderLogo} style={{ width: '50px', height: '50px' }} />
          </div>
          <Switch onChange={changeMode} /> 模式切换
          <br />
          <br />
          <Menu
            theme='light'
            mode={mode}
            onSelect={({ key }) => {
              setSelectKey(key);
            }}
            defaultSelectedKeys={['1']}
            items={items} />
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined rev={undefined} /> : <MenuFoldOutlined rev={undefined} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }} />
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
        </Layout>

      </Layout>

    </>

  );
};

export default Home;

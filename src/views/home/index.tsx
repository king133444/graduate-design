/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useState } from 'react';
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
} from '@ant-design/icons';

import { Layout, Menu, Button, theme } from 'antd';
import getItems from './sider/menuItem';
import { Outlet, useNavigate } from 'react-router-dom';
import { getRoutes } from './sider/getRoutes';

const { Header, Sider, Content } = Layout;

const Home: React.FC = () => {
	const navigate = useNavigate()
	const items = getItems();
	const [selectKey, setSelectKey] = useState<string>()
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	useEffect(() => {
		if (selectKey) {
			navigate(getRoutes(selectKey));
		}
	}, [selectKey])
	return (
		<Layout>
			<Sider trigger={null} collapsible collapsed={collapsed} style={{ background: colorBgContainer }}>
				<div className="logo-container" style={{
					display: 'flex', alignItems: 'center',
					justifyContent: 'center', padding: '30px 0px'
				}}>
					<img src="src/assets/images/logo.png" alt="logo" style={{ width: '15%', height: 'auto' }} />
					<p style={{ textAlign: 'center', fontWeight: 'bold', margin: 0 }}>游乐园管理系统</p>
				</div>

				<Menu
					theme="light"
					mode="inline"
					onSelect={({ key }) => {
						setSelectKey(key)
					}}
					defaultSelectedKeys={['1']}
					items={items}
				/>
				<Button
					type="text"
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
				<Header style={{ padding: 0, background: colorBgContainer }}>

				</Header>
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

	);
};

export default Home;

import React from 'react';
import { Layout } from 'antd';
import Chart from './components/chart';

const { Content } = Layout;

const MainPage: React.FC = () => (
    <Layout className="layout">
        <Content style={{ padding: '0 50px' }}>

            <Chart />
        </Content>
    </Layout>
);

export default MainPage;

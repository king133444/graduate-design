import React from 'react';
import { Breadcrumb, Layout } from 'antd';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import { HomeOutlined } from '@ant-design/icons'
const { Content } = Layout;

const MainPage: React.FC = () => (
    <><div>
        <Breadcrumb
            items={[
                {
                    href: '#/home',
                    title: (
                        <>
                            <HomeOutlined rev={undefined} />
                            <span>主菜单</span>
                        </>
                    ),
                },
                {
                    // href: '', // 或者设置为空字符串，保持当前页面
                    title: (
                        <>

                            <span>可视化界面</span>
                        </>
                    ),
                },
            ]} />
    </div>
        <br />
        <Layout style={{ borderRadius: '10', backgroundColor: 'white' }}>
            <Content style={{ padding: '0 50px', borderRadius: '10' }}>
                <LineChart />
                <PieChart />
                <BarChart />
            </Content>
        </Layout></>
);

export default MainPage;

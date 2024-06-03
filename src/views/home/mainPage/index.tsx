import React from 'react';
import { Breadcrumb, Col, Layout, Row } from 'antd';
import { HomeOutlined } from '@ant-design/icons'
import UserStatistics from './UserStatistics/userStatistics.tsx';
import DeviceStatus from './DeviceStatus/deviceStatus.js';
import TicketSales from './TicketSales/ticketSales.js';
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
        <Layout style={{ borderRadius: '10px', backgroundColor: 'white', overflow: 'auto', height: '70vh' }}>
            <Content style={{ padding: '0 50px', borderRadius: '10px' }}>
                <Row gutter={16} style={{ marginBottom: '20px' }}>
                    <Col span={12}>
                        <UserStatistics />
                    </Col>
                    <Col span={12}>
                        <DeviceStatus />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <TicketSales />
                    </Col>
                </Row>
            </Content>
        </Layout>
    </>
);

export default MainPage;

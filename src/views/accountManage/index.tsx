import { Breadcrumb, Table } from 'antd';

const AccountManagement = () => {
    const dataSource = [
        {
            key: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'Admin',
        },
        {
            key: '2',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            role: 'User',
        },
        {
            key: '3',
            name: 'Jim Doe',
            email: 'jim.doe@example.com',
            role: 'User',
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
    ];

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item>主页面</Breadcrumb.Item>
                <Breadcrumb.Item>账户管理</Breadcrumb.Item>
            </Breadcrumb>
            <Table dataSource={dataSource} columns={columns} />
        </div>
    );
};

export default AccountManagement;

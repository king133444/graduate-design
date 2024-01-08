import { Breadcrumb, Table } from 'antd';
import { HomeOutlined } from '@ant-design/icons'
const RoleManagement = () => {
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

                                <span>角色管理</span>
                            </>
                        ),
                    },
                ]}
            />
            <Table dataSource={dataSource} columns={columns} />
        </div>
    );
};

export default RoleManagement;

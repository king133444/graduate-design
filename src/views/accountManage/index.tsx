import React, { useState, useEffect } from 'react';
import { Breadcrumb, Table, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import api from '../../api/index';
import { ColumnsType } from 'antd/es/table';

const AccountManagement = () => {
    const [data, setData] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);

    useEffect(() => {
        setTableLoading(true);
        const getUsers = async () => {
            try {
                const result: any = await api.GetUsers({});
                console.log(result);

                const { success, data, message: info } = result
                if (success) {
                    setData(data.users);
                } else {
                    message.error(info)
                }
            } catch (error) {
                message.error('获取失败')
            } finally {
                setTableLoading(false);
            }
        };

        getUsers();
    }, []); // 空数组确保 useEffect 仅在组件挂载时执行

    const columns: ColumnsType<any> = [
        {
            title: '序号',
            dataIndex: 'id',
            align: 'center',
            key: 'id',
            render: (_text, record, index) => {
                if (record) return index + 1;
            },
        },
        {
            title: '姓名',
            dataIndex: 'name',
            align: 'center',
            key: 'name',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            align: 'center',
            key: 'email',
        },
        {
            title: '角色',
            dataIndex: 'role',
            align: 'center',
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
                        title: (
                            <>
                                <span>账号管理</span>
                            </>
                        ),
                    },
                ]}
            />
            <br />
            <Table
                rowKey="id"
                dataSource={data}
                columns={columns}
                loading={tableLoading}
            />
        </div>
    );
};

export default AccountManagement;

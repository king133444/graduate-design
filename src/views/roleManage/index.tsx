import './styles/styles.less'

import { Breadcrumb, Table, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons'
import api from '@/api';
import { useEffect, useState } from 'react';
const RoleManagement = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [tableLoading, setTableLoading] = useState(false);
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'id',
      align: 'center',
      key: 'id',
    },
    {
      title: '角色名',
      dataIndex: 'name',
      align: 'center',
      key: 'role',
    },
  ];

  // 获取用户列表信息
  const getRoles = async () => {
    try {
      const result: any = await api.GetRoles({});
      console.log(result);

      const { success, data, message: info } = result
      if (success) {
        setData(data.roles);
        setTotal(data.total);
      } else {
        message.error(info)
      }
    } catch (error) {
      message.error('获取失败')
    } finally {
      setTableLoading(false);
    }
  };
  useEffect(() => {
    setTableLoading(true);
    getRoles();
  }, []);
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
      <br />
      <Table
        className='custom-table'
        loading={tableLoading}
        bordered={true}
        dataSource={data}
        columns={columns}
        scroll={{ y: 240 }}
        pagination={
          {
            total: total,
            showTotal: (total) => `总共 ${total} 条数据`,
            defaultPageSize: 5,
            defaultCurrent: 1
          }}
      />

    </div>
  );
};

export default RoleManagement;

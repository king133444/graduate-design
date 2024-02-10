import React, { useState, useEffect } from 'react';
import { Breadcrumb, Form, Input, Modal, Space, Table, message } from 'antd';
import { HomeOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import api from '../../api/index';
import { ColumnsType } from 'antd/es/table';

const AccountManagement = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState<number>();
  const [tableLoading, setTableLoading] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);

  // 获取用户列表信息
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
  // 修改框
  const showEditModal = async (_text: any, record: any) => {
    setEditId(record.id);
    form.setFieldsValue({
      name: record.name,
      password: record.password
    })
    setVisibleEdit(true);
  };
  // 删除框
  const showDeleteEditModal = (_text: any, record: any) => {
    // 打开删除弹窗
    setVisibleDelete(true);
    setEditId(record.id);

  };
  // 确认修改
  const handleEdit = async () => {
    await form.validateFields();
    try {
      const user = {
        id: editId,
        name: form.getFieldValue('name'),
        password: form.getFieldValue('password')
      }
      const result: any = await api.UpdateUser(user);
      const { success, message: info } = result;
      if (success) {
        message.success('修改用户成功');
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setVisibleEdit(false);
      getUsers();
      form.resetFields();
    }
  };
  const handleCancle = () => {
    setVisibleEdit(false);
    form.resetFields();
  }
  useEffect(() => {
    setTableLoading(true);
    getUsers();
  }, []);

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
      title: '用户名',
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
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (_text, record) => (
        <Space size="large">
          <a
            onClick={() => {
              showEditModal(_text, record);
            }}
          >
            修改
          </a>
          <a
            onClick={() => {
              showDeleteEditModal(_text, record);
            }}
          >
            删除
          </a>
        </Space>
      ),
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
      <Modal
        title='修改用户'
        onOk={handleEdit}
        open={visibleEdit}
        onCancel={handleCancle}
      >
        <Form
          title='修改'
          form={form}
        >
          <Form.Item
            label="账号："
            name="name"
            rules={[
              {
                required: true,
                message: '请输入账号',
              },
            ]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>
          <Form.Item
            label="密码："
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
              // {
              //   min: 8,
              //   message: '密码不能小于8位字符',
              // },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

        </Form>
      </Modal>
      <Modal
        title={
          <Space>
            <ExclamationCircleTwoTone rev={undefined} />
            删除用户
          </Space>
        }
        open={visibleDelete}
        // onOk={handleOkDeleteUser}
        onCancel={() => { setVisibleDelete(false) }}
        okText="确定"
        cancelText="取消"

      >
        删除该用户信息，您确认要删除嘛？
      </Modal>
    </div>
  );
};

export default AccountManagement;

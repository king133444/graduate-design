import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Form, Input, Modal, Select, Space, Table, message } from 'antd';
import { HomeOutlined, ExclamationCircleTwoTone, UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../../api/index';
import { ColumnsType } from 'antd/es/table';

const VisitorManage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [editId, setEditId] = useState<number>();
  const [tableLoading, setTableLoading] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // 获取用户列表信息
  const getUsers = async () => {
    try {
      const result: any = await api.GetTourists({});
      console.log(result);

      const { success, data, message: info } = result
      if (success) {
        setData(data.users);
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
  const showDeleteModal = (_text: any, record: any) => {
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
  const handleSubmit = async () => {
    const { username, password, confirm, email, role } = form.getFieldsValue();
    if (password !== confirm) {
      form.setFields([
        {
          name: 'confirm',
          errors: ['密码和确认密码不一致'],
        },
      ]);
      return;
    }
    try {
      setLoading(true);
      const result: any = await api.Signup({
        name: username,
        password,
        email: email,
        roleId: role,
      })
      const { success } = result;

      if (success) {
        message.success("注册成功！");
      } else {
        message.error('注册失败')
      }
    } catch (error) {
      message.error('注册失败')
    } finally {
      setLoading(false);
    }
  };
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
      title: '余额',
      dataIndex: 'balance',
      align: 'center',
      key: 'balance',
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
              showDeleteModal(_text, record);
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                  <span>游客管理</span>
                </>
              ),
            },
          ]}
        />
        <Button
          onClick={() => {
            setVisibleAdd(true);
          }}
        >添加用户
        </Button>
      </div>
      <br />
      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        loading={tableLoading}
        bordered={true}
        scroll={{ y: 240 }}
        pagination={
          {
            total: total,
            showTotal: (total) => `总共 ${total} 条数据`,
            defaultPageSize: 5,
            defaultCurrent: 1
          }}
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
      <Modal
        open={visibleAdd}
        okText='注册'
        confirmLoading={loading}
        onCancel={() => { setVisibleAdd(false) }}
        onOk={handleSubmit}
      >
        <Form
          form={form}
          layout="vertical"
          name="basic"
          labelCol={{ span: 8 }}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          size="large"
          autoComplete="on"
          requiredMark={false}
          colon={false}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
            style={{ marginBottom: '10px' }}
          >
            <Input placeholder="请输入用户名" prefix={<UserOutlined rev={undefined} />} />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
            style={{ marginBottom: '10px' }}
          >
            <Input.Password autoComplete="new-password" placeholder="请输入密码" prefix={<LockOutlined rev={undefined} />} />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="确认密码"
            rules={[{ required: true, message: '请确认密码' }]}
            style={{ marginBottom: '10px' }}
          >
            <Input.Password autoComplete="new-password" placeholder="输入确认密码" prefix={<LockOutlined rev={undefined} />} />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            // rules={[{ required: true, message: '请输入邮箱' }]}
            style={{ marginBottom: '10px' }}
          >
            <Input placeholder="请输入邮箱（选填）" prefix={<UserOutlined rev={undefined} />} />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
            style={{ marginBottom: '10px' }}
          >
            <Select
              defaultValue={1}
              style={{ width: 240 }}
              options={[
                { value: 1, label: '管理员' },
                { value: 2, label: '经理' },
                { value: 7, label: '游客' },
                { value: 3, label: '维修人员' },
                { value: 4, label: '检查人员' },
                { value: 5, label: '采购人员' },
                { value: 6, label: '设备供应商' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VisitorManage;

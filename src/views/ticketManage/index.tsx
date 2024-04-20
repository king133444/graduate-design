import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Form, Input, InputNumber, Modal, Select, Space, Table, message } from 'antd';
import { HomeOutlined, ExclamationCircleTwoTone, UserOutlined, LockOutlined } from '@ant-design/icons';
import api from '../../api/index';
import dayjs from 'dayjs';
import { ColumnsType } from 'antd/es/table';

const TicketManage = () => {
  let id = sessionStorage.getItem('id');
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [editId, setEditId] = useState<number>();
  const [price, setPrice] = useState<number>();
  const [tableLoading, setTableLoading] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // 获取用户列表信息
  const getAllTickets = async () => {
    try {
      const result: any = await api.GetAllTickets({});
      console.log(result);

      const { success, data, message: info } = result
      if (success) {
        setData(data.tickets);
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
  const showReserveModal = async (_text: any, record: any) => {
    setEditId(record.id);
    setPrice(record.price);
    form.setFieldsValue({
      tickets: record.description,
    })
    setVisibleEdit(true);
  };
  // 删除框
  const showDeleteModal = (_text: any, record: any) => {
    // 打开删除弹窗
    setVisibleDelete(true);
    setEditId(record.id);

  };
  // 确认购买
  const handlePurchase = async () => {
    await form.validateFields();
    try {
      const params = {
        userId: id ? parseInt(id) : '',
        ticketId: editId,
        price: price,
        quantity: form.getFieldValue('quantity')
      }
      const result: any = await api.BuyTickets(params);
      const { success, message: info } = result;
      if (success) {
        message.success('购买成功');
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setVisibleEdit(false);
      getAllTickets();
      form.resetFields();
    }
  };
  const handleCancle = () => {
    setVisibleEdit(false);
    form.resetFields();
  }
  useEffect(() => {
    setTableLoading(true);
    getAllTickets();
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
      title: '项目',
      dataIndex: 'description',
      align: 'center',
      key: 'description',
    },
    {
      title: '余量',
      dataIndex: 'type',
      align: 'center',
      key: 'type',
      render: (_text: any) => {
        return _text === '1' ? '有余' : '无';
      }
    },
    {
      title: '票价',
      dataIndex: 'price',
      align: 'center',
      key: 'price',
    },
    {
      title: '有效时间',
      dataIndex: 'validity',
      align: 'center',
      key: 'validity',
      render: (_text: any, record: any) => {
        if (record.validity === undefined) {
          return '--';  // 返回默认值
        }
        const openingDate = dayjs(record.validity);
        // 格式化日期和时间
        const openingTimeFormatted = openingDate.format('YYYY-MM-DD HH:mm:ss');
        return `${openingTimeFormatted}`;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (_text, record) => (
        <Space size="large">
          <a
            onClick={() => {
              showReserveModal(_text, record);
            }}
          >
            预定
          </a>
          <a
            onClick={() => {
              showDeleteModal(_text, record);
            }}
          >
            退回
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
                  <span>门票管理</span>
                </>
              ),
            },
          ]}
        />
        <Button
          onClick={() => {
            setVisibleAdd(true);
          }}
        >票种
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
        title='预定'
        onOk={handlePurchase}
        open={visibleEdit}
        onCancel={handleCancle}
        width={280}
      >
        <Form
          title='预定'
          form={form}
        >
          <Form.Item
            label="门票："
            name="tickets"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="数量："
            name="quantity"
          >
            <InputNumber
              min={0}
              style={{ width: '10vw' }}
              placeholder="请输入数量" />
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

export default TicketManage;

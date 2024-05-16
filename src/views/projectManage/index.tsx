import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Breadcrumb, Radio, DatePicker, Layout } from 'antd';
import { PlusOutlined, HomeOutlined, ExclamationCircleTwoTone } from '@ant-design/icons';
import api from '@/api';
import dayjs from 'dayjs';
// import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
const { Content } = Layout;
type Attraction = {
  id?: number,
  name?: string,
  type?: string,
  description?: string,
  openingTime?: string | number,
  closingTime?: string | number,
  status?: string,
}
const ProjectManage = () => {
  // 表单实例
  const [form] = Form.useForm();
  const [tableLoading, setTableLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 表格数据
  const [projects, setProjects] = useState<Attraction[]>([]);
  const [total, setTotal] = useState();
  const [convert, setConvert] = useState(false);
  // const [defaultValue, setDefaultValues] = useState<any>([]);
  // 删除
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [editId, setEditId] = useState<number>();
  // 获取用户列表信息
  const getAttractions = async () => {
    try {
      const result: any = await api.GetAllAttractions({});

      const { success, data, message: info } = result
      if (success) {
        setProjects(data.attraction);
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
    getAttractions();
  }, []);
  const disabledTime = () => {
    const current = dayjs();
    const hours = current.hour();
    const minutes = current.minute();
    return {
      disabledHours: () => [...Array(hours).keys()],
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === hours) return [...Array(minutes).keys()];
        return [];
      },
    };
  };
  const handleEdit = (record: Attraction) => {
    setConvert(false);
    // if (typeof record?.openingTime === 'string' && typeof record?.closingTime === 'string') {
    //   const openingDate = new Date(record.openingTime);
    //   const closingDate = new Date(record.closingTime);
    //   setDefaultValues([openingDate, closingDate]);
    // }

    form.setFieldsValue({
      id: record.id,
      name: record.name,
      type: record.type,
      description: record.description,
      openingTime: [
        record.openingTime ? dayjs(record.openingTime) : null,
        record.closingTime ? dayjs(record.closingTime) : null
      ],
      status: record.status
    });
    setIsModalVisible(true);

  };
  const handleAdd = () => {
    setConvert(true);
    form.resetFields();
    setIsModalVisible(true);
  };
  const handleOk = async () => {
    await form.validateFields();
    const data = form.getFieldsValue();
    const params: Attraction = {
      name: data.name || null,
      type: data.type || null,
      description: data.description || null,
      openingTime: data.openingTime[0] || null,
      closingTime: data.openingTime[1] || null,
      status: data.status || null
    }
    if (convert) {
      try {
        const result: any = await api.CreateAttractions(params);
        if (result.success) {
          message.success('添加成功');
          getAttractions();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsModalVisible(false);
      }
    } else {
      try {
        params.id = data.id;
        const result: any = await api.UpdateAttraction(params);
        console.log('re', result);

        if (result.success) {
          message.success('修改成功');
          getAttractions();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsModalVisible(false);
      }
    }
  };
  const showDeleteModal = (record: any) => {
    // 打开删除弹窗
    setVisibleDelete(true);
    setEditId(record.id);

  };
  const handleDelete = async () => {
    try {
      const result: any = await api.DeleteAttraction({
        id: editId,
      });
      const { success, message: info } = result;
      if (success) {
        message.success('删除成功');
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setVisibleDelete(false);
      getAttractions();
      form.resetFields();
    }
  };
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'id',
      align: 'center',
      key: 'id',
      render: (_text: any, record: any, index: number) => {
        if (record) return index + 1;
      }
    },
    {
      title: '项目名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
      key: 'type',
      render: (record: any) => {
        switch (record) {
          case '1':
            return '惊险刺激';
          case '2':
            return '适中';
          default:
            return '未知';
        }
      }
    },
    {
      title: '开放时间',
      align: 'center',
      width: '30%',
      render: (_text: any, record: any) => {
        if (!record.openingTime || !record.closingTime) {
          return '--';  // 返回默认值
        }
        // 解析日期
        const openingDate = new Date(record.openingTime);
        const closingDate = new Date(record.closingTime);

        const openingTimeFormatted = dayjs(openingDate).format('YYYY-MM-DD HH:mm:ss');
        const closingTimeFormatted = dayjs(closingDate).format('YYYY-MM-DD HH:mm:ss');
        // setStarttime(openingTimeFormatted);
        // setEndtime(closingTimeFormatted);
        return `${openingTimeFormatted} - ${closingTimeFormatted}`;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (record: any) => {
        switch (record) {
          case '1':
            return '可用';
          case '0':
            return '不可用';
          default:
            return '--'
        }
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      align: 'center',
      render: (_: any, record: Attraction) => (
        <Space size="large">
          <a
            onClick={() => {
              handleEdit(record);
            }}
          >
            修改
          </a>
          <a
            onClick={() => {
              showDeleteModal(record);
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Layout style={{ borderRadius: '10', backgroundColor: 'white', overflow: 'auto', height: '70vh' }}>
        <Content style={{ padding: '0 50px', borderRadius: '10' }}>
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

                    <span>项目管理</span>
                  </>
                ),
              },
            ]}
          />
          <br />
          <Button
            type="primary"
            size='middle'
            icon={<PlusOutlined rev={undefined} />} onClick={handleAdd}>
            新增
          </Button>
          <br />
          <br />
          <Table
            columns={columns}
            dataSource={projects}
            rowKey="id"
            bordered={true}
            loading={tableLoading}
            pagination={
              {
                total: total,
                showTotal: (total) => `总共 ${total} 条数据`,
                defaultPageSize: 5,
                defaultCurrent: 1
              }}
          />
          <Modal
            title={convert ? '新增' : '修改'}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={() => setIsModalVisible(false)}
          >
            <Form form={form} layout="vertical" name="form_in_modal">
              <Form.Item
                name="id"
                style={{ display: 'none' }}
              >

              </Form.Item>
              <Form.Item
                name="name"
                label="项目名"
                rules={[{ required: true, message: '请输入项目名' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="type"
                label="类型"
                rules={convert ? [{ required: true, message: '请选择类型' }] : []}
              >
                <Radio.Group>
                  <Radio value='1'>惊险刺激</Radio>
                  <Radio value='2'>适中</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="description"
                label="描述"
                rules={convert ? [{ required: true, message: '请输入项目描述' }] : []}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="openingTime"
                label="开放时间"
                rules={convert ? [{ required: true, message: '请选择开始时间' }] : []}
              >
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  // defaultValue={defaultValue}
                  // disabled={disabledTime}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  disabledTime={disabledTime}

                />
              </Form.Item>
              <Form.Item
                name="status"
                label="状态"
                rules={convert ? [{ required: true, message: '请选择状态' }] : []}
              >
                <Radio.Group>
                  <Radio value='0'>不可用</Radio>
                  <Radio value='1'>可用</Radio>
                </Radio.Group>

              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title={
              <Space>
                <ExclamationCircleTwoTone rev={undefined} />
                删除项目
              </Space>
            }
            open={visibleDelete}
            onOk={handleDelete}
            onCancel={() => { setVisibleDelete(false) }}
            okText="确定"
            cancelText="取消"

          >
            确认是否删除？
          </Modal>
        </Content>
      </Layout>
    </>

  );
};

export default ProjectManage;

import React, { useEffect, useState } from 'react';
import { Table, Breadcrumb, Layout, message, Modal, Rate, Button, Col, Row, Form, Input, Popover } from 'antd';
import { HomeOutlined } from '@ant-design/icons'
import api from '@/api';
import dayjs from 'dayjs'

const { Content } = Layout;
type Express = {
  userId: number | null,
  content: string,
  rate: number,
  time: Date,
}
const CommentManage = () => {
  let id = sessionStorage.getItem('id');
  const [form] = Form.useForm();
  const [comments, setComments] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [visibleExpress, setVisibleExpress] = useState(false);
  const [total, setTotal] = useState();

  const getCommtents = async () => {
    try {
      const result: any = await api.GetComments({});

      const { success, data, message: info } = result
      if (success) {
        setComments(data.comments);
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
  function showDeleteModal(id: number) {
    Modal.confirm({
      title: '请确认操作',
      // 使用箭头函数传递ticketId
      onOk: () => handleDelete(id),
    });
  }
  const handleDelete = async (id: number) => {

    try {
      const result: any = await api.DeleteComments({
        id: id,
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
      getCommtents();
    }
  };
  const handleExpress = async () => {
    await form.validateFields();
    const data = form.getFieldsValue();
    const params: Express = {
      userId: id ? parseInt(id) : null,
      content: data.content,
      rate: data.rate,
      time: new Date(),
    }

    try {
      const result: any = api.CreateComment(params);
      if (result.success) {
        message.success('发表成功');
        setTimeout(() => {
          getCommtents();
        }, 1000)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setVisibleExpress(false);
      getCommtents();
    }
  }
  useEffect(() => {
    getCommtents();
  }, []);

  const columns: any = [
    {
      title: '用户',
      key: 'user',
      align: 'center',
      render: (record: any) => {
        return record.user.name;
      }
    },
    {
      title: '评论',
      dataIndex: 'content',
      key: 'content',
      align: 'center',
      // ellipsis: true,
      render: (text: string) => (
        <Popover content={text} placement="top">
          {text}
        </Popover>
      ),
    },
    {
      title: '日期',
      dataIndex: 'time',
      key: 'time',
      align: 'center',
      ellipsis: true,
      render: (_text: any) => {
        if (_text === undefined) {
          return '--';  // 返回默认值
        }
        const openingDate = dayjs(_text);
        // 格式化日期和时间
        const openingTimeFormatted = openingDate.format('YYYY-MM-DD HH:mm:ss');
        return `${openingTimeFormatted}`;
      },
    },
    {
      title: '评分',
      dataIndex: 'rate',
      key: 'rate',
      align: 'center',
      render: (record: any) => {
        return <Rate disabled defaultValue={record} />
      }
    },
    {
      title: '操作',
      dataIndex: '',
      key: 'x',
      align: 'center',
      render: (_: any, record: { id: any; }) => (
        <a onClick={() => showDeleteModal(record.id)}>删除</a>
      ),
    },
  ];

  return (
    <>
      <Layout style={{ borderRadius: '10', backgroundColor: 'white', overflow: 'auto', height: '70vh' }}>
        <Content style={{ padding: '0 50px', borderRadius: '10' }}>
          <Row justify={'space-between'}>
            <Col>
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
                        <span>留言管理</span>
                      </>
                    ),
                  },
                ]}
              />
              <br />
            </Col>
            <Col>
              <Button
                onClick={() => setVisibleExpress(true)}
              >
                发表
              </Button>
            </Col>
          </Row>
          <Table
            loading={tableLoading}
            columns={columns}
            dataSource={comments}
            bordered={true}

            pagination={
              {
                total: total,
                showTotal: (total) => `总共 ${total} 条数据`,
                defaultPageSize: 5,
                defaultCurrent: 1
              }}
            rowKey="id" />
          <Modal
            title='请留下您的感受'
            open={visibleExpress}
            onOk={handleExpress}
            onCancel={() => { setVisibleExpress(false); }}

          >
            <Form form={form}>

              <Form.Item
                name="rate"
                label="评分"
                rules={[{ required: true, message: '请输入' }]}
                initialValue={3}
              >
                <Rate />
              </Form.Item>
              <Form.Item
                label="留言"
                name='content'
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input.TextArea placeholder='您的建议和意见将使我们不断改进提高服务质量' />
              </Form.Item>
            </Form>

          </Modal>
        </Content>
      </Layout>
    </>
  );
};

export default CommentManage;

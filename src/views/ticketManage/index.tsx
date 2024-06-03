import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Row,
  Select,
  Space,
  Table,
  message
} from "antd";
import { HomeOutlined, ExclamationCircleTwoTone, UserOutlined, FileAddOutlined } from "@ant-design/icons";
import api from "../../api/index";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
const { Content } = Layout;
const gridStyle: React.CSSProperties = {
  width: "50%", // 一行显示两列
  textAlign: "left", // 文本左对齐
  display: "flex", // 使用Flex布局
  justifyContent: "space-between", // 在项目之间添加空间
  padding: "8px" // 可以根据需要调整内边距
};
const gridSingleStyle: React.CSSProperties = {
  width: "100%", // 一行显示两列
  textAlign: "left", // 文本左对齐
  display: "flex", // 使用Flex布局
  justifyContent: "space-between", // 在项目之间添加空间
  padding: "8px" // 可以根据需要调整内边距
};
const TicketManage = () => {
  let id = sessionStorage.getItem("id");
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [userInfo, setUserInfo] = useState<any>([]);
  const [total, setTotal] = useState();
  const [editId, setEditId] = useState<number>();
  const [price, setPrice] = useState<number>();
  const [tableLoading, setTableLoading] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
  const [myInfoVisible, setMyInfoVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const disabledTime = () => {
    const current = moment();
    const hours = current.hour();
    const minutes = current.minute();
    return {
      disabledHours: () => [...Array(hours).keys()],
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === hours) return [...Array(minutes).keys()];
        return [];
      }
    };
  };
  // 获取用户列表信息
  const getAllTickets = async () => {
    try {
      const result: any = await api.GetAllTickets({});

      const { success, data, message: info } = result;
      if (success) {
        setData(data.tickets);
        setTotal(data.total);
      } else {
        message.error(info);
      }
    } catch (error) {
      message.error("获取失败");
    } finally {
      setTableLoading(false);
    }
  };
  // 获取用户列表信息
  const getMyUser = async () => {
    try {
      const result: any = await api.GetMyUser({
        id: id ? parseInt(id) : null
      });
      console.log(result);

      const { success, data, message: info } = result;
      if (success) {
        setUserInfo(data.data.tickets);
      } else {
        message.error(info);
      }
    } catch (error) {
      message.error("获取失败");
    } finally {
      setTableLoading(false);
    }
  };
  // 修改框
  const showReserveModal = async (_text: any, record: any) => {
    setEditId(record.id);
    setPrice(record.price);
    form.setFieldsValue({
      tickets: record.description
    });
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
        userId: id ? parseInt(id) : "",
        ticketId: editId,
        price: price,
        quantity: form.getFieldValue("quantity")
      };
      const result: any = await api.BuyTickets(params);
      const { success, message: info } = result;
      if (success) {
        message.success("购买成功");
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
  // 退票

  function showRefundModal(ticketId: string) {
    Modal.confirm({
      title: "确定要退票吗？",
      // 使用箭头函数传递ticketId
      onOk: () => handleRefund(ticketId)
    });
  }

  const handleRefund = async (ticketId: string) => {
    try {
      const params = {
        userId: id ? parseInt(id) : "",
        ticketPurchaseId: ticketId
      };
      const result: any = await api.refundTickets(params);
      const { success, message: info } = result;
      if (success) {
        message.success("退票成功");
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      getMyUser();
      getAllTickets();
      form.resetFields();
    }
  };
  const handleCancle = () => {
    setVisibleEdit(false);
    form.resetFields();
  };
  useEffect(() => {
    setTableLoading(true);
    getAllTickets();
  }, []);
  const handleSubmit = async () => {
    const { description, validity, price, quantity, type } = form.getFieldsValue();

    try {
      setLoading(true);
      const result: any = await api.CreateTicket({
        description,
        validity,
        price,
        quantity,
        type
      });
      const { success } = result;

      if (success) {
        message.success("添加门票成功！");
      } else {
        message.error("添加失败");
      }
    } catch (error) {
      message.error("添加失败");
    } finally {
      setLoading(false);
      setVisibleAdd(false);
      getAllTickets();
    }
  };
  const columns: ColumnsType<any> = [
    {
      title: "序号",
      dataIndex: "id",
      align: "center",
      key: "id",
      render: (_text, record, index) => {
        if (record) return index + 1;
      }
    },
    {
      title: "项目",
      dataIndex: "description",
      align: "center",
      key: "description"
    },
    {
      title: "状态",
      dataIndex: "type",
      align: "center",
      key: "type",
      render: (_text: any) => {
        return _text === "1" ? "可用" : "不可用";
      }
    },
    {
      title: "票价",
      dataIndex: "price",
      align: "center",
      key: "price"
    },
    {
      title: "有效时间",
      dataIndex: "validity",
      align: "center",
      key: "validity",
      render: (_text: any, record: any) => {
        if (record.validity === undefined) {
          return "--"; // 返回默认值
        }
        const openingDate = dayjs(record.validity);
        // 格式化日期和时间
        const openingTimeFormatted = openingDate.format("YYYY-MM-DD HH:mm:ss");
        return `${openingTimeFormatted}`;
      }
    },
    {
      title: "操作",
      dataIndex: "operation",
      align: "center",
      render: (_text, record) => (
        <Space size="large">
          <a
            onClick={() => {
              showReserveModal(_text, record);
            }}
          >
            预订
          </a>
          <a
            onClick={() => {
              showDeleteModal(_text, record);
            }}
          >
            删除
          </a>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Layout style={{ borderRadius: "10", backgroundColor: "white", overflow: "auto", height: "70vh" }}>
        <Content style={{ padding: "0 50px", borderRadius: "10" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Breadcrumb
              items={[
                {
                  href: "#/home",
                  title: (
                    <>
                      <HomeOutlined rev={undefined} />
                      <span>主菜单</span>
                    </>
                  )
                },
                {
                  title: (
                    <>
                      <span>门票管理</span>
                    </>
                  )
                }
              ]}
            />
            <div>
              {" "}
              <Button
                style={{ marginRight: "10px" }}
                onClick={() => {
                  setVisibleAdd(true);
                }}
              >
                <FileAddOutlined rev={undefined} />
                增加票种
              </Button>
              <Button
                onClick={() => {
                  setMyInfoVisible(true);
                  getMyUser();
                }}
              >
                我的信息
              </Button>
            </div>
          </div>
          <br />
          <Table
            rowKey="id"
            dataSource={data}
            columns={columns}
            loading={tableLoading}
            bordered={true}
            scroll={{ y: 240 }}
            pagination={{
              total: total,
              showTotal: total => `总共 ${total} 条数据`,
              defaultPageSize: 5,
              defaultCurrent: 1
            }}
          />
          <Modal title="预订" onOk={handlePurchase} open={visibleEdit} onCancel={handleCancle} width={280}>
            <Form title="预订" form={form}>
              <Form.Item label="门票：" name="tickets">
                <Input disabled />
              </Form.Item>
              <Form.Item label="数量：" name="quantity">
                <InputNumber min={1} style={{ width: "10vw" }} placeholder="请输入数量" />
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
            onCancel={() => {
              setVisibleDelete(false);
            }}
            okText="确定"
            cancelText="取消"
          >
            删除该用户信息，您确认要删除嘛？
          </Modal>
          <Modal
            open={visibleAdd}
            confirmLoading={loading}
            onCancel={() => {
              setVisibleAdd(false);
            }}
            onOk={handleSubmit}
            maskClosable={false}
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
                label="项目名"
                name="description"
                rules={[{ required: true, message: "请输入项目名" }]}
                style={{ marginBottom: "10px" }}
              >
                <Input placeholder="项目名" prefix={<UserOutlined rev={undefined} />} />
              </Form.Item>
              <Form.Item name="validity" label="开放时间" rules={[{ required: true, message: "请选择开始时间" }]}>
                <DatePicker
                  showTime={{ format: "HH:mm" }}
                  format="YYYY-MM-DD HH:mm"
                  // defaultValue={defaultValue}
                  // disabled={disabledTime}
                  disabledDate={current => current && current < moment().startOf("day")}
                  disabledTime={disabledTime}
                />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="票价"
                    name="price"
                    // rules={[{ required: true, message: '请输入邮箱' }]}
                    style={{ marginBottom: "10px" }}
                  >
                    <InputNumber style={{ width: "10vw" }} placeholder="请输入票价" prefix={<UserOutlined rev={undefined} />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="票数"
                    name="quantity"
                    // rules={[{ required: true, message: '请输入邮箱' }]}
                    style={{ marginBottom: "10px" }}
                  >
                    <InputNumber style={{ width: "10vw" }} placeholder="请输入票数" prefix={<UserOutlined rev={undefined} />} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                label="类型"
                name="type"
                rules={[{ required: true, message: "请选择门票类型" }]}
                style={{ marginBottom: "10px" }}
                initialValue={"1"}
              >
                <Select
                  style={{ width: 240 }}
                  options={[
                    { value: "0", label: "不可用" },
                    { value: "1", label: "可用" }
                  ]}
                />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            open={myInfoVisible}
            // onOk={handleOkDeleteUser}
            onCancel={() => {
              setMyInfoVisible(false);
            }}
            footer={false}
          >
            <Card title="购票信息">
              {userInfo && userInfo.length > 0 ? (
                userInfo.map((ticketPurchase: any, index: any) => (
                  <>
                    <React.Fragment key={index}>
                      <Card>
                        <Card.Grid style={gridStyle} hoverable={false}>
                          <span>票名:</span>
                          <span>{ticketPurchase.ticket.description}</span>
                        </Card.Grid>
                        <Card.Grid style={gridStyle} hoverable={false}>
                          <span>时间:</span>
                          <span>{new Date(ticketPurchase.time).toLocaleString()}</span>
                        </Card.Grid>
                        <Card.Grid style={gridStyle} hoverable={false}>
                          <span>数量:</span>
                          <span>{ticketPurchase.quantity}</span>
                        </Card.Grid>
                        <Card.Grid style={gridStyle} hoverable={false}>
                          <span>门票类型:</span>
                          <span>{ticketPurchase.ticket.type}</span>
                        </Card.Grid>
                        <Card.Grid style={gridSingleStyle} hoverable={false}>
                          <span>价格:</span>
                          <span>{ticketPurchase.ticket.price}</span>
                        </Card.Grid>
                      </Card>
                    </React.Fragment>
                    <Button
                      style={{
                        marginLeft: "356px",
                        marginTop: "1vh"
                      }}
                      size="small"
                      onClick={() => showRefundModal(ticketPurchase.id)}
                    >
                      退票
                    </Button>
                    <Divider />
                  </>
                ))
              ) : (
                <Card.Grid style={gridSingleStyle} hoverable={false}>暂无购票信息.</Card.Grid>
              )}
            </Card>
          </Modal>
        </Content>
      </Layout>
    </div>
  );
};

export default TicketManage;

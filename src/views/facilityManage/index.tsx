import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space, Breadcrumb, Radio, Select, Row, Col, Layout } from "antd";
import {
  PlusOutlined,
  HomeOutlined,
  ExclamationCircleTwoTone,
  WarningOutlined,
  PlusSquareOutlined,
  RocketOutlined
} from "@ant-design/icons";
import api from "@/api";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import moment from 'moment';
const { Content } = Layout;
type Attraction = {
  id?: number;
  name?: string;
  type?: string;
  description?: string;
  openingTime?: string | number;
  closingTime?: string | number;
  status?: string;
};

const childRoutes = ["/home/facilityManage/facilityFault", "/home/facilityManage/facilityPurchase"];
const FacilityManage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isChildRoute = childRoutes.some(route => location.pathname.includes(route));
  let role = sessionStorage.getItem("roleId") ?? "";
  // 表单实例
  const [form] = Form.useForm();
  const [formFault] = Form.useForm();
  let id = sessionStorage.getItem("id");
  let roleId = sessionStorage.getItem("roleId");
  const [tableLoading, setTableLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 表格数据
  const [projects, setProjects] = useState<Attraction[]>([]);
  const [total, setTotal] = useState();
  const [convert, setConvert] = useState(false);
  // const [defaultValue, setDefaultValues] = useState<any>([]);
  // 删除
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleHandle, setVisibleHandle] = useState(false);
  const [userInfo, setUserInfo] = useState<any>([]);
  const [editId, setEditId] = useState<number>();
  // 获取用户列表信息
  const getEquipments = async () => {
    try {
      const result: any = await api.GetAllEquipments({});

      const { success, data, message: info } = result;
      if (success) {
        setProjects(data.equipments);
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
  useEffect(() => {
    setTableLoading(true);
    getEquipments();
    getMyUser();
  }, []);

  const handleEdit = (record: Attraction) => {
    setConvert(false);
    // if (typeof record?.openingTime === 'string' && typeof record?.closingTime === 'string') {
    //   const openingDate = new Date(record.openingTime);
    //   const closingDate = new Date(record.closingTime);
    //   setDefaultValues([openingDate, closingDate]);
    // }

    form.setFieldsValue({
      name: record.name,
      type: record.type,

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
      status: data.status || null
    };
    if (convert) {
      try {
        const result: any = api.CreateEquipments(params);
        if (result.success) {
          message.success("添加成功");
          getEquipments();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsModalVisible(false);
      }
    } else {
      try {
        const result: any = api.UpdateEquipments(params);
        if (result.success) {
          message.success("修改成功");
          getEquipments();
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

  // 获取用户列表信息
  const getMyUser = async () => {
    try {
      const result: any = await api.GetMyUser({
        id: id ? parseInt(id) : null
      });

      const { success, data, message: info } = result;
      if (success) {
        setUserInfo(data.data);
      } else {
        message.error(info);
      }
    } catch (error) {
      message.error("获取个人信息失败");
    }
  };
  const handleApplyRepairModal = (record: any) => {
    // 打开删除弹窗
    setVisibleHandle(true);
    setEditId(record.id);

    formFault.setFieldsValue({
      reporter: userInfo.id,
      equipment: record.id
    });
  };
  function showAcceptanceModal(id: number) {
    Modal.confirm({
      title: '请确认操作',
      // 使用箭头函数传递ticketId
      onOk: () => handleAcceptance(id),
    });
  }

  const handleAcceptance = async (id: number) => {
    try {
      const result: any = await api.AcceptanceEquipment({
        id: id,
      });
      const { success, message: info } = result;
      if (success) {
        message.success("验收成功");
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      getEquipments();
      formFault.resetFields();
    }
  };
  const handleDelete = async () => {
    await form.validateFields();
    try {
      const result: any = await api.DeleteAttraction({
        id: editId
      });
      const { success, message: info } = result;
      if (success) {
        message.success("删除成功");
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setVisibleDelete(false);
      getEquipments();
      form.resetFields();
    }
  };
  const handleHandle = async () => {
    await formFault.validateFields();
    try {
      const result: any = await api.CreateEquipmentFaultReport({
        reporterId: formFault.getFieldValue("reporter"),
        equipmentId: formFault.getFieldValue("equipment"),
        description: formFault.getFieldValue("breakDownBreak"),
        approval: "0"
      });
      const { success, message: info } = result;
      if (success) {
        message.success("提交成功");
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setVisibleHandle(false);
      getEquipments();
      formFault.resetFields();
    }
  };
  const columns: any = [
    {
      title: "序号",
      dataIndex: "id",
      align: "center",
      key: "id",
      render: (_text: any, record: any, index: number) => {
        if (record) return index + 1;
      }
    },
    {
      title: "项目名",
      dataIndex: "name",
      key: "name",
      align: "center"
    },

    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (record: any) => {
        switch (record) {
          case "3":
            return "待验收";
          case "2":
            return "维修中";
          case "1":
            return "可用";
          case "0":
            return "报修中";
          default:
            return "--";
        }
      }
    },
    {
      title: "操作",
      dataIndex: "",
      key: "x",
      align: "center",
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
          {record.status === "1" && roleId === "4" &&
            <a onClick={() => handleApplyRepairModal(record)} style={{ color: "red" }}>
              {record.status === "1" && roleId === "4" && "设备报修"}
            </a>}

          {record.status === "3" && roleId === "5" &&
            <a onClick={() => showAcceptanceModal(record.id ?? 0)} style={{ color: "red" }}>
              {record.status === "3" && roleId === "5" && "设备验收"}
            </a>}
        </Space>
      )
    }
  ];

  return (
    <>
      <Layout style={{ borderRadius: "10", backgroundColor: "white", overflow: "auto", height: "70vh" }}>
        <Content style={{ padding: "0 50px", borderRadius: "10" }}>
          <Outlet />
          {!isChildRoute && (
            <>
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
                    // href: '', // 或者设置为空字符串，保持当前页面
                    title: (
                      <>
                        <RocketOutlined rev={undefined} />
                        <span>设备管理</span>
                      </>
                    )
                  }
                ]}
              />
              <br />
              <Row justify={"space-between"} style={{ marginBottom: "20px" }}>
                <Col>
                  <Button size="middle" icon={<PlusOutlined rev={undefined} />} onClick={handleAdd}>
                    新增
                  </Button>
                </Col>
                <Col>
                  {(role === "1" || role === "2" || role === "3" || role === "4") && (
                    <Button
                      style={{ marginRight: "10px" }}
                      size="middle"
                      icon={<WarningOutlined rev={undefined} />}
                      onClick={() => navigate("/home/facilityManage/facilityFault", { state: { userInfo, facility: projects } })}
                    >
                      设备报修管理
                    </Button>
                  )}

                  {(role === "1" || role === "2" || role === "5" || role === "6") && (
                    <Button
                      size="middle"
                      icon={<PlusSquareOutlined rev={undefined} />}
                      onClick={() =>
                        navigate("/home/facilityManage/facilityPurchase", { state: { userInfo, facility: projects } })
                      }
                    >
                      设备采购管理
                    </Button>
                  )}
                </Col>
              </Row>

              <Table
                columns={columns}
                dataSource={projects}
                rowKey="id"
                bordered={true}
                loading={tableLoading}
                pagination={{
                  total: total,
                  showTotal: total => `总共 ${total} 条数据`,
                  defaultPageSize: 5,
                  defaultCurrent: 1
                }}
              />
              <Modal
                title={convert ? "新增" : "修改"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
              >
                <Form form={form} layout="vertical" name="form_in_modal">
                  <Form.Item name="name" label="项目名" rules={[{ required: true, message: "请输入项目名" }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="status" label="状态" rules={convert ? [{ required: true, message: "请选择状态" }] : []}>
                    <Radio.Group>
                      <Radio value="0">报修中</Radio>
                      <Radio value="1">可用</Radio>
                      <Radio value="2">维修中</Radio>
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
                onCancel={() => {
                  setVisibleDelete(false);
                }}
                okText="确定"
                cancelText="取消"
              >
                确认是否删除？
              </Modal>
              <Modal
                title={
                  <Space>
                    <ExclamationCircleTwoTone rev={undefined} />
                    申请维修
                  </Space>
                }
                open={visibleHandle}
                onOk={handleHandle}
                onCancel={() => {
                  setVisibleHandle(false);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Form form={formFault} name="form_in_modal">
                  <Form.Item name="reporter" label="申请人">
                    <Select style={{ width: 120 }} disabled>
                      <Select.Option value={userInfo.id}>{userInfo.name}</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="equipment" label="设备">
                    <Select style={{ width: 120 }}>
                      {projects.map(option => (
                        <Select.Option key={option.id} value={option.id}>
                          {option.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="故障描述" name="breakDownBreak" rules={[{ required: true, message: "请输入故障描述" }]}>
                    <Input.TextArea placeholder="请输入故障描述" />
                  </Form.Item>
                </Form>
              </Modal>
            </>
          )}
        </Content>
      </Layout>
    </>
  );
};

export default FacilityManage;

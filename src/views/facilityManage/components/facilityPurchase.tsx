import { Breadcrumb, Button, Col, Form, Input, InputNumber, Modal, Row, Select, Space, Table, message } from "antd";
import { HomeOutlined, RocketOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "@/api";
import { useLocation } from "react-router-dom";

import React from "react";

type PurchasePlan = {
  id: number;
  purchaserId: number;
  supplierId: number;
  submitTime: Date;
  content: string;
  approval: number;
  price: number;
  quantity: number;
  purchaseTime: Date;
};

type Suppliers = {
  id: number;
  name: string;
};

const FacilityPurchase = () => {
  const location = useLocation();
  const userInfo = (location.state as { userInfo?: any })?.userInfo;
  let role = sessionStorage.getItem("roleId") ?? "";

  const [total, setTotal] = useState<number>();
  const [tableLoading, setTableLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Suppliers[]>([]);
  const [purchasePlan, setPurchasePlan] = useState<PurchasePlan[]>([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const disabledA: any = {
    pointerEvents: "none",
    cursor: "none",
    color: "#888"
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
      title: "采购部门",
      dataIndex: "purchaser",
      key: "purchaser",
      align: "center",
      render: (purchaser: { name: any }) => purchaser.name
    },
    {
      title: "设备提供商",
      dataIndex: "supplier",
      key: "supplier",
      align: "center",
      render: (supplier: { name: any }) => supplier.name
    },
    {
      title: "设备名",
      dataIndex: "content",
      key: "content",
      align: "center"
    },
    {
      title: "数量",
      dataIndex: "quantity",
      key: "quantity",
      align: "center"
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      align: "center"
    },
    {
      title: "上报时间",
      dataIndex: "reportTime",
      key: "reportTime",
      align: "center",
      render: (_text: any) => {
        return dayjs(_text).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      title: "状态",
      dataIndex: "approval",
      key: "approval",
      align: "center",
      render: (record: any) => {
        switch (record) {
          case 2:
            return "未通过";
          case 1:
            return "已批准";
          case 0:
            return "待审核";
          default:
            return "--";
        }
      }
    }
  ];
  if (["1", "2"].includes(role)) {
    columns.push({
      title: "操作",
      dataIndex: "",
      key: "x",
      align: "center",
      render: (record: any) => (
        <Space size="large">
          {(role === "1" || role === "2") && (
            <>
              <a
                onClick={() => {
                  showApprovalModal(record.id, 1);
                }}
                style={record?.approval === 0 ? {} : disabledA}
              >
                批准
              </a>
              <a
                onClick={() => {
                  showApprovalModal(record.id, 2);
                }}
                style={record?.approval === 0 ? { color: "#FF6103" } : disabledA}
              >
                打回
              </a>
              <a
                onClick={() => {
                  showDeleteModal();
                }}
                style={{ color: "red" }}
              >
                删除
              </a>
            </>
          )}
        </Space>
      )
    });
  }

  const getEquipmentSuppliers = async () => {
    try {
      const result: any = await api.GetEquipmentSuppliers({});

      const { success, data, message: info } = result;
      if (success) {
        setSuppliers(data.users);
        // setTotal(data.total);
      } else {
        message.error(info);
      }
    } catch (error) {
      message.error("获取个人信息失败");
    } finally {
      setTableLoading(false);
    }
  };
  // 获取设备报修报告
  const getEquipmentPlan = async () => {
    try {
      const result: any = await api.GetAllEquipmentPurchase({});

      const { success, data, message: info } = result;
      if (success) {
        setPurchasePlan(data.dto);
        setTotal(data.total);
      } else {
        message.error(info);
      }
    } catch (error) {
      message.error("获取个人信息失败");
    } finally {
      setTableLoading(false);
    }
  };

  function showApprovalModal(id: number, approval: number) {
    Modal.confirm({
      title: "请确认操作",
      // 使用箭头函数传递ticketId
      onOk: () => handleApprove(id, approval)
    });
  }
  function showDeleteModal() {
    Modal.confirm({
      title: "请确认操作",
      // 使用箭头函数传递ticketId
      onOk: () => getEquipmentPlan()
    });
  }
  const handleApprove = async (id: number, approval: number) => {
    try {
      const result: any = await api.ApproveEquipmentPurchase({
        id,
        approval
      });
      const { success, message: info } = result;
      if (success) {
        message.success("操作成功");
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      getEquipmentPlan();
    }
  };

  const handleAdd = async () => {
    await form.validateFields();
    const data = form.getFieldsValue();
    try {
      const result: any = await api.CreateEquipmentPurchasePlan({
        purchaserId: userInfo.id,
        supplierId: data.supplier,
        content: data.content,
        approval: 0,
        price: data.price,
        quantity: data.quantity
      });
      const { success, message: info } = result;
      if (success) {
        message.success("操作成功");
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setVisible(false);
      getEquipmentPlan();
    }
  };
  const writeRecordVisible = () => {
    // 打开删除弹窗
    setVisible(true);

    form.setFieldsValue({
      purchaser: userInfo.id
    });
  };

  useEffect(() => {
    setTableLoading(true);
    getEquipmentSuppliers();
    getEquipmentPlan();
  }, []);
  return (
    <>
      <Row justify={"space-between"}>
        <Col>
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
                href: "#/home/facilityManage", // 或者设置为空字符串，保持当前页面
                title: (
                  <>
                    <RocketOutlined rev={undefined} />
                    <span>设备管理</span>
                  </>
                )
              },
              {
                // href: '', // 或者设置为空字符串，保持当前页面
                title: (
                  <>
                    <span>采购管理</span>
                  </>
                )
              }
            ]}
          />
          <br />
        </Col>
        <Col>
          {(role === "1" || role === "5") && (
            <Button
              onClick={() => {
                writeRecordVisible();
              }}
            >
              设备采购
            </Button>
          )}
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={purchasePlan}
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
      <Modal title="请填写采购报告" open={visible} onOk={handleAdd} onCancel={() => setVisible(false)}>
        <Form form={form}>
          <Form.Item name="purchaser" label="采购部门" rules={[{ required: true, message: "请输入" }]}>
            <Select style={{ width: 120 }} disabled>
              <Select.Option value={userInfo.id}>{userInfo.name}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="supplier" label="设备供应商" rules={[{ required: true, message: "请选择" }]}>
            <Select style={{ width: 120 }}>
              {suppliers.map(suppliers => (
                <Select.Option key={suppliers.id} value={suppliers.id}>
                  {suppliers.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="content" label="采购设备" rules={[{ required: true, message: "请输入" }]}>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="数量"
                name="quantity"
                rules={[{ required: true, message: "请输入数量" }]}
                style={{ marginBottom: "10px" }}
              >
                <InputNumber style={{ width: "10vw" }} placeholder="请输入数量" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="价格"
                name="price"
                rules={[{ required: true, message: "请输入价格" }]}
                style={{ marginBottom: "10px" }}
              >
                <InputNumber style={{ width: "10vw" }} placeholder="请输入价格" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default FacilityPurchase;

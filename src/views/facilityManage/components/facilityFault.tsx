import { Breadcrumb, Button, Card, Col, Divider, Form, Modal, Row, Select, Space, Table, message } from "antd";
import { HomeOutlined, RocketOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import api from "@/api";
import { useLocation } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import React from "react";

type FaultReport = {
  id?: number,
  equipmentId?: number,
  reporterId?: number,
  reportTime?: string,
  openingTime?: string | number,
  description?: string
  approval?: string
}
type RepairRecord = {
  id?: number,
  equipmentId?: number,
  repairerId?: number,
  repairTime?: string,
  cause?: string
  result?: string
}
const gridStyle: React.CSSProperties = {
  width: '50%', // 一行显示两列
  textAlign: 'left', // 文本左对齐
  display: 'flex', // 使用Flex布局
  justifyContent: 'space-between', // 在项目之间添加空间
  padding: '8px', // 可以根据需要调整内边距
};
const gridSingleStyle: React.CSSProperties = {
  width: '100%', // 一行显示两列
  textAlign: 'left', // 文本左对齐
  display: 'flex', // 使用Flex布局
  justifyContent: 'space-between', // 在项目之间添加空间
  padding: '8px', // 可以根据需要调整内边距
};
const FacilityFault = () => {
  const location = useLocation();
  const userInfo = (location.state as { userInfo?: any })?.userInfo;
  const facility = (location.state as { facility?: any })?.facility;
  let role = sessionStorage.getItem('roleId') ?? '';

  const [total, setTotal] = useState<number>();
  const [tableLoading, setTableLoading] = useState(false);
  const [faultReports, setFaultReports] = useState<FaultReport[]>([]);
  const [repairRecord, setRepairRecord] = useState<RepairRecord[]>([]);
  const [recordVisible, setRecordVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const disabledA: any = {
    pointerEvents: 'none',
    cursor: 'none',
    color: '#888',
  }
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
      title: '设备名称',
      dataIndex: 'equipment',
      key: 'equipmentName',
      align: 'center',
      render: (equipment: { name: any; }) => equipment.name,
    },
    {
      title: '报告人',
      dataIndex: 'reporter',
      key: 'reporter',
      align: 'center',
      render: (reporter: { name: any; }) => reporter.name,
    },
    {
      title: '报修原因',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '上报时间',
      dataIndex: 'reportTime',
      key: 'reportTime',
      align: 'center',
      render: (_text: any) => {
        return dayjs(_text).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: '状态',
      dataIndex: 'approval',
      key: 'approval',
      align: 'center',
      render: (record: any) => {
        switch (record) {
          case '2':
            return '未通过';
          case '1':
            return '已批准';
          case '0':
            return '待审核';
          default:
            return '--'
        }
      }
    },

  ];

  if (['1', '2', '3'].includes(role)) {
    columns.push({
      title: '操作',
      dataIndex: '',
      key: 'x',
      align: 'center',
      render: (record: any) => (
        <Space size="large">
          {role === '3' && (
            <a
              style={record.approval === '1' ? {} : disabledA}
              onClick={() => writeRecordVisible(record)}>
              填写维修报告
            </a>
          )}
          {['1', '2'].includes(role) && (
            <>
              <a
                onClick={() => showApprovalModal(record.id, '1')}
                style={!(record?.approval === '1') ? { color: '#00C957' } : disabledA}
              >
                批准
              </a>
              <a
                onClick={() => showApprovalModal(record.id, '2')}
                style={record?.approval === '0' ? { color: '#00C957' } : disabledA}
              >
                打回
              </a>
              <a
                onClick={() => showDeleteModal(record.id)}
                style={{ color: 'red' }}
              >
                删除
              </a>
            </>
          )}
        </Space>
      ),
    });
  }
  // 获取设备报修报告
  const getEquipmentFaultReport = async () => {
    try {
      const result: any = await api.GetAllEquipmentFaultReports({});

      const { success, data, message: info } = result
      if (success) {
        setFaultReports(data.equipmentsFaultReport);
        setTotal(data.total);
      } else {
        message.error(info)
      }
    } catch (error) {
      message.error('获取个人信息失败')
    } finally {
      setTableLoading(false);
    }
  };
  // 获取维修记录
  const getEquipmentRepairRecords = async () => {
    try {
      const result: any = await api.GetAllEquipmentRepairRecords({});

      const { success, data, message: info } = result
      if (success) {
        setRepairRecord(data.equipmentRepairRecord);
      } else {
        message.error(info)
      }
    } catch (error) {
      message.error('获取记录失败')
    } finally {
      setTableLoading(false);
    }
  };
  function showApprovalModal(id: number, approval: string) {
    Modal.confirm({
      title: '请确认操作',
      // 使用箭头函数传递ticketId
      onOk: () => handleApprove(id, approval),
    });
  }
  function showDeleteModal(id: number) {
    Modal.confirm({
      title: '请确认操作',
      // 使用箭头函数传递ticketId
      onOk: () => handleDelete(id),
    });
  }
  const handleApprove = async (id: number, approval: string) => {
    try {
      const result: any = await api.ApproveEquipmentFaultReports({
        id,
        approval,
      });
      const { success, message: info } = result;
      if (success) {
        message.success('操作成功');
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      getEquipmentFaultReport();
    }
  };
  const handleWrite = async () => {
    const data = form.getFieldsValue();
    try {
      const result: any = await api.CreateEquipmentRepairRecord({
        repairerId: userInfo.id,
        equipmentId: data.equipment,
        cause: data.cause,
        result: data.result,
      });
      const { success, message: info } = result;
      if (success) {
        message.success('填写成功');
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      getEquipmentFaultReport();
      setVisible(false);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      const result: any = await api.DeleteEquipmentFaultReports({
        id
      });
      const { success, message: info } = result;
      if (success) {
        message.success('操作成功');
      } else {
        message.error(info);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      getEquipmentFaultReport();
    }
  };
  const writeRecordVisible = (record: any) => {
    // 打开删除弹窗
    setVisible(true);

    form.setFieldsValue({
      repairer: userInfo.id,
      equipment: record.id
    })
  };
  useEffect(() => {
    setTableLoading(true);
    getEquipmentFaultReport();

  }, []);
  return (
    <>
      <Row justify={"space-between"}>
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
                href: '#/home/facilityManage', // 或者设置为空字符串，保持当前页面
                title: (
                  <>
                    <RocketOutlined rev={undefined} />
                    <span>设施管理</span>
                  </>
                ),
              },
              {
                // href: '', // 或者设置为空字符串，保持当前页面
                title: (
                  <>

                    <span>报修管理</span>
                  </>
                ),
              },
            ]} />
          <br />
        </Col>
        <Col>
          <Button
            onClick={() => {
              setRecordVisible(true);
              getEquipmentRepairRecords();
            }}
            style={{ right: '2vw' }}>
            维修记录查询
          </Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={faultReports}
        rowKey="id"
        bordered={true}
        loading={tableLoading}
        pagination={{
          total: total,
          showTotal: (total) => `总共 ${total} 条数据`,
          defaultPageSize: 5,
          defaultCurrent: 1
        }} />
      <Modal
        title="请填写维修报告"
        open={visible}
        onOk={handleWrite}

        onCancel={() => setVisible(false)}
      >
        <Form form={form} >
          <Form.Item
            name="repairer"
            label="维修人"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Select
              style={{ width: 120 }}
              disabled
            >
              <Select.Option value={userInfo.id}>{userInfo.name}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="equipment"
            label="维修设备"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Select
              style={{ width: 120 }}
              disabled
            >

              {facility.map((option: any) => (
                <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="cause"
            label="故障原因"

            rules={[{ required: true, message: '请输入故障原因' }]}
          >
            <TextArea placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="result"
            label="维修结果"
            rules={[{ required: true, message: '请输入维修结果' }]}
          >
            <TextArea placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal

        open={recordVisible}
        // onOk={handleOkDeleteUser}
        onCancel={() => { setRecordVisible(false) }}
        footer={false}
      >
        <Card title="维修记录">
          {repairRecord.length > 0 ? (
            repairRecord.map((repairRecord: any, index: any) => (
              <><React.Fragment key={index}>
                <Card>
                  <Card.Grid style={gridStyle} hoverable={false}>
                    <span>设备名:</span>
                    <span>{repairRecord.equipment.name}</span>
                  </Card.Grid>
                  <Card.Grid style={gridStyle} hoverable={false}>
                    <span>维修人员:</span>
                    <span>{repairRecord.repairer.name}</span>
                  </Card.Grid>
                  <Card.Grid style={gridSingleStyle} hoverable={false}>
                    <span>维修时间:</span>
                    <span>{new Date(repairRecord.repairTime).toLocaleString()}</span>
                  </Card.Grid>

                  <Card.Grid style={gridSingleStyle} hoverable={false}>
                    <span>故障原因:</span>
                    <span>{repairRecord.cause}</span>
                  </Card.Grid>
                  <Card.Grid style={gridSingleStyle} hoverable={false}>
                    <span>维修结果:</span>
                    <span>{repairRecord.result}</span>
                  </Card.Grid>
                </Card>
              </React.Fragment>

                <Divider />
              </>
            ))
          ) : (
            <Card.Grid style={gridStyle} hoverable={false}>暂无维修记录报告.</Card.Grid>
          )}
        </Card>
      </Modal>
    </>
  );
};

export default FacilityFault;
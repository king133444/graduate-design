import { Avatar, Button, Col, Form, Input, InputNumber, Layout, Modal, Popover, Row, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import api from '@/api';

const { Header } = Layout;
export default function LayoutHeader() {

  const navigate = useNavigate()
  const [form] = Form.useForm();
  const [formRecharge] = Form.useForm();
  const [loading, setLoading] = useState(false);
  let username = sessionStorage.getItem('username');
  let email = sessionStorage.getItem('email');
  let balance = sessionStorage.getItem('balance');
  let id = sessionStorage.getItem('id');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [recharge, setRecharge] = useState(false);

  const handlePasswordClick = () => {
    setIsPasswordModalVisible(true);
  };
  const updatePasseord = async () => {
    const { password, confirm } = form.getFieldsValue();

    if (password !== confirm) {
      form.setFields([
        {
          name: 'confirm',
          errors: ['密码和确认密码不一致'],
        },
      ]);
      return;
    }
    setLoading(true);
    try {
      const result: any = await api.UpdatePassword({
        id: id ? parseInt(id) : '',
        password: password
      });
      const { success } = result;
      console.log(result);

      if (success) {
        message.success("修改密码成功！");
        navigate('/login');
      } else {
        message.error('修改密码失败')
      }
    } catch (error) {
      message.error('修改失败')
    } finally {
      setLoading(false);
    }

  }
  const handleReCharge = async () => {
    try {
      const result: any = await api.Recharge({
        id: id ? parseInt(id) : '',
        money: formRecharge.getFieldValue('money')
      });
      console.log(result);

      const { success, data } = result
      if (success) {
        message.success('充值成功');
        sessionStorage.setItem('balance', data.balance);

      } else {
        message.error(data.message)
      }
    } catch (error) {
      message.error('获取失败')
    } finally {
      setLoading(false);
      setRecharge(false);
    }
  };
  const logout = () => {
    sessionStorage.setItem('access_token', '')
    sessionStorage.setItem('refresh_token', '')
    sessionStorage.setItem('selectKey', '')
    navigate('/login')
  }
  return (
    <>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          width: '100%',
          paddingTop: '10px',
          paddingLeft: '20px',
          paddingRight: '20px',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#FFFFFF'
        }}>

        <Popover
          content={
            <Row style={{ width: '40vh', height: '24vh' }}>
              <Col span={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Avatar
                  style={{ marginRight: 30, marginBottom: 30, backgroundColor: '#87d068' }}
                  size={64}
                >
                  {username}</Avatar>
              </Col>
              <Col span={16} style={{ marginTop: '2vh' }}>
                <Row>
                  <Col style={{ fontSize: 14, marginBottom: 10, marginRight: 40 }}>
                    用户ID:
                  </Col>
                  <Col>
                    {id}
                  </Col>
                </Row>
                <Row>
                  <Col style={{ fontSize: 14, marginBottom: 10, marginRight: 40 }}>
                    用户名:
                  </Col>
                  <Col>
                    {username}
                  </Col>
                </Row>
                <Row>
                  <Col style={{ fontSize: 14, marginBottom: 10, marginRight: 40 }}>
                    邮箱:
                  </Col>
                  <Col style={{ fontSize: 12, marginTop: 2 }}>
                    {email}
                  </Col>
                </Row>
                <Row>
                  <Col style={{ fontSize: 14, marginBottom: 10, marginRight: 40 }}>
                    余额:
                  </Col>
                  <Col>
                    {balance}
                  </Col>
                </Row>

              </Col>
              <Row style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '2vw' }}>
                <Col style={{ marginRight: '1vw' }}>
                  <Button
                    type='primary'
                    // style={{ width: '4vw' }}
                    onClick={() => { setRecharge(true) }}>
                    充值
                  </Button>
                </Col>
                <Col style={{ marginRight: '1vw' }}>
                  <Button
                    type='text'
                    // style={{ width: '6vw' }}
                    onClick={handlePasswordClick}>
                    修改密码
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='text'
                    // style={{ width: '6vw' }}
                    onClick={() => { logout() }}>
                    登出
                  </Button>
                </Col>
              </Row>
            </Row>
          }
          trigger="click"
        >
          <Avatar
            style={{ marginRight: 30, marginBottom: 10, backgroundColor: '#87d068' }}
            icon={<UserOutlined rev={undefined} />}
          />
        </Popover>

      </Header>
      <Modal
        title="修改密码"
        open={isPasswordModalVisible}
        confirmLoading={loading}
        onOk={updatePasseord}
        onCancel={() => setIsPasswordModalVisible(false)}
      >
        <Form
          layout='vertical'
          form={form}
        >
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
        </Form>
      </Modal>
      <Modal
        title='充值'
        width={500}
        open={recharge}
        onOk={handleReCharge}
      >
        <Form
          form={formRecharge}
        >
          <Form.Item
            label='充值金额'
            name='money'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            style={{ marginTop: '5vh' }}
          >
            <InputNumber
              style={{ width: '10vw' }}
              placeholder='请输入充值金额' />
          </Form.Item>
        </Form>

      </Modal>
    </>
  )
}

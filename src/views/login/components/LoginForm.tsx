import { useEffect, useState } from "react";
import { Button, Col, ConfigProvider, Form, Input, Modal, Row, Select, Tooltip, message } from "antd"; // 引入 Space 组件
import { useLocation, useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import { TinyColor } from '@ctrl/tinycolor';
import { UserOutlined, LockOutlined, UserAddOutlined, InfoCircleOutlined } from "@ant-design/icons";
import api from "@/api";

interface LocationState {
  from?: string;
}
// const colors1 = ['#40e495', '#30dd8a', '#2bb673'];
const colors2 = ['#6253E1', '#04BEFE'];
const getHoverColors = (colors: string[]) =>
  colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors: string[]) =>
  colors.map((color) => new TinyColor(color).darken(5).toString());
const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [register, setRegister] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaKey, setCaptchaKey] = useState('');
  const [inputText, setInputText] = useState('');
  const [timer, setTimer] = useState(58);  // 验证码有效期5分钟

  // 获取图形验证码
  const getCaptcha = async () => {
    try {
      const data: any = await api.GetCaptcha({});
      const svgImage = `data:image/svg+xml;utf8,${encodeURIComponent(data.image)}`;
      setCaptchaImage(svgImage);
      setCaptchaKey(data.key);
      setTimer(58);
    } catch (error) {
      console.log(error);
    }
  }

  // 登录
  const handleSubmit = async () => {
    const { username, password, confirm, email, role } = form.getFieldsValue();
    if (register) {
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
          message.success("添加用户成功");
          setRegister(false);
        } else {
          message.error('添加用户失败')
        }
      } catch (error) {
        message.error('添加用户失败')
      } finally {
        setLoading(false);

      }
    }
    else {
      try {
        setLoading(true);
        const result: any = await api.Login({
          name: username,
          password,
          captchaKey: captchaKey,
          captchaText: inputText,
        })

        const { success, data, message: info } = result

        if (success) {
          const { accessToken, refreshToken } = data.tokens;
          const { name, id, email, roleId, balance } = data.user
          console.log(accessToken, refreshToken) // 添加这一行
          sessionStorage.setItem('access_token', accessToken)
          sessionStorage.setItem('refresh_token', refreshToken)
          sessionStorage.setItem('username', name)
          sessionStorage.setItem('email', email)
          sessionStorage.setItem('roleId', roleId)
          sessionStorage.setItem('balance', balance)

          sessionStorage.setItem('id', id)
          message.success("登录成功！");
          // 检查路由状态中是否有 'from' 属性
          const state = location.state as LocationState;
          if (state?.from) {
            // 如果有，跳转回用户试图访问的页面
            navigate(state.from);
          } else {
            // 如果没有，跳转到默认页面，例如首页
            navigate(HOME_URL);
          }
          navigate(HOME_URL);
        } else {
          message.error(info);
          // form.setFieldsValue([]);
          setInputText('');
          getCaptcha();
        }
      } catch (error: any) {
        console.log(error);
        message.error(error.response.data.message)
      }
      finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    getCaptcha();
  }, []);

  // 处理倒计时
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  return (
    <>
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
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '-10px' }}>
          登录
        </div>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
          style={{ marginBottom: '10px' }}
        >
          <Input autoComplete="on" placeholder="请输入用户名" prefix={<UserOutlined rev={undefined} />} />
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
        >
          <Row style={{ marginTop: '30px' }} gutter={18}>
            <Col>
              <img alt="Captcha"
                onClick={getCaptcha}
                src={captchaImage}
                style={{ width: '100px', borderRadius: '5px' }} />
              {!(timer > 0) &&
                <div style={{ color: 'red' }}>验证码已过期，请点击刷新</div>
              }
            </Col>
            <Col>
              <Input
                size="middle"
                prefix={
                  <Tooltip title="请输入图形验证码">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} rev={undefined} />
                  </Tooltip>
                }
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="请输入图形验证码"

              />
            </Col>
          </Row>
        </Form.Item>

        <br />
        <Row gutter={32} justify={'space-evenly'}>
          <Col>

            <Button
              type="link"
              size="large"
              onClick={() => {
                setRegister(true);
              }}
              icon={<UserAddOutlined rev={undefined} />}
            >
              注册
            </Button>
          </Col>
          <Col>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorPrimary: `linear-gradient(116deg,  ${colors2.join(', ')})`,
                    colorPrimaryHover: `linear-gradient(116deg, ${getHoverColors(colors2).join(', ')})`,
                    colorPrimaryActive: `linear-gradient(116deg, ${getActiveColors(colors2).join(', ')})`,
                    lineWidth: 0,
                  },
                },
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<UserOutlined rev={undefined} />}
                size="large"
              >
                登录
              </Button>
            </ConfigProvider>
          </Col>
        </Row>
      </Form>
      <Modal
        open={register}
        okText='注册'
        onCancel={() => { setRegister(false) }}
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
                { value: 5, label: '采购部门' },
                { value: 6, label: '设备供应商' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );

};

export default LoginForm;

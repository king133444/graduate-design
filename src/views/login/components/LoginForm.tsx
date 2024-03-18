import { useState } from "react";
import { Button, Form, Input, message } from "antd"; // 引入 Space 组件
import { useLocation, useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import { UserOutlined, LockOutlined, UserAddOutlined } from "@ant-design/icons";
import api from "@/api";

interface LocationState {
  from?: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [register, setRegister] = useState(false);
  // 分页参数
  //  const [pagination, setPagination] = useState<TablePaginationConfig>({
  //   current: 1,
  //   pageSize: 10,
  // });

  // 登录
  const handleSubmit = async () => {
    const { username, password, confirm } = form.getFieldsValue();
    console.log('form love xinxin', [form]);

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
        })
        const { success } = result;
        console.log(result);

        if (success) {
          message.success("注册成功！");
          navigate('/login');
        } else {
          message.error('注册失败')
        }
      } catch (error) {
        message.error('获取失败')
      } finally {
        setLoading(false);
      }
    }
    else {
      try {
        setLoading(true);
        const result: any = await api.Login({
          name: username,
          password
        })

        const { success, data, message: info } = result
        console.log('data', data);

        if (success) {
          const { accessToken, refreshToken } = data.tokens;
          const { name, id } = data.user
          console.log(accessToken, refreshToken) // 添加这一行
          sessionStorage.setItem('access_token', accessToken)
          sessionStorage.setItem('refresh_token', refreshToken)
          sessionStorage.setItem('username', name)
          sessionStorage.setItem('id', id)
          message.success("登录成功！");
          // 检查路由状态中是否有 'from' 属性
          const state = location.state as LocationState;
          if (state?.from) {
            // 如果有，跳转回用户试图访问的页面
            navigate(state.from);
          } else {
            // 如果没有，跳转到默认页面，例如首页
            navigate('/home');
          }
          navigate(HOME_URL);
        } else {
          message.error(info)
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
  return (
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
        {register ? '注册' : '登录'}
      </div>
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
      {register && (
        <Form.Item
          name="confirm"
          label="确认密码"
          rules={[{ required: true, message: '请确认密码' }]}
          style={{ marginBottom: '10px' }}
        >
          <Input.Password autoComplete="new-password" placeholder="输入确认密码" prefix={<LockOutlined rev={undefined} />} />
        </Form.Item>
      )}
      <Form.Item>
        <br />
        <Button
          onClick={() => {
            setRegister(!register);
            form.resetFields();
          }}
          style={{ width: '16vw', marginTop: '2vh' }}
          icon={<UserAddOutlined rev={undefined} />}
        >
          {register ? '取消注册' : '注册'}
        </Button>
        <br />
        <Button
          htmlType="submit"
          loading={loading}
          icon={<UserOutlined rev={undefined} />
          }
          style={{ width: '16vw', marginTop: '2vh' }}
        >
          {register ? '提交注册' : '登录'}
        </Button>
      </Form.Item>
    </Form>
  );

};

export default LoginForm;

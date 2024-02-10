import { useState } from "react";
import { Button, Form, Input, message } from "antd"; // 引入 Space 组件
import { useNavigate } from "react-router-dom";
import { HOME_URL } from "@/config/config";
import { UserOutlined, LockOutlined, CloseCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import api from "@/api";

const LoginForm = () => {
  const navigate = useNavigate();
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
      name="basic"
      labelCol={{ span: 5 }}
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      size="large"
      autoComplete="off"
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入用户名" prefix={<UserOutlined rev={undefined} />} />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password autoComplete="new-password" placeholder="请输入密码" prefix={<LockOutlined rev={undefined} />} />
      </Form.Item>
      {register && (
        <Form.Item
          name="confirm"
          rules={[{ required: true, message: '请确认密码' }]}
        >
          <Input.Password autoComplete="new-password" placeholder="输入确认密码" prefix={<LockOutlined rev={undefined} />} />
        </Form.Item>
      )}
      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={() => {
              form.resetFields();
            }}
            icon={<CloseCircleOutlined rev={undefined} />}
          >

            重置
          </Button>
          <Button
            onClick={() => {
              setRegister(!register);
              form.resetFields();
            }}
            icon={<UserAddOutlined rev={undefined} />}
          >
            {register ? '取消注册' : '注册'}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} icon={<UserOutlined rev={undefined} />}>
            {register ? '提交注册' : '登录'}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );

};

export default LoginForm;

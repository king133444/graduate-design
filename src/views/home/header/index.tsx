import { Avatar, Button, Col, Layout, Modal, Popover, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons'

const { Header } = Layout;
export default function LayoutHeader() {
  const navigate = useNavigate()
  let username = sessionStorage.getItem('username');
  let id = sessionStorage.getItem('id');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  const handlePasswordClick = () => {
    setIsPasswordModalVisible(true);
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
            <Row style={{ width: '40vh', height: '22vh' }}>
              <Col span={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Avatar
                  style={{ marginRight: 30, marginBottom: 30, backgroundColor: '#87d068' }}
                  size={64}
                >
                  admin</Avatar>
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
                <div style={{ fontSize: 14, marginBottom: 10 }}>邮箱</div>
                <Row >
                  <Col span={12} >
                    <Button
                      type='primary'
                      onClick={handlePasswordClick}>
                      修改密码
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      onClick={() => { logout() }}>
                      退出登录
                    </Button>
                  </Col>
                </Row>
              </Col>
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
      <Modal title="修改密码" open={isPasswordModalVisible} onCancel={() => setIsPasswordModalVisible(false)}>
        {/* 修改密码内容 */}
      </Modal>
    </>
  )
}

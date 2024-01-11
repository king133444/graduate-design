import { Avatar, Button, Modal, Popover } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { Header } from 'antd/es/layout/layout';

export default function LayoutHeader() {
  const navigate = useNavigate()
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const handleInfoClick = () => {
    setIsInfoModalVisible(true);
  };

  const handlePasswordClick = () => {
    setIsPasswordModalVisible(true);
  };

  return (
    <>
      <Header style={{
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
          content={<div>
            <Button type="link" block onClick={handleInfoClick}>
              个人信息
            </Button>
            <Button type="link" block onClick={handlePasswordClick}>
              修改密码
            </Button>
            <Button type="link" block onClick={() => { navigate('/login') }}>
              退出登录
            </Button>
          </div>}
          trigger="hover"
          overlayClassName="custom-popover"
        >
          <Avatar style={{ marginRight: 30, marginBottom: 10 }}>U</Avatar>
        </Popover>
      </Header>
      <Modal
        title="个人信息"
        open={isInfoModalVisible}
        onCancel={() => setIsInfoModalVisible(false)}
      >
        {/* 个人信息内容 */}
      </Modal>
      <Modal title="修改密码" open={isPasswordModalVisible} onCancel={() => setIsPasswordModalVisible(false)}>
        {/* 修改密码内容 */}
      </Modal>
    </>
  )
}

import './index.less';

import bg from '@/assets/images/login_bg.jpg';
import logo from '@/assets/images/logo.svg';
import logoName from '@/assets/images/logo_name.svg';

import LoginForm from './components/LoginForm';
const Login = () => {
	return (
		<div
			className="login-container"
			style={{
				backgroundImage: `url(${bg})`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				width: '100vw',
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}
		>
			<div className="login-box">
				<div className="login-logo">
					<img className="login-icon" src={logo} alt="logo" />
					<img className="logo-text" src={logoName} />
				</div>
				<div className="login-form">
					<LoginForm />
				</div>
			</div>
			{/* 备案号信息 */}
			<div style={{ textAlign: 'center', marginBottom: '20px' }}>
				<a href="https://beian.miit.gov.cn"
					target="_blank"
					className="gradient-text"
					rel="noopener noreferrer"
					style={{ color: 'white', textDecoration: 'none' }}>
					黑ICP备2024021414号-1
				</a>
			</div>
		</div>

	);
};

export default Login;

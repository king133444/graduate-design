import './index.less';

import bg from '@/assets/images/login_bg.png';
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
				height: '100vh'
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
		</div>
	);
};

export default Login;

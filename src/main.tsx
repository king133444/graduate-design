import ReactDOM from 'react-dom';
import App from '@/App';
import { RecoilRoot } from 'recoil';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

ReactDOM.render(
	<RecoilRoot>
		<ConfigProvider locale={zhCN}>
			<App />
		</ConfigProvider>
	</RecoilRoot>,
	document.getElementById('root'),
);

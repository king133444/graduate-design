import { ConfigProvider } from "antd";
import { HashRouter } from "react-router-dom";
import "moment/dist/locale/zh-cn";
import Router from "@/routers/index";
import 'antd/dist/antd.css'; // 添加这一行来导入 Ant Design 的样式

const App = () => {
	return (
		<HashRouter>
			<ConfigProvider>
				<Router />
			</ConfigProvider>
		</HashRouter>
	);
};

export default App;

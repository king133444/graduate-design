import { ConfigProvider } from "antd";
import { HashRouter } from "react-router-dom";
import "moment/dist/locale/zh-cn";
import Router from "@/routers/index";

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

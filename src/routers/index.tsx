/* eslint-disable no-mixed-spaces-and-tabs */
import { Navigate, useRoutes } from "react-router-dom";
import Login from "@/views/login/index";
import HomePage from "@/views/home/index"
import AccountManage from "@/views/accountManage";
import RoleManage from "@/views/roleManage";
import MainPage from "@/views/home/mainPage";
// import Dashboard from "@/views/dashboard/index";
// import other components...

export const rootRouter: any = [
	{
		path: "/",
		element: <Navigate to="/login" />
	},
	{
		path: "/login",
		element: <Login />,
		meta: {
			title: "登录页",
			key: "login"
		}
	},
	{
		path: "/home",
		element: <HomePage />,
		children: [
			{
				path: "mainPage",
				element: <MainPage />,
				meta: {
					title: "首页",
					key: "mainPage"
				}
			},
			{
				path: "accountManagement",
				element: <AccountManage />,
				meta: {
					title: "账户管理",
					key: "accountManage"
				}
			},
			{
				path: "roleManagement",
				element: <RoleManage />,
				meta: {
					title: "账户管理",
					key: "accountManage"
				}
			},
			// 添加其他子路由...
		],
		meta: {
			title: "主界面",
			key: "homepage"
		}
	},
];

const Router = () => {
	const routes = useRoutes(rootRouter);
	return routes;
};

export default Router;

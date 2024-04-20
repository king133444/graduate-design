/* eslint-disable no-mixed-spaces-and-tabs */
import { Navigate, useRoutes } from "react-router-dom";
import Login from "@/views/login/index";
import HomePage from "@/views/home/index"
import AccountManage from "@/views/accountManage";
import RoleManage from "@/views/roleManage";
import MainPage from "@/views/home/mainPage";
import AuthRoute from "./AuthRouter";
import ProjectManage from "@/views/projectManage";
import TicketManage from "@/views/ticketManage";
import FacilityManage from "@/views/facilityManage";
import CommentManage from "@/views/commentManage";
import VisitorManage from "@/views/visitorManage";
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
		element:
			<AuthRoute>
				<HomePage />
			</AuthRoute>
		,
		children: [
			{
				path: "",
				element:
					<AuthRoute>
						<MainPage />
					</AuthRoute>,
				meta: {
					title: "首页",
					key: "mainPage"
				}
			},
			{
				path: "projectManage",
				element:
					<AuthRoute>
						<ProjectManage />
					</AuthRoute>,
				meta: {
					title: "娱乐项目管理",
					key: "projectManage"
				}
			},
			{
				path: "ticketManage",
				element:
					<AuthRoute>
						<TicketManage />
					</AuthRoute>,
				meta: {
					title: "娱乐项目管理",
					key: "ticketManage"
				}
			},
			{
				path: "facilityManage",
				element:
					<AuthRoute>
						<FacilityManage />
					</AuthRoute>,
				meta: {
					title: "设施管理",
					key: "ticketManage"
				}
			},
			{
				path: "visitorManage",
				element:
					<AuthRoute>
						<VisitorManage />
					</AuthRoute>,
				meta: {
					title: "留言板",
					key: "visitorManage"
				}
			},
			{
				path: "commentManage",
				element:
					<AuthRoute>
						<CommentManage />
					</AuthRoute>,
				meta: {
					title: "留言板",
					key: "commentManage"
				}
			},
			{
				path: "accountManagement",
				element:
					<AuthRoute>
						<AccountManage />
					</AuthRoute>,
				meta: {
					title: "账户管理",
					key: "accountManage"
				}
			},
			{
				path: "roleManagement",
				element:
					<AuthRoute>
						<RoleManage />
					</AuthRoute>
				,
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

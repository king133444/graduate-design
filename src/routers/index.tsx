import { Navigate, useRoutes } from "react-router-dom";
import Login from "@/views/login/index";
import HomePage from "@/views/home/index"
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
		meta: {
			title: "仪表盘",
			key: "dashboard"
		}
	},
	// other routes...
];

const Router = () => {
	const routes = useRoutes(rootRouter);
	return routes;
};

export default Router;

import { fetchGet, fetchPost, fetchPost2 } from "@/components/ReqInstance/axios";

export default {
	/**
	 * 认证授权相关接口
	 */
	// 登录
	Login: (params: any) => {
		return fetchPost('/auth/login', params);
	},
	// 注册
	Signup: (params: any) => {
		return fetchPost('/auth/register', params);
	},
	// 获取当前用户
	User: (params: any) => {
		return fetchPost('/auth/user', params);
	},
	//刷新令牌
	RefreshToken: (params: any) => {
		return fetchPost('/auth/refreshToken', params)
	},
	// 修改密码
	UpdatePassword: (params: any) => {
		return fetchPost('/auth/changePassword', params);
	},
	/**
	 * 用户相关接口
	 */
	// 修改我的用户信息
	UpdateMyUser: (params: any) => {
		return fetchPost('/users/updateMyUser', params);
	},
	// 删除用户
	RemoveUser: (params: any) => {
		return fetchPost('/users/removeUser', params);
	},
	// 用户列表
	GetUsers: (params: any) => {
		return fetchPost('/users/users', params);
	},
	// 游客列表
	GetTourists: (params: any) => {
		return fetchGet('/users/tourists', params);
	},
	// 修改用户信息
	UpdateUser: (params: any) => {
		return fetchPost('/users/updateUser', params);
	},
	// 批量删除用户
	RemoveUsers: (params: any) => {
		return fetchPost('/users/removeUsers', params);
	},
	// 批量删除角色
	RemoveRoles: (params: any) => {
		return fetchPost2('/role/deleteRole', params);
	},
	// 获取角色列表
	GetRoles: (params: any) => {
		return fetchPost('/users/roles', params);
	},
	// 批量创建用户
	CreateUsers: (params: any) => {
		return fetchPost('/auth/createBatchUser', params);
	},
	// 充值
	Recharge: (params: any) => {
		return fetchPost('/users/reCharge', params);
	},
	/**
	 * 娱乐项目相关接口
	 */
	// 获取娱乐项目信息
	GetAllAttractions: (params: any) => {
		return fetchPost('/attraction/attractions', params);
	},
	// 修改娱乐项目信息
	UpdateAttraction: (params: any) => {
		return fetchPost('/attraction/updataAttraction', params);
	},
	// 删除娱乐项目信息
	DeleteAttraction: (params: any) => {
		return fetchPost('/attraction/deleteAttraction', params);
	},
	/**
	 * 设施相关接口
	 */
	// 获取全部设施
	GetAllEquipments: (params: any) => {
		return fetchPost('/equipment/equipments', params);
	},
	/**
	 * 门票相关接口
	 */
	// 获取所有门票
	GetAllTickets: (params: any) => {
		return fetchPost('/ticket/tickets', params);
	},
	// 购买门票
	BuyTickets: (params: any) => {
		return fetchPost('/ticket/buyTickets', params);
	},
}

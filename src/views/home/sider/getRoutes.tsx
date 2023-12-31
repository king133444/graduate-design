// 根据菜单 key 值获取路由
export const getRoutes = (key: string) => {
    switch (key) {
        case "menu1":
            return "/personalInformationManagement"
        case "menu2":
            return "/home/accountManagement"
        case "menu3":
            return "/home/roleManagement"
        default:
            return '/'
    }
}

// 根据路由获取菜单Key值
export const getMenuKeys = (route: string) => {
    route = route.split('/')[1]
    switch (route) {
        case "personalInformationManagement":
            return "menu1"
        case "accountManagement":
            return "menu2"
        case "roleManagement":
            return "menu3"
        default:
            return '/'
    }
}
// 根据菜单 key 值获取路由
export const getRoutes = (key: string) => {
    switch (key) {
        case "menu1":
            return "/login"
        case "menu2":
            return "/home/accountManagement"
        case "menu3":
            return "/home/roleManagement"
        case "menu4":
            return "/"
        case "menu5":
            return "/home"
        case "menu6":
            return "/home/projectManage"
        case "menu7":
            return "/home/ticketManage"
        case "menu8":
            return "/home/facilityManage"
        case "menu9":
            return "/home/commentManage"
        case "menu10":
            return "/home/visitorManage"
        default:
            return '/'
    }
}

// 根据路由获取菜单Key值
export const getMenuKeys = (route: string) => {
    // route = route.split('/')[1]

    switch (route) {
        case "/home/personalInformationManagement":
            return "menu1"
        case "/home/accountManagement":
            return "menu2"
        case "/home/roleManagement":
            return "menu3"
        case "/home":
            return "menu5"
        case "/home/projectManage":
            return "menu6"
        case "/home/ticketManage":
            return "menu7"
        case "/home/facilityManage":
            return "menu8"
        case "/home/commentManage":
            return "menu9"
        case "/home/visitorManage":
            return "menu10"
        default:
            return '/'
    }
}
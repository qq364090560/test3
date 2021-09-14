import $http from '../utils/request'
import qs from "qs";


//接口
// 首页统计接口
export const homePage = (data)=>{
    return $http.get('/consumer/homePage',{params:data})
    .then(data=>data.data)
}
// 登录
export const webLogin = (data)=>{
    return $http.post('/sec/webLogin',qs.stringify(data))
    .then(data=>data.data)
}
// 登出
export const webLogout = (data)=>{
    return $http.post('/sec/webLogout',qs.stringify(data))
    .then(data=>data.data)
}

// 获取菜单
export const getAuthorizedMenus = (data)=>{
    return $http.get('/sec/getAuthorizedMenus',{params:data})
    .then(data=>data.data)
}
// 获取所有菜单
export const getAll = (data)=>{
    return $http.get('/sys/menu/getAll',{params:data})
    .then(data=>data.data)
}
// 添加单个菜单
export const addOne = (data)=>{
    return $http.post('sys/menu/addOne',qs.stringify(data))
    .then(data=>data.data)
}
// 修改单个菜单
export const updateOne = (data)=>{
    return $http.post('sys/menu/updateOne',qs.stringify(data))
    .then(data=>data.data)
}
// 删除菜单
export const deleteMenu = (data)=>{
    return $http.post('sys/menu/delete',qs.stringify(data))
    .then(data=>data.data)
}

// 添加组织
export const addOneOrg = (data)=>{
    return $http.post('sys/addOneOrg',qs.stringify(data))
    .then(data=>data.data)
}
// 删除组织
export const deleteOrg = (data)=>{
    return $http.post('sys/deleteOrg',qs.stringify(data))
    .then(data=>data.data)
}
// 修改组织
export const updateOneOrg = (data)=>{
    return $http.post('sys/updateOneOrg',qs.stringify(data))
    .then(data=>data.data)
}
// 查询组织
export const getOrgs = (data)=>{
    return $http.get('/sys/getOrgs',{params:data})
    .then(data=>data.data)
}

// 添加用户组
export const addOneGroup = (data)=>{
    return $http.post('sys/addOneGroup',qs.stringify(data))
    .then(data=>data.data)
}
// 删除用户组
export const deleteOneGroup = (data)=>{
    return $http.post('sys/deleteOneGroup',qs.stringify(data))
    .then(data=>data.data)
}
// 修改用户组
export const updateOneGroup = (data)=>{
    return $http.post('sys/updateOneGroup',qs.stringify(data))
    .then(data=>data.data)
}
// 查询用户组
export const getGroups = (data)=>{
    return $http.get('sys/getGroups',{params:data})
    .then(data=>data.data)
}
// 查询组织详情
export const getOneOrg = (data)=>{
    return $http.get('sys/getOneOrg',{params:data})
    .then(data=>data.data)
}

// 角色绑定菜单
export const addMenusToRole = (data)=>{
    return $http.post('sys/addMenusToRole',qs.stringify(data))
    .then(data=>data.data)
}
// 添加角色
export const addOneRole = (data)=>{
    return $http.post('sys/addOneRole',qs.stringify(data))
    .then(data=>data.data)
}
// 删除角色
export const deleteOneRole = (data)=>{
    return $http.post('sys/deleteOneRole',qs.stringify(data))
    .then(data=>data.data)
}
// 修改角色
export const updateOneRole = (data)=>{
    return $http.post('sys/updateOneRole',qs.stringify(data))
    .then(data=>data.data)
}
// 查询角色
export const getRoles = (data)=>{
    return $http.get('sys/getRoles',{params:data})
    .then(data=>data.data)
}
// 根据角色查询已授权菜单
export const getMenusByRole = (data)=>{
    return $http.get('sys/getMenusByRole',{params:data})
    .then(data=>data.data)
}

// 添加用户
export const addOneUser = (data)=>{
    return $http.post('sys/addOneUser',qs.stringify(data))
    .then(data=>data.data)
}
// 停用用户（删除用户）
export const deleteOneUser = (data)=>{
    return $http.post('sys/deleteOneUser',qs.stringify(data))
    .then(data=>data.data)
}
// 修改密码接口
export const changePwd = (data)=>{
    return $http.post('sys/changePwd',qs.stringify(data))
    .then(data=>data.data)
}
// 修改用户基本信息
export const updateOneUser = (data)=>{
    return $http.post('sys/updateOneUser',qs.stringify(data))
    .then(data=>data.data)
}
// 重置密码
export const resetUserPwd = (data)=>{
    return $http.post('sys/resetUserPwd',qs.stringify(data))
    .then(data=>data.data)
}
// 添加用户角色绑定关系
export const userBindRole = (data)=>{
    return $http.post('sys/userBindRole',qs.stringify(data))
    .then(data=>data.data)
}
// 根据登录用户查询当前用户组下所有用户
export const getUsersByAccount = (data)=>{
    return $http.get('/sys/getUsersByAccount',{params:data})
    .then(data=>data.data)
}

// 获取站点
export const getAuthorizedSites = (data)=>{
    return $http.get('/sec/getAuthorizedSites',{params:data})
    .then(data=>data.data)
}
// 查询操作日志
export const queryAllOperate = (data)=>{
    return $http.get('sys/log/queryAllOperate',{params:data})
    .then(data=>data.data)
}
// 查询登陆日志
export const queryAllLogin = (data)=>{
    return $http.get('sys/log/queryAllLogin',{params:data})
    .then(data=>data.data)
}

// 查询停车场详情
export const findOneParkingLot = (data)=>{
    return $http.get('parking/findOneParkingLot',{params:data})
    .then(data=>data.data)
}

// 获取停车场信息列表
export const findParkingLots = (data)=>{
    return $http.get('parking/findParkingLots',{params:data})
    .then(data=>data.data)
}

// 添加停车场
export const insertOneParkingLot = (data)=>{
    return $http.post('parking/insertOneParkingLot',qs.stringify(data))
    .then(data=>data.data)
}
// 修改停车场信息
export const updateOneParkingLot = (data)=>{
    return $http.post('parking/updateOneParkingLot',qs.stringify(data))
    .then(data=>data.data)
}
// 停用、启用停车场
export const switchParkingLot = (data)=>{
    return $http.post('parking/switchParkingLot',qs.stringify(data))
    .then(data=>data.data)
}
// 删除停车场
export const deleteParkingLot = (data)=>{
    return $http.post('parking/deleteParkingLot',qs.stringify(data))
    .then(data=>data.data)
}

// 通道管理页面停车场列表获取
export const queryParkingLotsByOrg = (data)=>{
    return $http.get('parking/driveway/queryParkingLotsByOrg',{params:data})
    .then(data=>data.data)
}
// 通道管理页面停车场列表获取
export const drivewayQuery = (data)=>{
    return $http.get('parking/driveway/queryDriveways',{params:data})
    .then(data=>data.data)
}
// 添加停车场
export const drivewayInsert = (data)=>{
    return $http.post('parking/driveway/insertOne',qs.stringify(data))
    .then(data=>data.data)
}
// 修改通道
export const drivewayUpdate = (data)=>{
    return $http.post('parking/driveway/updateOne',qs.stringify(data))
    .then(data=>data.data)
}
// 删除通道
export const drivewayDel = (data)=>{
    return $http.post('parking/driveway/deleteOne',qs.stringify(data))
    .then(data=>data.data)
}

// 添加收费规则
export const insertFeeRuleStepOne = (data)=>{
    return $http.post('parking/fee/insertFeeRule/stepOne',qs.stringify(data))
    .then(data=>data.data)
}
// 添加临停收费规则
export const insertFeeRuleStepTwo = (data)=>{
    return $http.post('parking/fee/insertFeeRule/stepTwo',qs.stringify(data))
    .then(data=>data.data)
}
// 添加包月收费规则
export const insertFeeRuleStepThree = (data)=>{
    return $http.post('parking/fee/insertFeeRule/stepThree',qs.stringify(data))
    .then(data=>data.data)
}
// 修改收费规则
export const updateFeeRule = (data)=>{
    return $http.post('parking/fee/updateFeeRule',qs.stringify(data))
    .then(data=>data.data)
}
// 删除收费规则
export const deleteOneFeeRule = (data)=>{
    return $http.post('parking/fee/deleteOneFeeRule',qs.stringify(data))
    .then(data=>data.data)
}

// 通道添加控制器
export const bindController = (data)=>{
    return $http.post('parking/driveway/bindController',qs.stringify(data))
    .then(data=>data.data)
}
// 通道删除控制器绑定关系
export const deleteControllerBind = (data)=>{
    return $http.post('parking/driveway/deleteControllerBind',qs.stringify(data))
    .then(data=>data.data)
}
// 获取控制器列表
export const getControllers = (data)=>{
    return $http.get('parking/driveway/getControllers',{params:data})
    .then(data=>data.data)
}
// 添加控制器
export const addController = (data)=>{
    return $http.post('hardware/controller/addOne',qs.stringify(data))
    .then(data=>data.data)
}
// 添加控制器
export const updateController = (data)=>{
    return $http.post('hardware/controller/updateOne',qs.stringify(data))
    .then(data=>data.data)
}

// 获取包月用户列表
export const getCardInfoDetail = (data)=>{
    return $http.get('consumer/cardInfo/getCardInfoDetail',{params:data})
    .then(data=>data.data)
}
// 获取同步控制器列表
export const getByParkingLotId = (data)=>{
    return $http.get('hardware/controller/getByParkingLotId',{params:data})
    .then(data=>data.data)
}
// 同步权限
export const handleUpload = (data)=>{
    return $http.post('hardware/wg/handleUpload',qs.stringify(data))
    .then(data=>data.data)
}
// 修改用户
export const userUpdateOne = (data)=>{
    return $http.post('consumer/cardInfo/updateOne',qs.stringify(data))
    .then(data=>data.data)
}

// 图片查询
export const picInfo = (data)=>{
    return $http.get('consumer/cardInfo/picInfo',{params:data})
    .then(data=>data.data)
}
// 查询订单
export const queryAll = (data)=>{
    return $http.get('consumer/order/queryAll',{params:data})
    .then(data=>data.data)
}
// 根据停车场查询收费规则
export const nonMotorFeeRules = (data)=>{
    return $http.get('parking/wg/nonMotorFeeRules',{params:data})
    .then(data=>data.data)
}
// 管理员手动添加卡片
export const handAdd = (data)=>{
    return $http.post('consumer/cardInfo/handAdd',qs.stringify(data))
    .then(data=>data.data)
}
// 卡片报停
export const disabledCard = (data)=>{
    return $http.post('consumer/cardInfo/disabledCard',qs.stringify(data))
    .then(data=>data.data)
}
// 补卡 
export const changeCard = (data)=>{
    return $http.post('consumer/cardInfo/changeCard',qs.stringify(data))
    .then(data=>data.data)
}

// 临停远程开门
export const handOpen = (data)=>{
    return $http.post('hardware/wg/handOpen',qs.stringify(data))
    .then(data=>data.data)
}

// 设置控制器状态
export const setControllerStatus = (data)=>{
    return $http.post('hardware/wg/setControllerStatus',qs.stringify(data))
    .then(data=>data.data)
}

// 查询刷卡记录
export const queryAllcard = (data)=>{
    return $http.get('hardware/swipe/queryAll',{params:data})
    .then(data=>data.data)
}

// 首页公告查询
export const homePageQuery = (data)=>{
    return $http.get('sys/log/notice/homePageQuery',{params:data})
    .then(data=>data.data)
}
// 查询所有公告（公告管理页面）
export const queryAllNotice = (data)=>{
    return $http.get('sys/log/notice/queryAll',{params:data})
    .then(data=>data.data)
}
// 删除公告
export const deleteNotice = (data)=>{
    return $http.post('sys/log/notice/deleteOne',qs.stringify(data))
    .then(data=>data.data)
}
// 修改公告
export const updateNotice = (data)=>{
    return $http.post('sys/log/notice/updateOne',qs.stringify(data))
    .then(data=>data.data)
}
// 添加公告
export const addNotice = (data)=>{
    return $http.post('sys/log/notice/addOne',qs.stringify(data))
    .then(data=>data.data)
}
// 非机动车卡片管理-添加-停车场-收费标准
export const parkMoney = (data)=>{
    return $http.get('/parking/wg/nonMotorFeeRules',{params:data})
    .then(data=>data.data)
}
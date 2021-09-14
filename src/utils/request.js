import axios from "axios";
import {Message} from "element-ui";
import router from '@/router'

const axiosInstance = axios.create({
    // 公共的请求地址配置在这里
    // baseURL : 'http://192.168.0.22:7010',
    baseURL : 'http://plat.hlyzycn.com',
    // 请求超时时间（单位ms）
    timeout: 8000,
})

axiosInstance.interceptors.request.use((config)=> {
    // 在发送请求之前做些什么
    const token=sessionStorage.getItem('token')
    const menuId=router.history.current.meta.mid
    if(token && token!=undefined){
        const userId=JSON.parse(sessionStorage.getItem('userInfo')).userId
        if(config.method=="post"){
            // thisUser 登陆用户id  thisMenu 操作菜单id
            config.data = `thisUser=${userId}&`+`thisMenu=${menuId}&`  + config.data
        }
    }
    return config;
},err=> {   
    Promise.reject(err)
});

axiosInstance.interceptors.response.use((response)=> {

    // console.log(response)
    if (response.data.status === 401) {
        Message.error('已过期')
        sessionStorage.clear()
        router.push('/login')
        // window.location.reload()
    }
    return response;
},err=>{
    const { status } = err.response
    if(status==401){
        Message.error('已过期')
        sessionStorage.clear()
        router.push('/login')
    }
    Promise.reject(err)
});
export default axiosInstance;
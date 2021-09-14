import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store'

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: asyncRoutes
})

//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}
//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
    return originalReplace.call(this, location).catch(err => err)
}

const newRouter=[
    {
        path: '/home',
        name:'系统首页',
        component:() =>import('../components/page/Dashboard.vue'),
        meta: { title: '系统首页', }
    },
    // {
    //     path: '/test',
    //     name:'test',
    //     component:() =>import('../components/page/test.vue'),
    //     meta: { title: 'test', }
    // },
    {
        path: '/403',
        name:'403',
        component: () => import('../components/page/403.vue'),
        meta: { title: '403' }
    },
    {
        path: '/404',
        name:'404',
        component: () => import('../components/page/404.vue'),
        meta: { title: '404' }
    },
    
]

export const asyncRoutes=[
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '系统首页' },
            children:newRouter
        },
        {
            path: '/login',
            component: () => import('../components/page/Login.vue')
        },
        {
            path: '*',
            redirect: '/404'
        },
]

objRoutes()

export function objRoutes() {
    let rt = store.state.user.routers
    if (rt != undefined) {
        rt.map(item => {
            item.child.map(i=>{
                if(item.child){
                    let obj = {
                        path: `${i.mhref}`,
                        name:`${i.mnameCn}`,
                        component: () => import(`../components/page${i.mhref}.vue`),meta:{title:i.mnameCn,mfunction:i.mfunction,mid:i.mid}
                        // component: resolve => require([`../components/page${i.mhref}.vue`], resolve),meta:{title:i.mnameCn,role:i.mfunction,mid:i.mid},
                    };
                    newRouter.push(obj)
                }
            })
        })
    }
    router.addRoutes(asyncRoutes)
}
export default router

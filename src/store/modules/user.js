import {webLogout} from '../../api/api.js'
const state={
    userInfo:JSON.parse(sessionStorage.getItem('userInfo') || '[]'),
    token:'',
    routers:JSON.parse(sessionStorage.getItem('routers') || '[]'),
    site:1
};
const getters={
    isShow(state){
       return state.showUser;
    }
}
const mutations={
    SetUserInfo(state,obj){
        sessionStorage.setItem('userInfo',JSON.stringify(obj));
        state.userInfo=JSON.parse(sessionStorage.getItem('userInfo'));
    },
    SetToken(state,str){
        state.token=str;
        sessionStorage.setItem('token',str);
    },
    SetRouters(state,arr){
        state.routers=JSON.parse(arr);
        sessionStorage.setItem('routers',arr);
    },
    SetSite(state,num){
        state.site=num;
        sessionStorage.setItem('site',num)
    }   
}
const actions={
    // loginOut({commit}){
    //     // return new Promise((resolve,reject)=>{
    //         webLogout(state.token,state.userInfo.userId).then(()=>{
    //             commit('setUserInfo',{})
    //             commit('setToken','')
    //         }).catch(error=>{
    //             reject(error)
    //         })
    //     // })
    // },
    hideDailog({commit}){
        commit('hide');
    }
}
export default{
    namespaced:true,
    getters,
    mutations,
    actions,
    state
}
   import Vue from 'vue'
    
    /**权限指令**/
    const has = Vue.directive('has', {
        bind: function (el, binding, vnode) {
            // 获取页面按钮权限
            // "query","insert","delete","update"
            let btnPermissionsArr = [];
            if(binding.value){
                // 如果指令传值，获取指令参数，根据指令参数和当前登录人按钮权限做比较。
                btnPermissionsArr = Array.of(binding.value);
            }else{
                // 否则获取路由中的参数，根据路由的btnPermissionsArr和当前登录人按钮权限做比较。
                btnPermissionsArr = vnode.context.$route.meta.mfunction;
            }
            if (!Vue.prototype.$_has(btnPermissionsArr)) {
                el.parentNode.removeChild(el);
            }
        }
    });
    // 权限检查方法
    Vue.prototype.$_has = function (value) {
        let isExist = false;
        // 获取用户按钮权限
        let btnPermissionsStr = sessionStorage.getItem("routers");
        // let btnPermissionsStr = vnode.context.$route.meta.mfunction;
        if (btnPermissionsStr == undefined || btnPermissionsStr == null) {
            return false;
        }
        if (value.indexOf(btnPermissionsStr) > -1) {
            isExist = true;
        }
        return isExist;
    };
    const btnShow = Vue.directive('btnShow', {
        inserted: function(el, binding,vnode) {
            const { value } = binding
            const elementsList = vnode.context.$route.meta.mfunction.split(',');
            if (value && typeof (value) === 'string') {
                const hasPermission = elementsList.some((res) => {
                    return value === res
                })
                if (!hasPermission) {
                    el.parentNode && el.parentNode.removeChild(el)
                }
            } else {
                throw new Error(`need String! Like v-btnShow='elementId'`)
            }
        }
    })

    export {has,btnShow}
     
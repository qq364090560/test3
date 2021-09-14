const service = axios.create({
    baseURL: baseURL,
    timeout: 30000, // 请求超时时间
    isShowMessage: false,
    cancelToken: source.token
  })
  
  let num = 0
  // 请求拦截器
  service.interceptors.request.use(
    async config => {
        if (notShowLoadingUrl.indexOf(config.url) == -1) {
          num++
          if (num > 0 && !store.state.oa.loading.isLoading) {
            store.commit('oa/loading/setIsLoading', true, {
              root: true
            })
          }
        }
        // 在请求发送之前做一些处理
        if (!(/^https:\/\/|http:\/\//.test(config.url))) {
          const token = util.cookies.get('token')
          // console.log(token,axios.defaults)
          /* if(config.url.indexOf('/api/auth/login') < 0 && axios.defaults.authorization !== token){
            Message.error('当前登录用户已发生改变！')
            source.cancel('Operation canceled by the user.');
            window.location.href='/'
            return 
          } */
          if (token && token !== 'undefined') {
            // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
            config.headers['X-Authorization'] = 'Bearer ' + token
            /* 流程处理时添加头部 X-Form*/
            if (axios.defaults.currentUrl === '/flowable/flow-block') {
              let xForm = localStorage.getItem('xForm')
              if (xForm) config.headers['X-Form'] = xForm
            }
            /* 流程处理时添加头部 X-Form*/
            /* 添加头部 模块名称*/
            if (axios.defaults.currentUrlName) {
              config.headers['U-Name'] = axios.defaults.currentUrlName
            }
            /* 添加头部 模块名称*/
            /* 添加头部 base64*/
            //console.log('extend-params',axios.defaults.extendParams)
            //let datas = JSON.parse(config.data)
            let noVerify = false
            if (config.data && config.data.data && Object.keys(config.data.data).indexOf('noVerify') >= 0) noVerify = true
            if (axios.defaults.extendParams) {
              let extendParams = axios.defaults.extendParams
              if (noVerify) extendParams.draftButtonCode = 'true'
              if (axios.defaults.flowButtonCode) extendParams.flowButtonCode = axios.default
<template>
  <div class="header">
    <div class="logo">
      <el-dropdown trigger="click"  @command="handleChange">
        <span class="span">
          <i class="el-icon-caret-bottom"></i>
          {{sname}}
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="logoTitle" v-for="(item,index) in sData" :key="index"  :command="item.sname">{{item.sname}}</el-dropdown-item>
          </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条通知`:`通知中心`" placement="bottom">
            <i  @click="handShow" class="el-icon-bell"></i>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <!-- <div class="user-avator">
          <img :src="headImg">
        </div> -->
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/admin">
              <el-dropdown-item>用户信息</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- <el-dialog
      title="公告"
      :visible.sync="dialogVisible"
      width="60%">

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <Tabs :dialogVisible="dialogVisible" @dialogChange='dialogChange' :noticeData="noticeData"/>
    
  </div>
</template>
<script>
import {webLogout,getAuthorizedSites,getAuthorizedMenus,homePageQuery} from '../../api/api'
import Tabs from '../page/Tabs.vue'
// import { mapGetters,mapActions } from "vuex";
import { objRoutes} from '../../router'
export default {
  components:{
    Tabs
  },
  data() {
    return {
      dialogVisible:true,
      show: true,
      fullscreen: false,
      name: "admin",
      message: 0,
      // 用户头像
      headImg:'../../assets/img/img.jpg',
      sData:[],
      sname:"智源创能管理系统",
      newRouter:[],
      noticeData:[]
    };
  },
  computed: {
    username() {
      let username = JSON.parse(sessionStorage.getItem("userInfo"));
      return username ? username.userName : this.name;
    },
  },
  methods: {
    getNotice(){
      homePageQuery().then(res=>{
          this.noticeData=res.data
      })
    },
    handShow(){
      this.dialogVisible=true
      this.getNotice()
    },
    dialogChange(v){
      this.dialogVisible=v
    },
    getMenu(v){
      if(v){
        console.log(v)
        let params={
          userId:JSON.parse(sessionStorage.getItem("userInfo")).userId
        }
        getAuthorizedMenus(params).then((data)=>{
          let menuItems=data.data.filter(data=>data.msiteId==v)
          this.$store.commit('user/SetRouters',JSON.stringify(menuItems))
          objRoutes()

          this.$parent.$children.map(it=>{
            if(it.$refs.sidebar){
              it.getMenu()
            }
          })
        })
      }else{
        let params={
          // token:sessionStorage.getItem('token'),
          userId:JSON.parse(sessionStorage.getItem("userInfo")).userId
        }
        getAuthorizedMenus(params).then((data)=>{
          // data.data.filter(data=>data.msiteId==this.$store.state.user.site)
          let site=sessionStorage.getItem('site')
          let menuItems
          if(site){
            menuItems=data.data.filter(data=>data.msiteId==site)
          }else{
            menuItems=data.data.filter(data=>data.msiteId==1)
          }

          this.$store.commit('user/SetRouters',JSON.stringify(menuItems))
          this.$parent.$children.map(it=>{
            if(it.$refs.sidebar){
              it.getMenu()
            }
          })
        })
      }
    },
    // 站点选择
    handleChange(command){
      if(command){
        this.sname=command
        sessionStorage.setItem('sname',command)
        let sid=this.sData.filter(res=>res.sname==command)
        this.$store.commit('user/SetSite',JSON.stringify(sid[0].sid))
        this.getMenu(sid[0].sid)
        this.$parent.$children.map(it=>{
            if(it.$refs.tags){
              it.closeAll()
            }
        })
      }
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        let obj={
          token : sessionStorage.getItem("token"),
          userId : JSON.parse(sessionStorage.getItem("userInfo")).userId
        }
        webLogout(obj).then(res=>{
          if(res.status==200){
            sessionStorage.clear()
            this.$router.push("/login");
          }
        })
      }else if(command =="user"){
        this.$store.dispatch('dailog/showDailog')
      }
    },
  },
  created() {
    let sname=sessionStorage.getItem('sname')
    if(sname){
      this.sname=sname
    }
    let params={
      token:sessionStorage.getItem('token'),
      userId:JSON.parse(sessionStorage.getItem("userInfo")).userId
    }
    getAuthorizedSites(params).then((res)=>{
      this.sData=res.data
      this.getMenu()
    })

  },
  mounted(){
      this.getNotice()
  },
};
</script>
<style scoped>
.header {
  background-color: #23262e !important;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.logoTitle{
  font-size: 16px;
    /* margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px; */
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
  text-align: center;
}
.header .logo .span{
  font-size: 22px;
  color: #fff;
  cursor: pointer;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
.collapse-btn:hover{
  background-color: #009688!important;
}
</style>

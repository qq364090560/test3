<template>
  <div class="sidebar" ref="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      background-color="#20222A"
      text-color="rgba(255,255,255,.7)"
      active-text-color="#fff"
      unique-opened
      router
      @select="ontest"
    >
      <template v-for="item in menuItems">
        <template v-if="item.child">
          <el-submenu :index="item.mhref" :key="item.mhref">
            <template slot="title">
              <i :class="item.micon"></i>
              <span slot="title">{{ item.mnameCn }}</span>
            </template>
            <template v-for="child in item.child">
              <el-submenu v-if="child.child" :index="child.mhref" :key="child.mid">
                <template slot="title">{{ child.mnameCn }}</template>
                <el-menu-item
                  v-for="(threeItem,i) in child.child"
                  :key="i"
                  :index="threeItem.mhref"
                >{{ threeItem.mnameCn }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="child.mhref" :key="child.mid">{{ child.mnameCn }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.mhref" :key="item.mid">
            <i :class="item.micon"></i>
            <span slot="title">{{ item.mnameCn }}</span>
          </el-menu-item>
        </template>
      </template>
      
    </el-menu>
  </div>
</template>

<script>
import {getAuthorizedMenus} from '../../api/api'
import { objRoutes} from '../../router'

export default {
  data() {
    return {
      collapse: false,
      menuItems: [],
      items: [
        {
          icon: "el-icon-lx-home",
          index: "home",
          title: "系统首页"
        },
        {
          icon: "el-icon-lx-cascades",
          index: "table",
          title: "门禁管理"
        }, 
        // {
        //   icon: "el-icon-lx-copy",
        //   index: "zhandian",
        //   title: "分账管理"
        // },
      ]
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path
      // return this.$route.path.replace("/", "");
    },
    site(){
      return this.$store.state.user.site
    },
    getRouter(){
      return this.$store.state.user.routers
    }
  },
  created() {
    this.getMenu()
  },
  methods:{
    ontest(i){
      console.log(i)
      // location.reload()
    },
    getMenu(){

      this.menuItems=this.getRouter
      objRoutes()

      // console.log(this.menuItems)
      // let params={
      //   // token:sessionStorage.getItem('token'),
      //   userId:JSON.parse(sessionStorage.getItem("userInfo")).userId
      // }
      // getAuthorizedMenus(params).then((data)=>{
      //   // data.data.filter(data=>data.msiteId==this.$store.state.user.site)
      //   this.menuItems=data.data.filter(data=>data.msiteId==this.site)
      //   console.log(this.menuItems)
      //   this.$store.commit('user/SetRouters',JSON.stringify(this.menuItems))
      // })
    }
  }
  
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>

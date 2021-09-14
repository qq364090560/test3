<template>
  <div class="wrapper">
    <v-head></v-head>
    <v-sidebar></v-sidebar>
    <div class="content-box" :class="{'content-collapse':collapse}">
      <v-tags></v-tags>
      <div class="content">
        <transition name="move" mode="out-in">
          <keep-alive :include="tagsList">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
    <el-dialog title="密码修改" :visible.sync="isShow" v-dialogDrag :show-close='false'>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="原密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="newPassword">
            <el-input v-model="form.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPwd">
            <el-input show-password v-model="form.confirmPwd" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDailog">取 消</el-button>
        <!-- <el-button type="primary" @click="hideDailog('OK')">确 定</el-button> -->
        <el-button type="primary" @click="isOK">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vTags from "./Tags.vue";
import bus from "./bus";
import {changePwd} from "../../api/api";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
  data() {
    var valiconfirmPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    return {
      tagsList: [],
      collapse: false,
      form: {
          password: '',
          newPassword: '',
          confirmPwd: '',
      },
      formLabelWidth: '120px',
      rules:{
        password: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6,  message: '密码长度至少6位', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6,  message: '密码长度至少6位', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          // { min: 6,  message: '密码长度至少6位', trigger: 'blur' },
          { validator: valiconfirmPwd, trigger: 'blur' }
        ],
      }
    };
  },
  computed: {
    ...mapGetters("dailog", {
      isShow: "isShow"
    })
  },
  methods: {
    ...mapActions("dailog", ["hideDailog", "showDailog"]),
    handleClose(){
       this.$confirm('确认关闭？')
          .then(_ => {
            
          }).bind(this)
          .catch(_ => {});
    },
    isOK(){
      this.$refs.form.validate((valid) => {
          if (valid) {
            alert('submit!');
            this.hideDailog()
            // let obj={
            //   userId:this.$store.state.user.userId,
            //   account:this.form.newPassword,
            //   oriPwd:this.form.password,
            //   newPwd:this.form.newPassword
            // }
            // changePwd().then(res=>{

            // })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    }
  },
  components: {
    vHead,
    vSidebar,
    vTags
  },
  created() {
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  }
};
</script>

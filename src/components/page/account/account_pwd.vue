<template>
    <el-dialog title="修改密码" :visible.sync="pwdChange" :close-on-click-modal="false" :show-close='false'>
      <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="100px" class="demo-ruleForm" hide-required-asterisk>
          <el-form-item label="原密码"  prop="password">
              <el-input type="password" v-model="changeForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpass">
              <el-input type="password" v-model="changeForm.newpass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkpass">
              <el-input type="password" v-model="changeForm.checkpass" autocomplete="off"></el-input>
          </el-form-item>
          
          <el-form-item>
              <el-button type="primary" @click="submitForm()">确定</el-button>
              <el-button @click="resetForm()">取消</el-button>
          </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script>
import {changePwd} from "@/api/api";

export default {
  props:{
    pwdChange:Boolean,
    rowData:{}
  },
  data() {
    var newpassword=(rule,value,callback)=>{
      if(value.length<6){
        callback(new Error('请输入6位数以上的密码'));
      }else{
        this.$refs.changeForm.validateField("checkpass");
        callback();
      }
    }
    var newcheckpass=(rule,value,callback)=>{
      if(value.length<6){
        callback(new Error('请输入6位数以上的密码'));
      }else if(value !==this.changeForm.newpass){
        callback(new Error('两次输入密码不一样'));
      }else if(value ==this.changeForm.password){
        callback(new Error('不能和旧密码一致'));
      }else{
        callback();
      }
    }
    return {
      changeForm: {
        password: "",
        newpass: "",
        checkpass: ""
      },
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "请输入6到20的密码" }
        ],
        newpass: [
          { validator: newpassword, trigger: 'blur' },
        ],
        checkpass: [
          { validator: newcheckpass, trigger: 'blur' },
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.changeForm.validate((valid) => {
        if (valid) {
          let obj={
            userId:this.rowData.userId,
            account:this.rowData.loginAccount,
            userName:this.rowData.userName,
            oriPwd:this.changeForm.password,
            newPwd:this.changeForm.newpass,
          }
          changePwd(obj).then(res=>{
            if(res.status==700){
              this.$message({
                message: res.message,
                type: 'warning'
              });
            }else{
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.resetForm();
            }
          })
          
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.changeForm.resetFields();
      this.$emit('closeDilog')
    }
  },
  created(){
    
  }
};
</script>

<style scoped>
.el-form {
  width: 60%;
}
</style>
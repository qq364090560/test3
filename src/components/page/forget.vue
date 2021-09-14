<template>
  <div class="login-wrap">
      <div class="ms-login">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
              <el-form-item prop="用户名">
                  <el-input v-model="ruleForm.account" placeholder="username">
                      <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                  </el-input>
              </el-form-item>
              <el-form-item prop="密码">
                  <el-input type="password" placeholder="password" v-model="ruleForm.pwd" @keyup.enter.native="submitForm('ruleForm')">
                      <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                  </el-input>
              </el-form-item>
              <div class="login-btn">
                  <el-button type="primary" @click="submitForm('ruleForm')">确 认</el-button>
              </div>
              <!-- <p class="login-tips">Tips : 用户名和密码随便填随便填。</p> -->
          </el-form>
      </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
        }
      };
    },
    methods: {
      
    }
  }
</script>
<style>
.login-wrap{
      position: relative;
      width:100%;
      height:100%;
      /* background-image: url(../../assets/img/login-bg.jpg); */
      background-size: 100%;
  }
  .ms-login{
      position: absolute;
      left:50%;
      top:50%;
      width:400px;
      /* height: 300px; */
      margin:-190px 0 0 -175px;
      border-radius: 5px;
      background: rgba(255,255,255, 1);
      overflow: hidden;
  }
</style>
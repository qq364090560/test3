<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">智远创能管理系统</div>
            <!-- <div class="ms-title">智能平台管理系统</div> -->
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="account">
                    <el-input v-model="ruleForm.account" placeholder="请输入账号">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="pwd">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.pwd" show-password @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <div>
                    <!-- <el-link type="primary" href="https://www.baidu.com" target="blank">忘记密码？</el-link> -->
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填随便填。</p> -->
            </el-form>
        </div>
        <div class="foot">
            <div class="footfont">我是占位~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</div>
        </div>
    </div>
</template>

<script>
import {webLogin} from '../../api/api'
    export default {
        data: function(){
            return {
                ruleForm: {
                    account: '',
                    pwd: ''
                },
                rules: {
                    account: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    pwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm() {
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        console.log(valid)
                        webLogin(this.ruleForm).then(res=>{
                            if(res.status==200){
                                let data=res.data
                                this.$message({
                                    message: res.message,
                                    type: 'success'
                                });
                                this.$store.commit('user/SetUserInfo',data.userInfo)
                                this.$store.commit('user/SetToken',data.token)
                                this.$router.push('/');
                               
                            }else{
                                this.$message.error(res.message);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        /* background-image: url(../../assets/img/login-bg.jpg); */
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #000;
        border-bottom: 1px solid #ddd;
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
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
        /* padding-top: 50px; */
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        /* line-heigh:#000; */
    }
    .foot{
        height: 100%;
        display: flex;
        /* justify-content: center; */
        align-items: center;
        flex-direction: column-reverse;
    }
    .footfont{
        width: 400px;
        color: #fff;
        text-align: center;
    }
</style>
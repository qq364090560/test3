<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :show-close='false'>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm"  hide-required-asterisk>
          <el-form-item label="用户名称" prop="userName">
              <el-input v-model="addForm.userName"></el-input>
          </el-form-item>
          <el-form-item v-if="title=='添加用户'" label="登陆账号" prop="account">
              <el-input v-model="addForm.account"></el-input>
          </el-form-item>
          <el-form-item v-if="title=='添加用户'" label="密码" prop="pwd">
              <el-input type="password" v-model="addForm.pwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户组" prop="groupId">
            <el-cascader
              v-model="addForm.groupId"
              :options="ugOptions"
              :props="ugProps"
              @change="handleChange"
              clearable>
            </el-cascader>
          </el-form-item>
          <el-form-item label="联系电话" prop="userMobile">
              <el-input v-model="addForm.userMobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
              <el-input v-model="addForm.userEmail" autocomplete="off"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import {getGroups,addOneUser,updateOneUser} from '../../../api/api'
export default {
  props:{
    dialogFormVisible:Boolean,
    title:'',
    rowData:{}
  },
  data() {
    var validateTel = (rule, value, callback) => {
      if (value.length != 11) {
        callback(new Error('请输入正确的电话'));
      }else{
        callback();
      }
    };
    return {
      addForm: {
        userName: "",
        account:"",
        pwd: "",
        groupId: "",
        userEmail:"",
        userMobile:"",
      },
      ugProps:{
        value:"ugId",label:"ugName",children:"child",checkStrictly: true, expandTrigger: 'hover' 
      },
      ugOptions:[],
      rules: {
        userName: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 2, max: 15, message: "请输入2到15的字符" }
        ],
        account:[
           { required: true, message: "请输入账号", trigger: "blur" },
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "请输入6到20的密码" }
        ],
        groupId: [{ required: true, message: "请选择角色", trigger: "change" }],
        userEmail:[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        userMobile:[
          // { required: true, message: '电话不能为空'},
          // { min: 11, max: 11, message: "请输入正确的电话" }
          { validator: validateTel, trigger: 'blur'},
        ],
      }
    };
  },
  created(){
    let groupId=JSON.parse(sessionStorage.getItem('userInfo')).groupId
    getGroups({groupId}).then(res=>{
      this.ugOptions=res.data
    })
  },
  updated(){
    if(this.title=='编辑用户'){
      console.log(this.rowData)
      this.addForm=this.rowData
    }
  },
  methods: {
    handleChange(value) {
        console.log(value);
        this.addForm.groupId=value[value.length-1]
    },
    // 添加 编辑
    submitForm() {
      if(this.title==='添加用户'){
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let obj=this.addForm
            addOneUser(obj).then(res=>{
              this.$message({
                message:res.message,
                type: "success",
              });
              this.resetForm()
              this.$parent.getData()
            })
          } else {
            return false;
          }
        });
      }else{
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let obj=this.addForm
            updateOneUser(obj).then(res=>{
              this.$message({
                message:res.message,
                type: "success",
              });
              this.resetForm()
              this.$parent.getData()
            })
          } else {
            return false;
          }
        });
      }
    },
    resetForm() {
      this.$refs.addForm.resetFields();
      this.$emit('closeDilog')
    }
  },
  
};
</script>

<style scoped>
.el-form{
  width: 60%;
}
</style>
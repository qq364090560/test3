<template>
    <el-dialog title="编辑用户" :visible.sync="dialogEdit" :close-on-click-modal="false" :show-close='false'>
      <el-form :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm"  hide-required-asterisk>
          <el-form-item label="用户名称" prop="userName">
              <el-input v-model="addForm.userName"></el-input>
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
    dialogEdit:Boolean,
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
        groupId: [{ required: true, message: "请选择角色", trigger: "change" }],
        userEmail:[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        userMobile:[
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
  mounted(){
    let Data=this.deepClone(this.rowData)
    this.addForm=Data
  },
  methods: {
    deepClone(origin, target, filter){
        var toStr = Object.prototype.toString,
          arrStr = '[object Array]',
          target = target || (toStr.call(origin) === arrStr ? [] : {});
        for (let prop in origin) {
          if (filter) {
            if (prop === filter) {
              break;
            }
          }
          if (origin.hasOwnProperty(prop)) {
            if (origin[prop] !== null && typeof(origin[prop]) === 'object') {
              if (toStr.call(origin[prop]) === arrStr) {
                target[prop] = [];
              } else {
                target[prop] = {};
              }
              common.deepClone(origin[prop], target[prop], filter);
            } else {
              target[prop] = origin[prop];
            }
          }
        }
        return target;
    },
    handleChange(value) {
        console.log(value);
        this.addForm.groupId=value[value.length-1]
    },
    // 编辑
    submitForm() {
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

<template>
  <el-container class="container">
    <el-dialog title="添加组织" :visible.sync="dialogFormVisible">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
         <el-form-item label="父级组织" prop="pid">
            <el-cascader
              :options="pidOptions"
              :props="props1"
              @change="handlePid"
              clearable>
            </el-cascader>
          </el-form-item>
          <el-form-item label="组织名称" prop="oName">
              <el-input v-model="addForm.oName"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
              <el-input v-model="addForm.remark"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClear">取 消</el-button>
        <el-button type="primary" @click="onAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-card class="left-card">
      <div class="text item">
        <el-row>
          <el-col>
            <el-row>
              <el-col style="padding:0 5px" :span="12"><el-button class="headbtn" type="primary" @click="onShow">添加</el-button></el-col>
              <el-col style="padding:0 5px" :span="12"><el-button class="headbtn" type="danger" @click="onDel">删除所选</el-button></el-col>
            </el-row>
            <h4 style="padding:10px">组织管理</h4>
          </el-col>
          <el-col>
            <el-tree :data="data" show-checkbox :props="defaultProps" @node-click="handleNodeClick" @check="isCheak">
            </el-tree>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="right-card">
      <div class="text item" v-if="formShow">
        <el-form ref="form" :model="form" :rules='rules' label-width="120px">
            <el-form-item label="父级组织" prop="pid">
                <el-cascader
                  :placeholder="optionValue"
                  :options="options"
                  :props="props"
                  @change="handleChange"
                  clearable>
                </el-cascader>
            </el-form-item>
            <el-form-item label="组织名称" prop="oname">
                <el-input v-model="form.oname"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="oremark">
                <el-input v-model="form.oremark"></el-input>
            </el-form-item>
            <el-form-item label="时间">
                <el-input v-model="form.ocreateTime" readonly></el-input>
            </el-form-item>
            
            <div class="saveBtn">
                <el-button type="primary" @click="onSave">保存</el-button>
                <!-- <el-button>取消</el-button> -->
            </div>
        </el-form>
      </div>
      <div v-else>请选择左边树</div>
    </el-card>
  </el-container>
</template>
<script>
import {getOrgs,addOneOrg,updateOneOrg,deleteOrg} from '../../../api/api'
export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: "child",
        label: "oname"
      },
      formShow:false,
      form: {},
      rules:{
        pid:[{ required: true, message: '请选择父级组织', trigger: 'blur' }],
        oname:[{ required: true, message: '请输入父级名称', trigger: 'blur' }],
        oremark:[{ required: true, message: '请输入备份', trigger: 'blur'}],
      },
      props:{
          value:"oid",label:"oname",children:"child",checkStrictly: true, expandTrigger: 'hover' 
      },
      props1:{
          value:"oid",label:"oname",children:"child",checkStrictly: true, expandTrigger: 'hover' 
      },
      pidOptions:[],
      options:[],
      optionValue:null,
      dialogFormVisible:false,
      addForm:{},
      treeArr:[],
    };
  },
  created(){
    this.getData()
  },
  methods: {
    getData(){
      let obj={
        userid:JSON.parse(sessionStorage.getItem('userInfo')).userId,
        groupid:JSON.parse(sessionStorage.getItem('userInfo')).groupId
      }
      getOrgs(obj).then((data)=>{
        let Data=data.data
        this.data=Data
        this.data.map((item)=>{
          if(item.child){
            item.child.map((i)=>{
              if(i.oparentId==item.orgId){
                i.PName=item.orgName
              }
            })
          }
        })
       
        this.options=Data
        this.pidOptions=Data
      })
    },
    handlePid(value) {
        this.addForm.pid=value[value.length-1]
    },
    handleChange(value) {
      console.log(value)
      this.form.pid=value[value.length-1]
    },
    onClear(){
      this.addForm={}
      this.dialogFormVisible=false;
    },
    onAdd(){
      this.$refs.addForm.validate((valid) => {
          if (valid) {
            addOneOrg(this.addForm).then((res)=>{
              this.$message({
                message: res.message,
                type: 'success'
              });
              this.getData()
              this.addForm={};
              this.$refs.addForm.resetFields();
              this.dialogFormVisible=false;
            })
          } else {
            alert('error submit!!');
            return false;
          }
      });
      
    },
    isCheak(data,node){
      node.checkedNodes.map((item)=>{
        this.treeArr.push(item.oid)
      })
      console.log(data,node)
    },
    onShow(){
      this.dialogFormVisible=true;
    },
    onDel(){
      let oid={
        oId:this.treeArr.join()
      }
      deleteOrg(oid).then((res)=>{
        this.getData()
        this.$message({
          message: res.message,
          type: 'success'
        });
      })
    },
    onSave(){
      console.log(this.form)
      this.$refs.form.validate((valid) => {
        if(valid){
          let obj={
            pid:this.form.pid,
            oid:this.form.oid,
            oName:this.form.oname,
            remark:this.form.oremark
          }
          updateOneOrg(obj).then((res)=>{
            if(res.status){
              this.$message({
                message: res.message,
                type: 'success'
              });
            }else{
              this.$message.error(res.message);
            }
          })
        }
      })
      
    },
    handleNodeClick(data) {
      this.formShow=true
      this.form=data
      console.log(data)
    }
  }
};
</script>
<style scoped>
.container{
  height: 100%;
  padding: 10px;
}
.left-card{
  width: 280px;
}
.right-card{
  flex: 1;
  margin-left: 10px;
}
.headbtn{
  width: 100%;
}
.saveBtn{
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
</style>
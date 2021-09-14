
<template>
  <el-container class="container">
    <el-dialog title="添加组织" :visible.sync="dialogFormVisible">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
          <el-form-item label="父级标识" prop="ugParentGroupId">
              <el-cascader
                :options="pidOptions"
                :props="props1"
                @change="handlePid"
                clearable>
              </el-cascader>
          </el-form-item>
          <el-form-item label="用户组名称" prop="ugName">
              <el-input v-model="addForm.ugName"></el-input>
          </el-form-item>
          <el-form-item label="组织标识" prop="ugOrgId">
              <el-cascader
                :options="ugOptions"
                :props="ugProps"
                @change="ugHandle"
                clearable>
              </el-cascader>
          </el-form-item>
          <el-form-item label="备注" prop="ugRemark">
              <el-input v-model="addForm.ugRemark"></el-input>
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
              <el-col style="padding:0 5px" :span="12"><el-button class="headbtn" type="primary" @click="onShow" v-btnShow="'insert'">添加</el-button></el-col>
              <el-col style="padding:0 5px" :span="12"><el-button class="headbtn" type="danger" @click="onDel" v-btnShow="'delete'">删除所选</el-button></el-col>
            </el-row>
            <h4 style="padding:10px">用户组管理</h4>
          </el-col>
          <el-col>
            <el-tree :data="data" show-checkbox :props="defaultProps" @node-click="handleNodeClick" @check="isCheak">
               <!-- :check-strictly="true" -->
            </el-tree>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="right-card">
        <div class="text item" v-if="form">
            <el-form ref="form" :model="form" :rules='rules' label-width="120px" v-if="formShow">
                <el-form-item label="用户组名称" prop="ugName">
                    <el-input v-model="form.ugName"></el-input>
                </el-form-item>
                <el-form-item label="组织id" prop="ugOrgId">
                    <!-- <el-input v-model="form.ugOrgId" readonly></el-input> -->
                    <el-cascader
                      :options="orgOptions"
                      :props="orgProps"
                      @change="orgHandle"
                      clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item label="父级标识" prop="ugParentGroupId">
                    <el-input v-model="form.ugParentGroupId"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="ugRemark">
                    <el-input v-model="form.ugRemark"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-input :value="form.ugCreateTime" readonly></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSave" v-btnShow="'update'">保存</el-button>
                    <!-- <el-button>取消</el-button> -->
                </el-form-item>
            </el-form>
            <div v-else>请选择左边树</div>
        </div>
    </el-card>
  </el-container>
</template>
<script>
import {getGroups,getOrgs,getOneOrg,addOneGroup,updateOneGroup,deleteOneGroup} from '../../../api/api'
export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: "child",
        label: "ugName"
      },
      formShow:false,
      form: {},
      rules:{
        ugName:[{ required: true, message: '请选择父级组织', trigger: 'blur' }],
        ugOrgId:[{ required: true, message: '请输入父级名称', trigger: 'blur' }],
        ugParentGroupId:[{ required: true, message: '请输入备份', trigger: 'blur'}],
        ugRemark:[{ required: true, message: '请输入备份', trigger: 'blur'}],
      },
      props:{
        value:"oid",label:"oname",children:"child",checkStrictly: true, expandTrigger: 'hover' 
      },
      props1:{
        value:"ugId",label:"ugName",children:"child",checkStrictly: true, expandTrigger: 'hover' 
      },
      ugProps:{
        value:"oid",label:"oname",children:"child",checkStrictly: true, expandTrigger: 'hover' 
      },
      orgProps:{
        value:"oid",label:"oname",children:"child",checkStrictly: true, expandTrigger: 'hover' 
      },
      orgOptions:[],
      ugOptions:[],
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
        groupId:JSON.parse(sessionStorage.getItem('userInfo')).groupId
      }
      getGroups(obj).then((data)=>{
        let Data=data.data
        this.data=Data
        this.data.map((item)=>{
        })
        let objs={
          userid:JSON.parse(sessionStorage.getItem('userInfo')).userId,
          groupid:JSON.parse(sessionStorage.getItem('userInfo')).groupId
        }
        getOrgs(objs).then((data)=>{
          // console.log(data)
          this.ugOptions = data.data
          this.orgOptions=data.data
        })
        this.options=Data
        this.pidOptions=Data

      })
    },
    // 次级选择事件
    ugHandle(value){
      this.addForm.ugOrgId=value[value.length-1]
    },
    orgHandle(value){
      this.form.ugOrgId=value[value.length-1]
    },
    handlePid(value) {
        this.addForm.ugParentGroupId=value[value.length-1]
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
            addOneGroup(this.addForm).then((res)=>{
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
    // 树节点框点击事件
    isCheak(data,node){
      node.checkedNodes.map((item)=>{
        this.treeArr.push(item.ugId)
      })
      let arr = new Set([...this.treeArr])
      this.treeArr=[...arr]
      // console.log(data,node)
    },
    onShow(){
      this.dialogFormVisible=true;
    },
    onDel(){
      let ugId={
        ugId:this.treeArr.join()
      }
      deleteOneGroup(ugId).then((res)=>{
        this.getData()
        this.$message({
          message: res.message,
          type: 'success'
        });
      })
    },
    onSave(){
      this.$refs.form.validate((valid) => {
        if(valid){
          let obj={
            ugParentGroupId:this.form.ugParentGroupId,
            ugName:this.form.ugName,
            ugOrgId:this.form.ugOrgId,
            ugRemark:this.form.ugRemark,
            ugId:this.form.ugId
          }

          updateOneGroup(obj).then((res)=>{
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
      let Data=this.$common.deepClone(data)
      this.form=Data
      this.ugOptions.map(item=>{
        if(item.oid==data.ugOrgId){
          item.orgName=item.oname
        }else{
          item.child.map(i=>{
            if(i.oid==data.ugOrgId){
              i.orgName=i.oname
            }
          })
        }
      })
      console.log(this.ugOptions)
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

<template>
  <el-container class="container">
    <el-dialog title="添加菜单" :visible.sync="dialogFormVisible">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
          <el-form-item label="菜单中文名" prop="mnameCn">
              <el-input v-model="addForm.mnameCn"></el-input>
          </el-form-item>
          <el-form-item label="站点ID" prop="mid">
              <el-input v-model="addForm.msiteId"></el-input>
          </el-form-item>
          <el-form-item label="唯一标识" prop="msign">
              <el-input v-model="addForm.msign"></el-input>
          </el-form-item>
          <el-form-item label="父级菜单" prop="mparentMenuId">
              <el-cascader
                :options="options"
                :props="props"
                @change="handleChange"
                clearable>
              </el-cascader>
          </el-form-item>
          <!-- <el-form-item label="父级菜单标识" prop="mparentMenuId">
              <el-input v-model="addForm.mparentMenuId"></el-input>
          </el-form-item> -->
          <el-form-item label="路由" prop="mhref">
              <el-input v-model="addForm.mhref"></el-input>
          </el-form-item>
          <el-form-item label="功能" prop="mfunction">
              <el-input v-model="addForm.mfunction"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="morder">
              <el-input v-model="addForm.morder" placeholder="排序是从小到大"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="micon">
              <el-input v-model="addForm.micon"></el-input>
          </el-form-item>
          <el-form-item label="停用/启用标识" prop="mdelFlag">
              <el-radio-group v-model="addForm.mdelFlag">
                  <el-radio :label="0">停用</el-radio>
                  <el-radio :label="1">启用标识</el-radio>
              </el-radio-group>
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
            <h4 style="padding:10px">菜单管理</h4>
          </el-col>
          <el-col>
            <el-tree :data="data" show-checkbox :props="defaultProps" @node-click="handleNodeClick" @check="isCheak">
            </el-tree>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="right-card">
      <div class="text item" v-if="form">
        <el-form ref="form" :model="form" :rules='rules' label-width="120px" v-if="formShow">
            <el-form-item label="菜单中文名" prop="mnameCn">
                <el-input v-model="form.mnameCn"></el-input>
            </el-form-item>
            <el-form-item label="站点ID" prop="msiteId">
                <!-- <el-input v-model="form.msiteId"></el-input> -->
                <el-radio-group v-model="form.msiteId" v-for="(it,index) in this.sites" :key="index">
                  <el-radio style="margin-left:20px" :label="it.sid">{{it.sname}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="唯一标识" prop="msign">
                <el-input v-model="form.msign" readonly></el-input>
            </el-form-item>
            <el-form-item label="父级菜单标识" prop="mparentMenuId">
                <el-input v-model="form.mparentMenuId"></el-input>
            </el-form-item>
            <el-form-item label="路由" prop="mhref">
                <el-input v-model="form.mhref"></el-input>
            </el-form-item>
            <el-form-item label="功能" prop="mfunction">
                <!-- <el-input v-model="form.mfunction"></el-input> -->
                <el-checkbox-group v-model="form.mfunction">
                  <el-checkbox label="query">查询</el-checkbox>
                  <el-checkbox label="insert">添加</el-checkbox>
                  <el-checkbox label="delete">删除</el-checkbox>
                  <el-checkbox label="update">保存</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="排序" prop="morder">
                <el-input v-model="form.morder"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="micon">
                <el-input v-model="form.micon"></el-input>
            </el-form-item>
            <el-form-item label="停用/启用标识" prop="mdelFlag">
                <el-radio-group v-model="form.mdelFlag">
                    <el-radio :label="0">停用</el-radio>
                    <el-radio :label="1">启用标识</el-radio>
                </el-radio-group>
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
import {getAll,deleteMenu,updateOne,addOne} from '../../../api/api'
export default {
  data() {
    return {
      data: [],
      sites:[],
      defaultProps: {
        children: "childMenu",
        label: "mnameCn"
      },
      formShow:false,
      form: {},
      rules:{
        mnameCn:[{ required: true, message: '请输入菜单中文名', trigger: 'blur' }],
        mid:[{ required: true, message: '请输入站点ID', trigger: 'blur' },],
        msIteId:[{ required: true, message: '请输入站点ID', trigger: 'blur'},],
        msign:[{ required: true, message: '请输入唯一标识', trigger: 'blur' },],
        mparentMenuId:[{ required: true, message: '请输入父级菜单标识', trigger: 'blur' },],
        mhref:[{ required: true, message: '请输入路由', trigger: 'blur' },],
        mfunction:[{ required: true, message: '请输入功能', trigger: 'blur' },],
        morder:[{ required: true, message: '请输入排序', trigger: 'blur' },],
        mdelFlag:[{ required: true, message: '请选择停用/启用标识', trigger: 'blur' },],
      },
      props:{
          value:"mid",label:"mnameCn",children:"childMenu",checkStrictly: true, expandTrigger: 'hover' 
      },
      options:[
      ],
      dialogFormVisible:false,
      addForm:{
      },
      treeArr:[],
    };
  },
  created(){
    this.getData()
  },
  methods: {
    getData(){
      getAll().then((data)=>{
        let Data=data.data
        this.data=Data.menus;
        this.options=Data.menus;
        this.sites=Data.sites
        // this.form=Data.menus.map((item)=>{
        //   item
        // })
      })
    },
    handleChange(value) {
        this.addForm.mparentMenuId=value[value.length-1]
    },
    onClear(){
      this.addForm={}
      this.dialogFormVisible=false;
    },
    onAdd(){
      this.$refs.addForm.validate((valid) => {
          if (valid) {
            addOne(this.addForm).then((res)=>{
              this.$refs.addForm.resetFields();
              this.dialogFormVisible=false;
              this.getData()
            })
          } else {
            alert('error submit!!');
            return false;
          }
      });
      
    },
    isCheak(data,node){
      node.checkedNodes.map((item)=>{
        this.treeArr.push(item.mid)
      })
      // console.log(node)
    },
    onShow(){
      this.dialogFormVisible=true;
    },
    onDel(){
      let menuId={
        menuId:this.treeArr.join()
      }
      deleteMenu(menuId).then((res)=>{
        this.getData()
        this.$message({
          message: res.message,
          type: 'success'
        });
      })
    },
    append(data) {
      let id=1
      const newChild = { id: id++, label: 'testtest', children: [] };
      if (!data.children) {
        this.$set(data, 'testtest', []);
      }
      data.testtest.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
            <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
          </span>
        </span>);
    },
    onSave(){
      let Data=this.$common.deepClone(this.form)

      Data.mfunction=Data.mfunction.join()
      console.log(Data)
      this.$refs.form.validate((valid) => {
        if(valid){
          updateOne(Data).then((res)=>{
            if(res.status){
              this.$message({
                message: res.message,
                type: 'success'
              });
              this.getData()
            }else{
              this.$message.error(res.message);
            }
          })
        }else{
          return
        }
      })
    },
    handleNodeClick(data) {
      let Data=this.$common.deepClone(data)
      this.form=Data

      if(this.form.mfunction){
        this.form.mfunction=this.form.mfunction.split(",")
      }else{
        this.form.mfunction=[]
      }
      this.formShow=true
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
</style>
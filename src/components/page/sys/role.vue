<template>
  <el-container class="container">
    <el-card class="left-card">
      <div class="text item">
        <el-row>
          <el-col>
            <h4 style="padding:10px">组织列表</h4>
           
          </el-col>
          <el-col>
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
            </el-tree>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="right-card">
       <el-button type="primary" @click="dialogFormVisible=true">添加角色</el-button>
      <el-card class="rTopCard">
        <el-row  type="flex" justify="end" v-if="tags.length">
          <el-col :span="2">
              <el-button :type="rdelFlag?'danger' : 'primary'" @click="onDel(val)" :disabled="!val?true:false">{{rdelFlag ? '禁用角色' : '启用角色'}}</el-button>
          </el-col>
          <el-col :span="3">
            <el-select v-model="val" placeholder="请选择" @change="changeFlag">
              <el-option
                v-for="item in tags"
                :key="item.rid"
                :label="item.roleName"
                :value="item.rid">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <div v-if="tags.length>0">
          <el-row>
            <el-button
               v-for="(item,i) in tags" :key="i" @click="tagsHandle(item.rid,i)"
             :type="activeIndex == i ? 'primary' : ''" :disabled="item.rdelFlag? false : true">{{item.roleName}}</el-button>
          </el-row>
        </div>
        <div v-else>数据为空</div>
      </el-card>
      <el-card class="rBottomCard">
        <div class="flex">
          <div class="tree">
            <el-row>
              <el-col>
                <h4 style="padding:10px">系统授权</h4>
              </el-col>
              <el-col>
                <el-tree
                  style="height:50vh;overflow:auto;"
                  :data="menuData" 
                  show-checkbox 
                  ref="tree"
                  :props="menuProps" 
                  node-key="mid"
                  @node-click="menuHandle"
                  @check="isCheak">
                </el-tree>
              </el-col>
            </el-row>
          </div>
          <div class="menuBox" v-if="authority">
            <div class="center">
              <div class="center" v-if="authority.mfunction">
                <h1>{{authority.mnameCn + '权限'}}</h1>
                <el-checkbox-group class="menuCheckbox" v-model="checkList" @change="clickChange">
                  <el-checkbox label="query">查询</el-checkbox>
                  <el-checkbox label="insert">添加</el-checkbox>
                  <el-checkbox label="delete">删除</el-checkbox>
                  <el-checkbox label="update">更新</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <div class="footBtn" v-if="authority">
          <el-button id="btn" type="primary" @click="onSave">保存</el-button>
        </div>
      </el-card>
    </el-card>

    <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <!-- <el-form-item label="组织id" prop="orgId">
              <el-input v-model="addForm.orgId"></el-input>
          </el-form-item> -->
          <el-form-item label="组织标识" prop="orgId">
              <el-cascader
                :options="orgOptions"
                :props="orgProps"
                @change="orgHandle"
                clearable>
              </el-cascader>
          </el-form-item>
          <el-form-item label="备注" prop="rRemark">
              <el-input v-model="addForm.rRemark"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClear">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {getOrgs,getRoles,addOneRole,updateOneRole,deleteOneRole,addMenusToRole,getMenusByRole,getAll} from '../../../api/api'

  export default {
    data(){
      return{
        activeIndex:-1,
        val : '',
        rdelFlag:1,
        authority:'',
        checkList:[],
        rId:null,
        // 弹窗
        dialogFormVisible:false,
        addForm:{},
        rules:{
          roleName:[{ required: true, message: '请输入角色名称', trigger: 'blur' }],
          orgId:[{ required: true, message: '请选择组织', trigger: 'blur' }],
          rRemark:[{ required: true, message: '请输入备份', trigger: 'blur'}],
        },
        orgProps:{
          value:"oid",label:"oname",children:"child",checkStrictly: true, expandTrigger: 'hover' 
        },
        orgOptions:[],
        // 组织树
        data:[],
        defaultProps: {
          children: "child",
          label: "oname"
        },
        treeArr:[],
        tags:[],
        // 菜单树
        menuData:[],
        menuProps: {
          children: "childMenu",
          label: "mnameCn"
        },
        menuArr:[],
        // menus:[]
      }
    },
    methods:{
      //开关
      clickChange(v){
        this.authority.mfunction=v.join(',')
      },
      changeFlag(v){
        this.tags.map(it=>{
          if(it.rid==v){
            this.rdelFlag=it.rdelFlag
          }
        })
        console.log(this.rdelFlag)

      },
      onDel(rId){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          setTimeout(()=>{

            deleteOneRole({rId:rId,delFlag:!this.rdelFlag}).then(res=>{
              this.$message({
                type: 'success',
                message: '成功'
              });
              getRoles({orgId:rId}).then(data=>{
                this.tags=data.data
              })
            })
          },10)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });           
        });

      },
      onSave(){
        let tree=this.$refs.tree.getCheckedNodes(false, true);
        let treeChild=[]
        tree.map(it=>{
            let obj={menuId:it.mid,function:it.mfunction}
            treeChild.push(obj)
        })
        let obj={
          rId:this.rId,
          menus:JSON.stringify(treeChild)
        }
        addMenusToRole(obj).then((res)=>{
          if(res.status==200){
            this.$message({
              message: res.message,
              type: 'success'
            });
          }else{
            this.$message.error(res.message);
          }
        })
        
      },
      onClear(){
        this.addForm={}
        this.dialogFormVisible=false;
      },
      addRole(){
        this.$refs.addForm.validate(valid => {
          if(valid){
            addOneRole(this.addForm).then(res=>{
              this.$message({
                message: res.message,
                type: 'success'
              });
              this.onClear()
            })
          }else{
            return
          }
        })
       
      },
      orgHandle(value){
        this.addForm.orgId=value[value.length-1]
      },
      // tree事件
      handleNodeClick(data) {
        this.menuData=[]

        getRoles({orgId:data.oid}).then(data=>{
          this.tags=data.data
        })
      },
      menuHandle(data) {
        console.log(data)
        this.authority=data
        if(data.mfunction){
          this.checkList=data.mfunction.split(',')
        }
      },
      isCheak(data,node){
        console.log(data,node)
        this.menuArr=node.checkedNodes
      },
      // tag标签点击事件
      tagsHandle(v,i){
        this.activeIndex=i
        this.rId=v
        this.$axios.all([getAll(),getMenusByRole({rId:v})]).then(res=>{
          this.menuData=res[0].data.menus
          let res2=res[1].data
          let arr=[]
          let a=[]

          res2.map(i=>{
            this.menuData.map(item=> {
              if(i.mId==item.mid){
                arr.push(item)
              }
              item.childMenu.map(v=>{
                if(v.mid==i.mId){
                  arr.push(v)
                }
              })
            })
          })

          arr.map(i=>{
            if(i.childMenu==null){
              a.push(i.mid)
            }
          })

          this.$refs.tree.setCheckedKeys(a);
        })

      }
    },
    created(){
      let obj={
        userid:JSON.parse(sessionStorage.getItem('userInfo')).userId,
        groupid:JSON.parse(sessionStorage.getItem('userInfo')).groupId
      }
      getOrgs(obj).then((data)=>{
          this.data=data.data
          this.orgOptions=data.data
      })

    }
  }
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
.rTopCard{
  margin-bottom: 20px;
}
.tagss{
    font-size: 15px;
    cursor: pointer;
    margin:2px 5px;
}
.tagss.active { 
    background-color: #409eff;
    color: #fff;
}
/* .disable{
    background-color: red!important;
    color:#fff;
} */
.rBottomCard{
  height: 65vh;
  position: relative;
}
.flex{
  display: flex;
  max-height:50vh ;
}
.menuBox{
  margin-bottom: 20px;
  overflow-y: auto;
  height: 56vh;
  width: 50%;
}
.el-switch{
  margin: 30px  0;
}
.center{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.menuCheckbox{
  margin-top: 20px;
}
.tree{
  height: 50vh;
}
.footBtn{
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  position: relative;
}
#btn{
  position: absolute;
  bottom: 20;
}
</style>
<template>
  <el-container class="container">
    <el-card style="margin-right:10px" class="left-card">
      <div class="text item">
        <el-row>
          <el-col>
            <h4 style="padding:10px">停车场序列</h4>
          </el-col>
          <el-col>
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick">
            </el-tree>
          </el-col>
        </el-row>
        <div class="pagination">
          <el-pagination
            layout="total,prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-size="size"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <el-card class="left-card">
      <div class="text item">
        <el-row>
          <el-col>
            <el-row>
              <el-col v-if="cardData.pId" style="padding:0 5px" :span="12"><el-button class="headbtn" type="primary" @click="drivewayVisible=true" v-btnShow="'insert'">添加</el-button></el-col>
              <!-- <el-col style="padding:0 5px" :span="12"><el-button class="headbtn" type="danger" @click="onDel">删除所选</el-button></el-col> -->
            </el-row>
            <el-row>
              <h4 style="padding:10px">通道序列</h4>
            </el-row>
          </el-col>
          <el-col style="margin:10px 0">
            <el-tree :data="drivewayData" :props="drivewayProps" @node-click="drivewayClick">
            </el-tree>
          </el-col>
        </el-row>
      </div>
      
    </el-card>
    <el-card class="right-card">
      <div v-if="editForm.drivewayName">
        <div slot="header" class="clearfix" style="margin-bottom:20px">
          <span style="font-size:18px">{{editForm.drivewayName}}</span>
        </div>
        <el-form class="editForm" ref="editForm" :model="editForm" :rules="rules" label-width="120px">
          <div style="overflow: auto;">
            <el-form-item>
              <h1 style="margin-bottom:10px">基本信息</h1>
            </el-form-item>
            <el-form-item label="通道名称" prop="drivewayName">
                <el-input style="width:50%" v-model="editForm.drivewayName"></el-input>
            </el-form-item>
            <el-form-item label="通道类型" prop="drivewayType">
                <el-radio-group v-model="editForm.drivewayType">
                  <el-radio :label="1">单行入口</el-radio>
                  <el-radio :label="2">单行出口</el-radio>
                  <el-radio :label="3">双行出入</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否禁用" prop="ptype">
                <el-radio-group v-model="editForm.delFlag">
                  <el-radio :label="0">停用</el-radio>
                  <el-radio :label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
              <h1 style="margin-bottom:10px">其他信息</h1>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="editForm.remark" type="textarea"></el-input>
            </el-form-item>
            
          </div>
          <el-form-item label="控制器" prop="controller">
            <div>
                  <el-button type="primary" @click="addController" v-btnShow="'insert'">添加控制器</el-button>
                  <el-select v-model="setValue" placeholder="请选择" @change="getSetValue" clearable >
                    <el-option
                      v-for="item in setOptions"
                      :key="item.sn"
                      :label="item.wgName"
                      :value="item.sn">
                    </el-option>
                  </el-select>
            </div>
               <!-- <el-radio-group v-model="editForm.controllers">
                  <el-radio-button v-for="it in controller" :key="it.sn"  :label="it.wgName">{{it.wgName}}</el-radio-button>
                </el-radio-group> -->
                <el-tag
                  v-for="it in controller"
                  :key="it.sn"
                  closable
                  disable-transitions
                  @close="tagClose(it)"
                  effect="dark"
                  >
                  {{it.wgName}}
                </el-tag>
          </el-form-item>
          <el-form-item label="人脸相机" prop="controller">
            <div>
              <el-button type="primary" @click="addFaceCamera" v-btnShow="'insert'">添加人脸相机</el-button> 
              <el-select v-model="setfaceCamera" placeholder="请选择" @change="getFaceCamera" clearable >
                <el-option
                  v-for="item in setCamera"
                  :key="item.sn"
                  :label="item.wgName"
                  :value="item.sn">
                </el-option>
              </el-select>
            </div>
            <el-tag
              v-for="it in faceCamera"
              :key="it.sn"
              closable
              disable-transitions
              @close="tagClose(it)"
              effect="dark"
              >
              {{it.wgName}}
            </el-tag>
          </el-form-item>
          <div class="saveBtn">
            <el-button type="danger" @click="onDel">彻底删除</el-button>
            <el-button type="primary" @click="onSave" v-btnShow="'update'">保存</el-button>
          </div>
        </el-form> 
      </div>
      <div v-else>
        请先选择通道
      </div>
    </el-card>
    <el-dialog title="添加通道" :visible.sync="drivewayVisible">
      <el-form class="addForm" ref="addForm" :model="addForm" :rules="rules" label-width="120px">
          <el-form-item label="通道名称" prop="drivewayName">
              <el-input style="width:50%" v-model="addForm.drivewayName"></el-input>
          </el-form-item>
          <el-form-item label="通道类型" prop="drivewayType">
              <el-radio-group v-model="addForm.drivewayType">
                <el-radio label="1">单行入口</el-radio>
                <el-radio label="2">单行出口</el-radio>
                <el-radio label="3">双行出入</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
              <el-input v-model="addForm.remark" type="textarea"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClear">取 消</el-button>
        <el-button type="primary" @click="onAdd">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  queryParkingLotsByOrg,drivewayQuery,drivewayInsert,drivewayUpdate,drivewayDel,getControllers,deleteControllerBind,bindController
} from '../../../api/api'
  export default {
    data(){
      return{
        //控制器
        controller:"",
        //控制器选择框
        setValue:'',
        setOptions:[],
        newValue:{},
        //人脸
        setfaceCamera:'',
        setCamera:[],
        faceCamera:[],

        treeData:[],
        defaultProps: {
          children: "",
          label: "pName"
        },
        drivewayData:[],
        drivewayProps: {
          children: "",
          label: "drivewayName"
        },
        page:1,
        size:20,
        total:0,
        drivewayVisible:false,
        // 添加
        addForm:{},
        rules:{
          drivewayName:[{ required: true, message: '请输入停车场名称', trigger: 'blur' }],
          drivewayType:[{ required: true, message: '请选择停车场类型', trigger: 'blur' }],
        },
        cardData:{},
        // 详情
        editForm:{},
        delFlag:''
      }
    },
    created(){
      this.getOrg();
    },
    methods:{
      test(v){
        console.log(v)
      },
      // 获取停车场
      getOrg(){
        let obj={
          groupId:JSON.parse(sessionStorage.getItem('userInfo')).groupId,
          page:this.page,
          size:this.size,
        }
        queryParkingLotsByOrg(obj).then(data=>{
          this.treeData=data.data.list
          this.total=data.data.count
        })
      },
      //分页
      handleSizeChange(val) {
        this.size = val;
        this.getOrg();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getOrg();
      },

      onDel(){
        this.$confirm(`请确认是否删除此通道？确认后将清除所有此通道相关内容！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj={
            drivewayName:this.editForm.drivewayName,
            drivewayId:this.editForm.drivewayId
          }
          drivewayDel(obj).then(res=>{
            if(res.status==200){
              this.$message({
                type: 'success',
                message: '删除成功'
              });
              this.getDriveway()
              this.editForm={}
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      },
      // 保存btn
      onSave(){
        let obj={
          drivewayId:this.editForm.drivewayId,
          drivewayName:this.editForm.drivewayName,
          drivewayType:this.editForm.drivewayType,
          delFlag:this.editForm.delFlag,
          remark:this.editForm.remark,
        }
        drivewayUpdate(obj).then(res=>{
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          this.getDriveway()
        })
      },
      // 关闭弹窗
      onClear(){
        this.$refs.addForm.resetFields()
        this.drivewayVisible=false;
      },
      onAdd(){
        let obj={
          parkingLotId:this.cardData.pId,
          drivewayName:this.addForm.drivewayName,
          drivewayType:this.addForm.drivewayType,
          remark:this.addForm.remark,
        }
        drivewayInsert(obj).then(res=>{
          this.$refs.addForm.resetFields();
          this.drivewayVisible=false;
          this.getDriveway()
        })
      },
      // 组织树事件
      handleNodeClick(data) {
        this.cardData=data;
        this.getDriveway()
        getControllers().then(res=>{
          this.setOptions=res.data
        })
      },
      // 获取通道
      getDriveway(){
        drivewayQuery({park:this.cardData.pId}).then(data=>{
          this.drivewayData=data.data
        })
      },
      // 停车场树事件
      drivewayClick(val) {
        let Data=this.$common.deepClone(val)
        this.editForm=Data
        this.controller=Data.controllers
      },
      
      // 标签关闭事件
      tagClose(tag){
        this.$confirm('确定删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let parmas={
            drivewayId:this.editForm.drivewayId,
            drivewayName:this.editForm.drivewayName,
            wgName:tag.wgName,
            sn:tag.sn,
          }
          deleteControllerBind(parmas).then(res=>{
            if(res.status==200){
              this.$message({
                type: 'success',
                message: '已删除'
              });
              this.getDriveway()
              this.editForm={}
              this.setValue=''
            }else{
              this.$message.error(res.message);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        })
      },
      // 获取下拉框值
      getSetValue(v){
        this.newValue=this.setOptions.filter(it=>it.sn==v)[0]
      },
      //人脸相机
      addFaceCamera(){

      },
      getFaceCamera(v){

      },
      // 添加控制器
      addController(){
        if(this.setValue){
          let parmas={
            drivewayId:this.editForm.drivewayId,
            drivewayName:this.editForm.drivewayName,
            sn:this.newValue.sn,
            wgName:this.newValue.wgName,
          }
          bindController(parmas).then(res=>{
            if(res.status=200){
              this.$message({
                type: 'success',
                message: '添加成功'
              });
              this.getDriveway()
              this.editForm={}
              this.setValue=''
            }else{
              this.$message.error(res.message);
            }
          })
        }else{
          this.$message.error('请先选择控制器');
        }
      },
    },

  }
</script>

<style  scoped>
.container{
  height: 100%;
  padding: 10px;
}
.left-card{
  width: 280px;position: relative;
}
.pagination{
  position: absolute;
  bottom: 0;
}
.right-card{
  flex: 1;
  margin-left: 10px;
  position: relative;
  overflow: auto;
}
.headbtn{
  width: 100%;
}
.addForm{
  width: 80%;
}
.saveBtn{
  float: right;
  position: absolute;
  bottom: 50px;
  right: 50px;
}
.saveleftBtn{
  float: right;
  position: absolute;
  bottom: 50px;
  left: 50px;
}
.editForm{
  width: 80%;
  height: 70vh;
}
</style>
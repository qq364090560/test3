<template>
  <el-container class="container">
    <el-card style="margin-right:10px" class="left-card">
      <div class="text item">
        <el-row>
          <el-col>
            <h4 style="padding:10px">组织管理</h4>
          </el-col>
          <el-col>
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick">
            </el-tree>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card class="left-card">
      <div class="text item">
        <el-row>
          <el-col>
            <el-row>
              <el-col v-if="orgData.oid" style="padding:0 5px" :span="12"><el-button class="headbtn" type="primary" @click="parkVisible=true" v-btnShow="'insert'">添加</el-button></el-col>
              <!-- <el-col style="padding:0 5px" :span="12"><el-button class="headbtn" type="danger" @click="onDel">删除所选</el-button></el-col> -->
            </el-row>
          </el-col>
          <el-col style="margin:10px 0">
            <el-tree :data="parkData" :props="parkProps" @node-click="parkClick">
            </el-tree>
          </el-col>
        </el-row>
      </div>
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
    </el-card>
    <el-card class="right-card">
      <div v-if="editForm.pname">
        <div slot="header" class="clearfix" style="margin-bottom:20px">
          <span style="font-size:18px">{{editForm.pname}}</span>
        </div>
        <el-form class="editForm" ref="editForm" :model="editForm" :rules="rules" label-width="120px">
            <el-form-item>
              <h1 style="margin-bottom:10px">基本信息</h1>
            </el-form-item>
            <el-form-item label="停车场名称" prop="pname">
                <el-input style="width:50%" v-model="editForm.pname"></el-input>
            </el-form-item>
            <!-- <el-form-item label="停车场类型" prop="ptype">
                <el-radio-group v-model="editForm.ptype">
                  <el-radio :label="1">机动车停车场</el-radio>
                  <el-radio :label="2">非机动车停车场</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="创建时间" prop="remark">
                <el-input v-model="editForm.createTime" readonly></el-input>
            </el-form-item>

            <el-form-item>
              <h1 style="margin-bottom:10px">其他信息</h1>
            </el-form-item>
            <el-form-item label="地址" prop="location">
                <el-input v-model="editForm.location"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="editForm.remark" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="组织名称">
                <el-input v-model="editForm.orgName"></el-input>
            </el-form-item>
            
            <el-form-item>
                <h1 style="margin-bottom:10px;float:left;">收费规则</h1>
                <el-button  v-btnShow="'insert'" style="float:right;" type="primary" size="mini" @click="ruleAdd=true">添加收费规则</el-button>
            </el-form-item>
            <h4>机动车</h4>
            <el-collapse style="padding-left:10px" accordion v-for="(it,i) in editForm.motorFeeRules" :key="i">
              <el-collapse-item :title="it.feeName">
                <h3 style="text-align:center">包月规则</h3>
                <el-row v-if="it.monthlyFee" :gutter="20">
                  <el-col :span="12">包月费用:{{it.monthlyFee.monthlyFee}}</el-col>
                  <el-col :span="12">优惠月份:{{it.monthlyFee.discountMonth}}</el-col>
                  <el-col :span="12">优惠折扣率:{{it.monthlyFee.discountFee}}</el-col>
                </el-row>
                <h3 style="text-align:center">临停规则</h3>
                <el-row v-if="it.tempFee" :gutter="20">
                  <el-col :span="12">临停收费（单位：元/小时）:{{it.tempFee.hourFee}}</el-col>
                  <el-col :span="12">临停费用上限（默认-1，表示不设置上限）:{{it.tempFee.upperLimit}}</el-col>
                  <el-col :span="12">临停优惠折扣率:{{it.tempFee.discount}}</el-col>
                </el-row>
                <div>
                  <el-button type="primary" size="mini" @click="editRule(it)"  v-btnShow="'update'">编辑</el-button>
                  <el-button type="danger" size="mini" @click="delRule(it)"  v-btnShow="'delete'">删除</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
        </el-form> 

        <div class="saveleftBtn">
          <el-switch
            v-model="editForm.delFlag"
            @change="switchBtn"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用">
          </el-switch>
          <div class="saveBtn">
            <el-button type="danger" @click="onDel">彻底删除</el-button>
            <el-button type="primary" @click="onSave" v-btnShow="'update'">保存</el-button>
          </div>
        </div>
      </div>
      <div v-else>
        请先选择停车场
      </div>
    </el-card>
    <el-dialog title="添加停车场" :visible.sync="parkVisible">
      <el-form class="addForm" ref="addForm" :model="addForm" :rules="rules" label-width="120px">
          <el-form-item label="停车场名称" prop="pName">
              <el-input style="width:50%" v-model="addForm.pName"></el-input>
          </el-form-item>
          <!-- <el-form-item label="停车场类型" prop="pType">
              <el-radio-group v-model="addForm.pType">
                <el-radio label="1">机动车停车场</el-radio>
                <el-radio label="2">非机动车停车场</el-radio>
              </el-radio-group>
          </el-form-item> -->
          <el-form-item label="地址" prop="location">
              <el-input v-model="addForm.location"></el-input>
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

    <el-dialog v-if="ruleEdit" title="编辑规则" :visible.sync="ruleEdit">
      <el-form class="ruleEdit" ref="ruleEdit" :model="roleEditForm" :rules="rules" label-width="300px">
          <h3 style="text-align:center;margin-bottom:10px">包月规则对象</h3>
          <el-form-item label="包月费用" prop="oName">
              <el-input style="width:50%" v-model="roleEditForm.monthlyFee.monthlyFee"></el-input>
          </el-form-item>
          <el-form-item label="优惠月份" prop="location">
              <el-input style="width:50%" v-model="roleEditForm.monthlyFee.discountMonth"></el-input>
          </el-form-item>
          <el-form-item label="优惠折扣率" prop="remark">
              <el-input style="width:50%" v-model="roleEditForm.monthlyFee.discountFee"></el-input>
          </el-form-item>
          <h3 style="text-align:center;margin-bottom:10px">临停规则对象</h3>
          <div v-if="roleEditForm.feeType==1">
            <el-form-item label="临停收费（单位：元/小时）" prop="oName">
                <el-input style="width:50%" v-model="roleEditForm.tempFee.hourFee"></el-input>
            </el-form-item>
            <el-form-item label="临停费用上限（默认-1，表示不设置上限）" prop="location">
                <el-input style="width:50%" v-model="roleEditForm.tempFee.upperLimit"></el-input>
            </el-form-item>
            <el-form-item label="临停优惠折扣率" prop="remark">
                <el-input style="width:50%" v-model="roleEditForm.tempFee.discount"></el-input>
            </el-form-item>
          </div>
          <div v-if="roleEditForm.feeType==2">
            <el-form-item label="临停费用" prop="oName">
                <el-input style="width:50%" v-model="roleEditForm.tempFee.tempFree"></el-input>
            </el-form-item>
            <el-form-item label="开门次数" prop="location">
                <el-input style="width:50%" v-model="roleEditForm.tempFee.openCount"></el-input>
            </el-form-item>
            <el-form-item label="临停时间" prop="remark">
                <el-input style="width:50%" v-model="roleEditForm.tempFee.tempHour"></el-input>
            </el-form-item>
          </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleEdit=false">取 消</el-button>
        <el-button type="primary" @click="onEditRule">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加收费规则" :visible.sync="ruleAdd" :show-close="false">
  <!-- 1步 -->

      <el-form v-if="ruleOneShow" class="oneForm" ref="oneForm" :model="ruleOne" :rules="rulesOne" label-width="120px">
          <el-form-item label="名称" prop="feeName">
              <el-input v-model="ruleOne.feeName"></el-input>
          </el-form-item>
      </el-form>
      <div v-if="ruleOneShow" slot="footer" class="dialog-footer">
        <el-button @click="ruleAdd=false">取 消</el-button>
        <el-button type="primary" @click="ruleOneClick">下一步</el-button>
      </div>
  <!-- 2步 -->

      <el-form v-if="ruleTwoShow" class="twoEdit" ref="twoForm" :model="roleAddForm" :rules="rulesTwo" label-width="300px">
          <h3 style="text-align:center;margin-bottom:10px">临停规则</h3>
          <div v-if="roleAddForm.feeType==1">
            <el-form-item label="临停收费（单位：元/小时）" prop="hourFee">
                <el-input style="width:50%" v-model="roleAddForm.hourFee"></el-input>
            </el-form-item>
            <el-form-item label="临停费用上限（默认-1，表示不设置上限）" prop="upperLimit">
                <el-input style="width:50%" v-model="roleAddForm.upperLimit"></el-input>
            </el-form-item>
            <el-form-item label="临停优惠折扣率" prop="discount">
                <el-input style="width:50%" v-model="roleAddForm.discount"></el-input>
            </el-form-item>
          </div>
          <div v-if="roleAddForm.feeType==2">
            <el-form-item label="临停费用" prop="tempFree">
                <el-input style="width:50%" v-model="roleAddForm.tempFree"></el-input>
            </el-form-item>
            <el-form-item label="开门次数" prop="openCount">
                <el-input style="width:50%" v-model="roleAddForm.openCount"></el-input>
            </el-form-item>
            <el-form-item label="临停时间" prop="tempHour">
                <el-input style="width:50%" v-model="roleAddForm.tempHour"></el-input>
            </el-form-item>
          </div>
      </el-form>
      <div v-if="ruleTwoShow" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onAddRule">提 交</el-button>
        <el-button type="primary" @click="skip">跳 过</el-button>
      </div>
  <!-- 3步 -->
      <el-form v-if="threeRule" class="threeForm" ref="threeForm" :model="ruleThree" :rules="rulesThree" label-width="120px">
          <h3 style="text-align:center;margin-bottom:10px">包月规则</h3>
          <el-form-item label="包月费用" prop="monthlyFee">
              <el-input style="width:50%" v-model="ruleThree.monthlyFee"></el-input>
          </el-form-item>
          <el-form-item label="优惠月份" prop="discountMonth">
              <el-input style="width:50%" v-model="ruleThree.discountMonth"></el-input>
          </el-form-item>
          <el-form-item label="优惠折扣率" prop="discountFee">
              <el-input style="width:50%" v-model="ruleThree.discountFee"></el-input>
          </el-form-item>
      </el-form>
      <div v-if="threeRule" slot="footer" class="dialog-footer">
        <!-- <el-button type="danger" @click="onClose">上一步</el-button> -->
        <el-button type="primary" @click="ruleThreeClick">提 交</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {getOrgs,findOneParkingLot,findParkingLots,insertOneParkingLot,updateOneParkingLot,switchParkingLot,deleteParkingLot,insertFeeRuleStepOne,insertFeeRuleStepTwo,insertFeeRuleStepThree,updateFeeRule,deleteOneFeeRule} from '../../../api/api'
  export default {
    data(){
      return{
        ruleAdd:false,
        roleAddForm:{},
        ruleOneShow:true,
        ruleTwoShow:false,
        ruleOne:{},
        threeRule:false,
        ruleThree:{},

        ruleEdit:false,
        roleEditForm:{},
        
        treeData:[],
        defaultProps: {
          children: "child",
          label: "oname"
        },
        parkData:[],
        parkProps: {
          children: "",
          label: "pName"
        },
        page:1,
        size:20,
        total:0,
        parkVisible:false,
        // 添加
        addForm:{},
        rules:{
          pName:[{ required: true, message: '请输入停车场名称', trigger: 'blur' }],
          pType:[{ required: true, message: '请选择停车场类型', trigger: 'blur' }],
          pname:[{ required: true, message: '请输入停车场名称', trigger: 'blur' }],
          ptype:[{ required: true, message: '请选择停车场类型', trigger: 'blur' }],
        },
        rulesOne:{
          feeType:[{ required: true, message: '请选择车辆类型', trigger: 'blur' }],
          feeName:[{ required: true, message: '请输入名称', trigger: 'blur' }],
        },
        rulesTwo:{
          hourFee:[{ required: true, message: '请输入临停收费', trigger: 'blur' }],
          upperLimit:[{ required: true, message: '请输入临停费用上限', trigger: 'blur' }],
          discount:[{ required: true, message: '请输入临停优惠折扣率', trigger: 'blur' }],
          tempFree:[{ required: true, message: '请输入临停费用', trigger: 'blur' }],
          openCount:[{ required: true, message: '请输入开门次数', trigger: 'blur' }],
          tempHour:[{ required: true, message: '请输入临停时间', trigger: 'blur' }],
        },
        rulesThree:{
          monthlyFee:[{ required: true, message: '请输入包月费用', trigger: 'blur' }],
          discountMonth:[{ required: true, message: '请输入优惠月份', trigger: 'blur' }],
          discountFee:[{ required: true, message: '请输入优惠折扣率', trigger: 'blur' }],
        },
        orgData:{},
        // 详情
        editForm:{},
        delFlag:''
      }
    },
    created(){
      let obj={
        userid:JSON.parse(sessionStorage.getItem('userInfo')).userId,
        groupid:JSON.parse(sessionStorage.getItem('userInfo')).groupId
      }
      getOrgs(obj).then(data=>{
        this.treeData=data.data
      })
    },
    methods:{
      test(v){
        console.log(v)
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

      // 第1步
      ruleOneClick(){
        this.$refs.oneForm.validate((valid) => {
          if (valid) {
            let obj={...this.ruleOne}
            obj.feeType=1
            obj.parkingLotName=this.editForm.pname;
            obj.parkingLotId=this.editForm.pid;
            insertFeeRuleStepOne(obj).then(res=>{
              this.roleAddForm=res.data
              this.ruleOneShow=false
              this.ruleTwoShow=true
              this.getParkData()
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
        
      },
      // 第2步
      onAddRule(){
        this.$refs.twoForm.validate((valid) => {
          if (valid) {
            let obj
            if(this.roleAddForm.feeType==1){
              obj={
                feeType:this.roleAddForm.feeType,
                feeId:this.roleAddForm.feeId,
                hourFee:this.roleAddForm.hourFee,
                upperLimit:this.roleAddForm.upperLimit,
                discount:this.roleAddForm.discount,
              }
            }else{
              obj={
                feeType:this.roleAddForm.feeType,
                feeId:this.roleAddForm.feeId,
                tempFree:this.roleAddForm.tempFree,
                tempHour:this.roleAddForm.tempHour,
                openCount:this.roleAddForm.openCount,
              }
            }
            // console.log(obj)
            insertFeeRuleStepTwo(obj).then(res=>{
              this.skip()
              this.getParkData()
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        
      },
      //跳过
      skip(){
        this.ruleTwoShow=false
        this.threeRule=true
      },
      // 第3步
      ruleThreeClick(){
        this.$refs.threeForm.validate((valid) => {
          if (valid) {
            let obj={...this.ruleThree}
            obj.feeType=this.roleAddForm.feeType;
            obj.feeId=this.roleAddForm.feeId;
            // console.log(obj)

            insertFeeRuleStepThree(obj).then(res=>{
              this.$message({
                type: 'success',
                message: '操作成功'
              });
              this.onClose()
              this.getParkData()
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      // 关闭
      onClose(){
        this.ruleAdd=false;
        this.ruleOneShow=true;
        this.threeRule=false;
        this.ruleEdit=false;
        this.ruleOne={}
        this.roleAddForm={}
        this.ruleThree={}
      },
      editRule(data){
        this.ruleEdit=true
        // console.log(data)
        this.roleEditForm=data
      },
      // 删除规则
      delRule(data){
        this.$confirm(`此操作将删除该数据, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let obj={
              id:data.feeId,
              parkingLotName:this.editForm.pname,
              feeName:data.feeName
            }
            deleteOneFeeRule(obj).then(res=>{
              if(res.status==200){
                this.$message({
                  type: 'success',
                  message: res.message
                });
                this.getParkData()
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
       
      },
      // 编辑规则
      onEditRule(){
        let obj={...this.roleEditForm}
        let ps
        // 打脑壳 feeId可能存在污染问题
        if(obj.monthlyFee.id && obj.tempFee.id){
          ps={...obj.monthlyFee,...obj.tempFee}
          ps.monthlyFeeId=obj.monthlyFee.id
          ps.tempFeeId=obj.tempFee.id
        }else if(obj.monthlyFee.id){
          ps={...obj.monthlyFee}
          ps.monthlyFeeId=obj.monthlyFee.id
          if(obj.tempFee.discount && obj.tempFee.hourFee && obj.tempFee.upperLimit){
            ps.discount=obj.tempFee.discount
            ps.hourFee=obj.tempFee.hourFee
            ps.upperLimit=obj.tempFee.upperLimit
          }
          if(obj.tempFee.tempFree && obj.tempFee.openCount && obj.tempFee.tempHour){
            ps.tempFree=obj.tempFee.tempFree
            ps.openCount=obj.tempFee.openCount
            ps.tempHour=obj.tempFee.tempHour
          }
        }else if(obj.tempFee.id){
          ps={...obj.tempFee}
          ps.tempFeeId=obj.tempFee.id
          if(obj.monthlyFee.discountFee && obj.monthlyFee.discountMonth && obj.monthlyFee.monthlyFee){
            ps.discountFee=obj.monthlyFee.discountFee
            ps.discountMonth=obj.monthlyFee.discountMonth
            ps.monthlyFee=obj.monthlyFee.monthlyFee
          }
        }
        ps.parkingLotName=this.editForm.pname
        ps.feeName=obj.feeName
        ps.feeType=obj.feeType
        delete ps.id
        for(let key in ps){
          if(ps[key]==''){
            this.$message.error('错误操作');
            return
          }
        }
        updateFeeRule(ps).then(res=>{
          if(res.status==200){
            this.$message({
              type: 'success',
              message: res.message
            });
            this.onClose()

          }
        })
      },

      onDel(){
        this.$confirm(`请确认是否删除此停车场？确认后将清除所有此停车场相关内容！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj={
            pId:this.editForm.pid,
            pName:this.editForm.pname
          }
          deleteParkingLot(obj).then(res=>{
            if(res.status==200){
              this.$message({
                type: 'success',
                message: res.message
              });
              let obj={
                page:this.page,
                size:this.size,
                orgId:this.orgData.oid
              }
              findParkingLots(obj).then(data=>{
                this.parkData=data.data.list
                this.total=data.data.count
                this.editForm={}
                this.getOrg()
              })
            }else{
              this.$message.error(res.message);
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
          pId:this.editForm.pid,
          pName:this.editForm.pname,
          orgId:this.editForm.orgId,
          orgName:this.editForm.orgName,
          // pType:this.editForm.ptype,
          pType:1,
          location:this.editForm.location,
          remark:this.editForm.remark,
        }
        updateOneParkingLot(obj).then(res=>{
          console.log(res)
        })
      },
      delFlagFun(v){
        let obj={
            pId:this.editForm.pid,
            delFlag:v,
            pName:this.editForm.pname,
          }
          switchParkingLot(obj).then(res=>{
            this.$message({
              type: 'success',
              message: res.message
            });
            this.editForm.delFlag=obj.delFlag
          })
      },
      switchBtn(v){
        this.$confirm(`此操作将${this.editForm.delFlag?'启用':'禁用'}该数据, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delFlagFun(v)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          this.editForm.delFlag= v?0:1 
        });
      },
      // 关闭弹窗
      onClear(){
        this.$refs.addForm.resetFields()
        this.parkVisible=false;
      },
      onAdd(){
        this.$refs.addForm.validate((valid)=>{
          if(valid){
             let obj={
              pName:this.addForm.pName,
              orgId:this.orgData.oid,
              orgName:this.orgData.oname,
              // pType:this.addForm.pType,
              pType:1,
              location:this.addForm.location,
              remark:this.addForm.remark,
            }
            insertOneParkingLot(obj).then(res=>{
              if(res.status==200){
                this.$message({
                  type: 'success',
                  message: '操作成功'
                });
                this.$refs.addForm.resetFields();
                this.parkVisible=false;
                this.getOrg()
              }
            })
          }else{
            return false
          }
        })
       
      },
      // 组织树事件
      handleNodeClick(data) {
        this.orgData=data;
        this.getOrg()
      },
      getOrg(){
        let obj={
          page:this.page,
          size:this.size,
          orgId:this.orgData.oid
        }
        findParkingLots(obj).then(data=>{
          this.parkData=data.data.list
          this.total=data.data.count
        })  
      },
      // 停车场树事件
      parkClick(val) {
        this.parkDetails=val
        this.getParkData()
      },
      getParkData(){
        findOneParkingLot({pId:this.parkDetails.pId}).then(data=>{
          // let Data=this.$common.deepClone(data)
          this.editForm=data.data
        })
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

}
.saveleftBtn{
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
.editForm{
  height: 70vh;
  overflow: auto;
}
</style>
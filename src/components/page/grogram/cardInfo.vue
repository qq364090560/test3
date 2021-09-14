<template>
  <div class="body">
    <div class="left">
      <el-card style="margin-right:10px;" class="left-card">
        <div>
          <el-row>
            <el-col>
              <h4 style="padding:10px">停车场</h4>
            </el-col>
            <el-col>
              <el-tree class="tree" :data="treeData" :props="defaultProps" highlight-current @node-click="handleNodeClick">
              </el-tree>
            </el-col>
          </el-row>
          <div class="pagination">
            <el-pagination
              layout="total,prev, pager, next"
              @size-change="treeHandleSizeChange"
              @current-change="treeHandleCurrentChange"
              :current-page="treePage"
              :page-size="treeSize"
              :total="treeTotal">
            </el-pagination>
          </div>
        </div>
      </el-card>
    </div>
    <div class="right" v-show="parkData.pId">
      <div class="right-seach">
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-form-item label="ID">
            <el-input class="input-width" v-model="search.consumerId" placeholder="ID"></el-input>
          </el-form-item>
          <el-form-item label="卡号">
            <el-input class="input-width" v-model="search.icCode" placeholder="卡号"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input class="input-width" v-model="search.userName" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input class="input-width" v-model="search.tel" placeholder="电话"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onQurey">查询</el-button>
            <el-button type="primary" @click="onClear">清空</el-button>
            <el-button style="float: right;" type="warning" @click="addcard=true" v-btnShow="'insert'">添 加</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span>{{parkData.pName}}</span>
        </div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          height="60vh"
          @selection-change="handleSelectionChange">
          <!-- <el-table-column
            fixed
            type="selection"
            width="55">
          </el-table-column> -->
          <el-table-column
            prop="userName"
            fixed
            label="用户名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="consumerId"
            label="用户ID"
            width="100">
          </el-table-column>
          <el-table-column
            prop="icCode"
            label="卡号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="feeTypeStr"
            label="车辆类型"
            width="100">
          </el-table-column>
          <el-table-column
            prop="tel"
            label="电话"
            width="120">
          </el-table-column>
          <el-table-column
            prop="dateBegin"
            label="有效期起"
            >
            <!-- <template slot-scope="scope">{{ scope.row.dateBegin }}</template> -->
          </el-table-column>
          <el-table-column
            prop="deteEnd"
            label="有效期止"
            >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="360"
            >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="onView(scope.row)">详情</el-button>
              <el-button size="mini" type="primary" @click="handleQx(scope.row)">上传</el-button>
              <el-button size="mini" :type="scope.row.del_flag ? 'danger' : 'info'" :disabled="!scope.row.del_flag" @click="handleDisabled(scope.row)">{{scope.row.del_flag ? '报停' : '已报停'}}</el-button>
              <el-button size="mini" type="primary" @click="cardRepair(scope.row)">补卡</el-button>
              <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[10, 20, 40, 80]"
              :page-size="size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
          </el-pagination>
        </div>
      </el-card>

      <el-dialog title="图片" :visible.sync="pic" :show-close="false">
        <el-form class="pic" ref="pic" :model="picForm" label-width="120px">
            <el-form-item label="人脸">
                <el-image
                    style="width: 200px; height: 200px"
                    :src="picForm.faceUrl"
                    fit="fit">
                </el-image>
            </el-form-item>
            <el-form-item label="车辆" style="">
              <div>
                <div class="demonstration">前照</div>
                <el-image
                    style="width: 200px; height: 200px"
                    :src="picForm.headUrl"
                    fit="fit">
                </el-image>
              </div>
              <div>
                <div class="demonstration">后照</div>
                <el-image
                    style="width: 200px; height: 200px"
                    :src="picForm.rearUrl"
                    fit="fit">
                </el-image>
              </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="pic=false">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="补卡" :visible.sync="repair" :show-close="false">
        <el-form class="repair" ref="repairForm" :model="repairForm" label-width="120px">
            <el-form-item label="旧卡号">
                <el-input v-model="repairForm.icCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="新卡号">
                <el-input v-model="repairForm.newCode" placeholder="请输入新卡号"></el-input>
            </el-form-item>
            <!-- <el-form-item label="有效时间" prop="monthlyBegin">
                <el-date-picker
                  v-model="repairForm.time"
                  type="datetimerange"
                  align="right"
                  start-placeholder="有效期起"
                  end-placeholder="有效期止"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="okCard">确 定</el-button>
          <el-button type="primary" @click="cancel">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加卡片" :visible.sync="addcard" :show-close="false">
        <el-form class="addForm" ref="addForm" :rules="rules" :model="addForm" label-width="120px" style="display:inline-block;margin-right:40px">
            <el-form-item label="用户名" prop="userName">
                <el-input v-model="addForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="tel">
                <el-input v-model="addForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="卡号" prop="icCode">
                <el-input v-model="addForm.icCode"></el-input>
            </el-form-item>
            <el-form-item label="房号" prop="roomNo">
                <el-input v-model="addForm.roomNo"></el-input>
            </el-form-item>
            <el-form-item label="车牌号" prop="license">
                <el-input v-model="addForm.license"></el-input>
            </el-form-item>
             <el-form-item label="停车场" prop="parking">
                <el-select v-model="addForm.parking" placeholder="请选择" @change="PakingName">
                  <el-option
                    v-for="item in treeData"
                    :key="item.pId"
                    :label="item.pName"
                    :value="item.pName">
                  </el-option>
                </el-select>
            </el-form-item>
             <el-form-item v-show="moneyTypeShow" label="收费类型" prop="moneyType">
                <el-select v-model="addForm.moneyType" placeholder="请选择">
                  <el-option
                    v-for="item in moneyType"
                    :key="item.feeId"
                    :label="item.feeName"
                    :value="item.feeName">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车辆前照" prop="files">
              <el-upload
                action="#"
                ref="upload"
                list-type="picture-card"   
                :on-change="handleChange"
                :http-request="httpRequest"
                :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="车辆后照" prop="files">
              <el-upload
                action="#"
                ref="upload"
                list-type="picture-card"   
                :on-change="handleChange1"
                :http-request="httpRequest1"
                :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="车辆类型" prop="feeName">
                <el-select v-model="addForm.feeName" placeholder="请选择">
                  <el-option
                    v-for="item in feeRules"
                    :key="item.value"
                    :label="item.feeName"
                    :value="item.feeName">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="有效期起" prop="monthlyBegin">
                <!-- <el-input v-model="addForm.dateBegin"></el-input> -->
                <el-date-picker
                  v-model="addForm.monthlyBegin"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="有效期止" prop="monthlyEnd">
                <el-date-picker
                  v-model="addForm.monthlyEnd"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addCard">确 定</el-button>
          <el-button type="primary" @click="cancel(1)">取 消</el-button>
        </div>
      </el-dialog>

      <el-dialog title="上传" :visible.sync="dialogVisible">
        <el-form class="form" ref="form" :model="form" label-width="120px" style="display:inline-block;margin-right:40px">
            <el-form-item label="选择控制器" label-width="120px">
              <el-checkbox-group v-model="checkbox">
                <el-checkbox  v-for="(it,index) in form.data" :key="index + 'a'" :label="it.sn">{{it.wgName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onSubimitQX">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改" :visible.sync="updateDialog">
        <el-form class="updateForm" ref="updateForm" :model="updateForm" label-width="120px" style="display:inline-block;margin-right:40px">
            <el-form-item label="用户名">
                <el-input v-model="updateForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="updateForm.tel"></el-input>
            </el-form-item>
            <el-form-item label="房号">
                <el-input v-model="updateForm.roomNo"></el-input>
            </el-form-item>
            <el-form-item label="车辆类型">
                <el-select v-model="updateForm.feeTypeStr" placeholder="请选择">
                  <el-option
                    v-for="item in feeRules"
                    :key="item.value"
                    :label="item.feeName"
                    :value="item.feeName">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="有效期起">
                <!-- <el-input v-model="updateForm.dateBegin"></el-input> -->
                <el-date-picker
                  readonly
                  v-model="updateForm.dateBegin"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="有效期止">
                <el-date-picker
                  readonly
                  v-model="updateForm.deteEnd"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
                <!-- <el-input v-model="updateForm.deteEnd"></el-input> -->
            </el-form-item>
            <el-form-item label="续费月份">
                <el-select v-model="updateForm.mon" placeholder="请选择月份">
                  <el-option
                    v-for="item in monOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="卡号">
                <el-input v-model="updateForm.icCode" readonly></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onUpdate">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Empty } from 'element-ui'
import {queryParkingLotsByOrg,getCardInfoDetail,getByParkingLotId,handleUpload,userUpdateOne,nonMotorFeeRules,handAdd,disabledCard,changeCard,picInfo,parkMoney } from '../../../api/api'
  export default {
    data(){
      return{
        // 左侧树
        treeData:[],
        // 收费规则
        moneyType:[],
        // 是否显示收费规则
        moneyTypeShow:false,
        defaultProps: {
          children: "child",
          label: "pName"
        },
        treePage:1,
        treeSize:20,
        treeTotal:0,
        parkData:{},

        search:{},
        // table表格
        tableData:[],
        page:1,
        size:10,
        total:0,

        repair:false,
        repairForm:{},

        addcard:false,
        addForm:{},
        fileList:[],

        rules:{
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          tel: [
            { required: true, message: '请输入电话号码', trigger: 'blur' }
          ],
          icCode: [
            { required: true, message: '请输入卡号', trigger: 'blur' }
          ],
          feeName: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          monthlyBegin: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          monthlyEnd: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
        },

        pic:false,
        picForm:{
          faceUrl:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        //修改
        dialogVisible:false,
        form:{},
        checkbox:[],
        monOptions:[
          {label:"1月",value:1},
          {label:"2月",value:2},
          {label:"3月",value:3},
          {label:"4月",value:4},
          {label:"5月",value:5},
          {label:"6月",value:6},
          {label:"7月",value:7},
          {label:"8月",value:8},
          {label:"9月",value:9},
          {label:"10月",value:10},
          {label:"11月",value:11},
          {label:"12月",value:12},
        ],

        updateDialog:false,
        updateForm:{},

        feeRules:[],
      }
    },
    created(){
      this.getPark()
    },
    methods:{
      // 点击添加按钮后，选择停车场
      PakingName(data){
        // data为选中的值，需要对应的停车场id
        let arr = this.treeData.filter(e =>{
          return e.pName == data
        });
        parkMoney({parkingLotId:arr[0].pId}).then((res) =>{
          if(res.status == 200){
            // 给收费规则下拉赋值,并显示
            this.moneyTypeShow = true;
            this.moneyType = res.data;
          }
        });
      },
      // 详情
      onView(v){
        picInfo({icCode:v.icCode}).then(res=>{
          this.picForm=res.data
          this.pic=true;

        })
        console.log(v)
      },
      // 补卡
      cardRepair(v){
        this.repair=true;
        this.repairForm=this.$common.deepClone(v)
      },
      okCard(){
          let obj={
            oldIcCard:this.repairForm.icCode,
            newIcCard:this.repairForm.newCode,
            // beginDate:this.repairForm.time[0],
            // endDate:this.repairForm.time[1],
            parkingLotId:this.repairForm.parkingLotId,
          }
          changeCard(obj).then(res=>{
            if(res.status==200){
              this.$message({
                type: 'success',
                message: res.message
              });
              this.repair=false;
              this.getTableData()
            }
          })
      },
      // 上传照片
      handleChange(file, fileList) {
        if (fileList.length > 1) {
            fileList.shift()
        }
      },
      httpRequest(data) {
        // let _this = this  // 这里要转一下是因为在下面的function里 this的指向发生了变化
        let rd = new FileReader()
        let file = data.file
        rd.readAsDataURL(file)
        // this.fileList.push(file)
        console.log(this.fileList)
        this.fileList[0]=file

        // rd.onloadend = function(e) {
        //   //转64
        //   _this.addData.icon = this.result
        // }
      },
      handleChange1(file, fileList) {
        if (fileList.length > 1) {
            fileList.shift()
        }
      },
      httpRequest1(data) {
        // let _this = this  // 这里要转一下是因为在下面的function里 this的指向发生了变化
        let rd = new FileReader()
        let file = data.file
        rd.readAsDataURL(file)
        // this.fileList.push(file)
        this.fileList[1]=file
        console.log(this.fileList)

        // rd.onloadend = function(e) {
        //   //转64
        //   _this.addData.icon = this.result
        // }
      },
      beforeAvatarUpload(file) {
        const isImg = file.size / 1024 / 1024 < 2
        if (!isImg) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        const isType = file.type === "image/png"
        const isType2 = file.type === "image/jpeg"
        if (!isType && !isType2) {
          this.$message.error('上传头像图片格式为png或jpg')
        }
        return (isType || isType2) && isImg
      },

      cancel(v){
        if(v==1){
          this.$refs.addForm.resetFields();
          this.addForm={}
          this.fileList=[];
          this.addcard=false;
          this.moneyType = [];
          this.moneyTypeShow = false;
        }else{
          this.$refs.repairForm.resetFields();
          this.repairForm={}
          console.log( this.repairForm)
          this.repair=false
        }
      },
      //添加卡片
      addCard(){
        if(!this.fileList[0] || !this.fileList[1]){
          return
        }else{
          let data=this.feeRules.filter(it=>it.feeName==this.addForm.feeName)[0]
          let formData = new FormData();
          let parmas={...this.addForm}
          parmas.parkintLotId=this.parkData.pId
          parmas.parkingLotName=this.parkData.pName
          parmas.feeId=data.feeId
          parmas.head=this.fileList[0]
          parmas.rear=this.fileList[1]
          const userId=JSON.parse(sessionStorage.getItem('userInfo')).userId
          const menuId=this.$router.history.current.meta.mid
          formData.append('thisUser',userId)
          formData.append('thisMenu',menuId)
          for(let key in parmas){
            formData.append(key,parmas[key])
          }
          this.$axios.post('http://192.168.0.22:7010/consumer/cardInfo/handAdd',formData).then(res=>{
            this.$refs.addForm.resetFields();
            this.addcard=false;
            this.getTableData()
  
            this.$message({
              message: res.message,
              type: 'success'
            });
          })
        }
        // handAdd(parmas).then(res=>{
        //   this.$refs.addForm.resetFields();
        //   this.addcard=false;
        //   this.getTableData()

        //   this.$message({
        //     message: res.message,
        //     type: 'success'
        //   });
        // })
      },
      //查询
      onQurey(){
        this.getTableData(this.search)
      },
      onClear(){
        this.search={}
        this.onQurey()
      },
      //获取table列表
      getTableData(v){
        let parmas
        if(v){
          parmas={
            icCode: v.icCode,
            pId: this.parkData.pId,
            userName: v.userName,
            tel: v.tel,
            page: this.page,
            size: this.size,
            consumerId:v.consumerId-20000 || ""
          }
        }else{
          parmas={
            pId: this.parkData.pId,
            page: this.page,
            size: this.size,
          }
        }
        getCardInfoDetail(parmas).then(res=>{
          if(res.status==200){
            this.tableData=res.data.list;
            this.tableData.map(it=>{
              it.consumerId=it.consumerId+20000
            })
            this.total=res.data.count;
          }
        })
      },

      handleSelectionChange(){

      },
      handleDisabled(v) {
        this.$confirm(`请确认是否报停？确认后将无法回退！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
          let sn=[]
          this.form.data.map(item=>{
            sn.push(item.sn)
          })
          let obj={
            icCode:v.icCode,
            sn:sn.join(','),
          }
          disabledCard(obj).then(res=>{
            if(res.status==200){
              this.$message({
                type: 'success',
                message: res.message
              });
              this.getTableData()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });

      },

      //tree分页
      treeHandleSizeChange(val) {
        this.treeSize = val;
        this.getPark()
      },
      treeHandleCurrentChange(val) {
        this.treePage = val;
        this.getPark()
      },
      
      //table分页
      handleSizeChange(val) {
        this.size = val;
        this.getTableData(this.search)
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getTableData(this.search)
      },

      handleQx(v){
        this.dialogVisible=true;
        this.form.row=v
        console.log(this.form)
      },
      handleUpdate(v){
        this.updateDialog=true;
        this.updateForm=v;
        console.log(v)

      },
      // 更新
      onUpdate(){
        let data=this.feeRules.filter(it=>it.feeName==this.updateForm.feeTypeStr)[0]
        let parmas={
          icCode:this.updateForm.icCode,
          monthlyBegin:this.updateForm.dateBegin,
          monthlyEnd:this.updateForm.deteEnd,
          mon:this.updateForm.mon,
          userId:JSON.parse(sessionStorage.getItem('userInfo')).userId,
          userName:this.updateForm.userName,
          vId:this.updateForm.vId,
          roomNo:this.updateForm.roomNo,
          feeId:data.feeId,
          feeName:data.feeName,
          tel:this.updateForm.tel,
        }
        userUpdateOne(parmas).then(res=>{
          if(res.status==200){
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.getTableData()
            this.updateDialog=false;
          }else{
            this.$message.error(res.message);
          }
        })
      },

      // 组织树事件
      handleNodeClick(data) {
        this.parkData=data;
        this.getTableData()
        this.getController(data);
        this.getFeeRules(data);

      },
      getPark(){
        let obj={
          page:this.treePage,
          size:this.treeSize,
          groupId:JSON.parse(sessionStorage.getItem('userInfo')).groupId,
        }
        queryParkingLotsByOrg(obj).then(data=>{
          
          this.treeData=data.data.list
          this.treeTotal=data.data.count
          console.log(data,"data");
        })  
      },
      //获取控制器
      getController(v){
        getByParkingLotId({parkingLotId:v.pId}).then(res=>{
          if(res.status==200){
            this.form.data=res.data
          }else{
            this.$message.error(res.message);
          }
        })
      },

      onSubimitQX(){
        if(!this.checkbox.length){
          return
        }else{
          let parmas={
            cardNo:this.form.row.icCode,
            beginDate:this.form.row.dateBegin,
            endDate:this.form.row.deteEnd,
            sn:this.checkbox.join(','),
          }
          handleUpload(parmas).then(res=>{
            if(res.status==200){
              this.$message({
                message: res.message,
                type: 'success'
              });
              this.dialogVisible=false;
            }else{
              this.$message.error(res.message);
            } 
          })

        }
      },

      // 根据停车场查询收费规则
      getFeeRules(v){
        nonMotorFeeRules({parkingLotId:v.pId}).then(res=>{
          this.feeRules=res.data
        })
      }

      
    }
  }
</script>

<style lang="less" scoped>
.body{
  display: flex;
  .left{
    width: 300px;
  }
  .right{
    width: 100%;
    .right-seach{
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      border-radius: 10px;
      .demo-form-inline{
        width: 100%;
      }
      .input-width{
         justify-content: space-between;
      align-items: center;
        width: 175px;;
      }
      .el-form{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        .el-form-item{
           margin: 0 8px;
        }
      }
    }
    .el-pagination {
      margin: 30px 0;
      text-align: center;
    }
  }
}
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
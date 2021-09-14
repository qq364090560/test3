<template>
  <div>
    <div class="right-seach">
        <el-form :inline="true" ref="search" :model="search" class="demo-form-inline">
          <el-form-item label="停车场">
            <el-select v-model="search.parkingLotId" placeholder="请选择">
              <el-option
                v-for="item in parkData"
                :key="item.value"
                :label="item.pName"
                :value="item.pId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ID">
            <el-input v-model="search.consumerId" placeholder="ID"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名">
            <el-input v-model="search.consumerName" placeholder="用户姓名"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="search.consumerTel" placeholder="电话"></el-input>
          </el-form-item>
          <el-form-item label="订单类型">
            <el-select v-model="search.orderType" placeholder="订单类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              v-model="search.time"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onQurey">查询</el-button>
            <el-button type="primary" @click="onClear">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
          <span>订单记录</span>
          <!-- <el-button style="float: right;" type="primary" @click="addAccount" v-btnShow="'insert'">添加用户</el-button> -->
      </div>
      <div class="tablehead">
        <!-- <el-card class="box-card leftbox">
          <div slot="header" class="clearfix">
            <span>停车场</span> -->
            <!-- <el-button style="float: right;" type="primary" @click="addAccount" v-btnShow="'insert'">添加用户</el-button> -->
        <!-- </div>
          <el-tree :data="parkData" :props="parkProps" @node-click="parkClick">
          </el-tree>
        </el-card> -->
        <el-card class="box-card">
          <el-table
            ref="multipleTable"
            :data="tableData"
            height="54vh"
            tooltip-effect="dark"
            >
            <el-table-column
              fixed
              prop="orderCode"
              label="订单号"
              width="120">
            </el-table-column>
            <el-table-column
              prop="consumerId"
              label="ID"
              width="120">
            </el-table-column>
            <el-table-column
              prop="parkinglotName"
              label="停车场名称"
              width="120">
            </el-table-column>
            <el-table-column
              prop="consumerName"
              label="用户名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="consumerTel"
              label="电话"
              width="120">
            </el-table-column>
            <el-table-column
              prop="license"
              label="车牌号"
              >
            </el-table-column>
            <el-table-column
              prop="carType"
              label="车辆类型"
              >
            </el-table-column>
            <el-table-column
              prop="orderDes"
              label="订单类型"
              >
            </el-table-column>
            <el-table-column
              prop="discountPrise"
              label="优惠金额">
            </el-table-column>
            <el-table-column
              prop="finalPrise"
              label="支付金额">
            </el-table-column>
            <el-table-column
              prop="payType"
              label="支付方式">
            </el-table-column>
            <el-table-column
              class-name="red"
              label="订单状态">
              <template slot-scope="scope">
                <span :style="scope.row.orderStatus==2?'color:green':'color:red'">
                {{scope.row.orderStatus1}}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="orderPayTime"
              label="支付时间">
            </el-table-column>
            <el-table-column
              prop="detail"
              width="220px"
              fixed="right"
              label="详情">
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
      </div>
    </el-card>
  </div>
</template>

<script>
import {queryAll,queryParkingLotsByOrg} from '../../../api/api'
  export default {
    data(){
      return{
        search:{
          time:[],
          consumerName:"",
          consumerTel:"",
          orderType:"",
        },
        options:[
          {label:"新用户办卡/不充电",value:1},
          {label:"新用户办卡/充电",value:2},
          {label:"临时停车",value:3},
          {label:"包月续费",value:4},
        ],

        parkData:[],
        parkProps:{
          children: '',
          label: 'pName'
        },
        pId:'',

        // table表格
        tableData:[],
        page:1,
        size:10,
        total:0,
      }
    },
    created(){
      this.getOrg()
    },
    methods:{
      onQurey(){
        console.log(this.search)
        this.getOrder(this.search)
      },
      onClear(){
        this.$refs.search.resetFields();
        this.search={}
        this.search.orderType=''
        this.search.time=[];
        this.tableData=[];
        this.page = 1;
        this.size=10,
        this.total=0,
        console.log(this.search)
      },
      getOrder(v){
        // let parmas={
        //   page:this.page,
        //   size:this.size,
        //   parkingLotId:this.pId
        // }
        let list = {
          page:this.page,
          size:this.size,
        }
        if(v){
           if(this.search.userId > 20000){
            list.userId=this.search.userId-20000 || '';
          }
          if(this.search.userId <= 20000){
            list.userId=this.search.userId || '';
          }
          if(this.search.icNo != ''){
            list.icNo=this.search.icNo
          }
          if(this.search.parkingLotId != ''){
            list.parkingLotId=this.search.parkingLotId
          }
          if(this.search.userName != ''){
            list.userName=this.search.userName
          }
          if(this.search.tel != ''){
            list.tel=this.search.tel
          }
          if(this.search.time[0] != ''){
            list.startDate=this.search.time[0]
          }
          if(this.search.time[1] != ''){
            list.endDate=this.search.time[1]
          }
          if(this.pId != ''){
            list.parkingLotId = this.pId;
          }
            // parmas.consumerId=this.search.consumerId-20000 || '';
            // parmas.consumerName=this.search.consumerName || '';
            // parmas.consumerTel=this.search.consumerTel || '';
            // parmas.orderType=this.search.orderType || '';
            // parmas.startTime=this.search.time[0] || '';
            // parmas.endTime=this.search.time[1] || '' ;
        }
        queryAll(list).then(res=>{
          if(res.status==200){
            this.tableData=res.data.list;
            this.tableData.map(item=>{
              item.orderStatus1=item.orderStatus == 2?"已支付" : "未支付"
              item.discountPrise=item.discountPrise.toFixed(2)
              item.finalPrise=item.finalPrise.toFixed(2)
              item.consumerId=item.consumerId + 20000
            })
            this.total=res.data.count
          }
        })
      },
      //table分页
      handleSizeChange(val) {
        this.size = val;
        this.getOrder(this.search)
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getOrder(this.search)
      },

      //tree
      parkClick(v){
        this.pId=v.pId;
        this.getOrder()
      },
       // 获取停车场
      getOrg(){
        let obj={
          groupId:JSON.parse(sessionStorage.getItem('userInfo')).groupId,
          page:1,
          size:20,
        }
        queryAll(obj).then(res=>{
          this.tableData=res.data.list
        })
      },
    }
    
  }
</script>

<style lang="less" scoped>
.green{
  color:red
}
.red{
  color:red
}
.right-seach{
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  flex-wrap: wrap;
  padding: 10px;
  .el-form{
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // flex-wrap: wrap;

    .el-form-item{
      // margin: 0 10px;
      // width: 25%;
    }
  }
}
.el-pagination {
  margin: 30px 0;
  text-align: center;
}
.tablehead{
  display:flex;
  .leftbox{
    width: 240px;
    margin-right: 10px;
  }
}
</style>
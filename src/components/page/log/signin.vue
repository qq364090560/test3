<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>登陆日志</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>
      <template>
        <el-form :inline="true" :model="query" class="demo-form-inline">
          <el-form-item label="用户组">
            <el-input v-model="query.ugId" placeholder="请输入用户组"></el-input>
          </el-form-item>
          <el-form-item label="组织">
            <el-input v-model="query.oId" placeholder="请输入组织"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="query.userName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="时间段">
            <el-date-picker
              v-model="query.timeDate"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['12:00:00']">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onQuery">查询</el-button>
          </el-form-item>
        </el-form>
        <template>
          <el-table
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
              prop="userName"
              label="操作人员"
              width="180">
            </el-table-column>
            <el-table-column
              prop="oName"
              label="所属组织"
              width="180">
            </el-table-column>
            <el-table-column
              prop="ugName"
              label="用户组名称">
            </el-table-column>
            <el-table-column
              prop="lDateTIme"
              label="时间">
            </el-table-column>
            <el-table-column
              prop="lIp"
              label="IP地址">
            </el-table-column>
            <el-table-column
              prop="lType"
              label="详情">
            </el-table-column>
          </el-table>
        </template>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </template>
    </el-card>
    
  </div>
</template>

<script>
import {queryAllLogin} from '../../../api/api'
  export default {
    data(){
      return{
        tableData:[],
        page:1,
        size:10,
        total:10,
        query:{}
      }
    },
    created(){
      this.getLogIn()
    },
    methods:{
      onQuery(){
        let obj={
          page:this.page,
          size:this.size,
          ugId:this.query.ugId,
          oId:this.query.oId,
          userName:this.query.userName,
          beginDateTime:this.query.timeDate[0],
          endDateTime:this.query.timeDate[1],
        }
        queryAllLogin(obj).then(data=>{
          this.tableData=data.data.list
          this.total=data.data.count
        })
      },
      handleSizeChange(val) {
        this.size = val;
        this.getLogIn();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getLogIn();
      },
      getLogIn(){
        let obj={
          page:this.page,
          size:this.size
        }
        queryAllLogin(obj).then(data=>{
          this.tableData=data.data.list
          this.total=data.data.count
        })
      }
    },
  }
</script>

<style  scoped>
.el-pagination {
  margin: 30px 0;
}
</style>
<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>公告</span>
        <el-button style="float: right;" type="primary" @click="dialogVisible=true">新增</el-button>
      </div>
      <div class="body">
        <div class="tablehead">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            height="66vh"
            >
            <el-table-column
              fixed
              prop="tittle"
              label="标题"
              width="120">
            </el-table-column>
            <el-table-column
              prop="noticeStr"
              label="内容"
              :show-overflow-tooltip="true"
              >
            </el-table-column>
            <el-table-column
              prop="noticeOrder"
              label="排序"
              width="120"
              >
            </el-table-column>
            <el-table-column
              prop="updateTime"
              label="最后修改时间"
              width="140"
              >
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.row)">修改</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)">删除</el-button>
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
        </div>
        <!-- <div class="right">
          <h1>详情</h1>
          <el-form :model="form" status-icon  ref="ruleForm" label-width="40px" class="demo-ruleForm">
            <el-form-item label="标题" prop="">
              <el-input v-model="form.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="内容">
              <el-input type="textarea" :rows="5" v-model="form.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubimt()">保存</el-button>
              <el-button type="danger" @click="onDel()">删除</el-button>
            </el-form-item>
          </el-form>
        </div> -->
      </div>
    </el-card>
    <el-dialog
      title="修改"
      :visible.sync="dialogShow"
      :before-close="handClose"
      width="40%">
      <el-form :model="form" status-icon  ref="ruleForm" label-width="40px" class="demo-ruleForm">
        <el-form-item label="排序">
          <el-input v-model="form.noticeOrder" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="">
          <el-input v-model="form.tittle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" :rows="8" v-model="form.noticeStr" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handClose">取 消</el-button>
        <el-button type="primary" @click="onSubimt">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="新增公告"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="40%">
      <el-form :model="addForm" status-icon  ref="addForm" label-width="40px" class="demo-ruleForm">
        <el-form-item label="排序">
          <el-input v-model="addForm.noticeOrder" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="">
          <el-input v-model="addForm.tittle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" :rows="5" v-model="addForm.noticeStr" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="onAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {deleteNotice,updateNotice,addNotice,queryAllNotice} from '../../../api/api'

  export default {
    data(){
      return{
        tableData:[],
        page:1,
        size:10,
        total:0,
        
        dialogShow:false,
        form:{},

        dialogVisible:false,
        addForm:{}
      }
    },
    mounted(){
      this.getNotice()
    },
    methods:{
      getNotice(){
        let obj={
          page:this.page,
          size:this.size
        }
        queryAllNotice(obj).then(res=>{
          this.tableData=res.data.list
          this.total=res.data.count
        })
      },
      handleEdit(v){
        this.dialogShow=true
        this.form=this.$common.deepClone(v)
      },
      handleDelete(v){
        this.$confirm('此操作将删除该公告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteNotice({id:v.id,tittle:v.tittle}).then(res=>{
            if(res.status==='200'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getNotice()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },

      handClose(){
        this.form={}
        this.dialogShow=false
      },
      handleClose(){
        this.addForm={}
        this.dialogVisible=false
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
      onAdd(){
        let parmas={...this.addForm}
        addNotice(parmas).then(res=>{
          if(res.status==='200'){
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.getNotice()
            this.handleClose()
          }
        })
      },

      onSubimt(){
        let obj={...this.form}
        delete obj.updateTime
        updateNotice(obj).then(res=>{
          if(res.status==='200'){
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.getNotice()
            this.handClose()
          }
        })

      },
    }
  }
</script>

<style lang="less" scoped>
.body{
  // display: flex;
  // flex-direction: row;
  .tablehead{
    // width: 70%;
    .pagination{
      text-align: center;
    }
  }
  // .right{
  //   flex:1;
  //   text-align: center;
  //   margin-left: 20px;
  // }
}
</style>
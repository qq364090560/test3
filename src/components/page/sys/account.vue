<template>
    <div>
        <!-- 卡片 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>账号列表</span>
                <el-button style="float: right;" type="primary" @click="addAccount" v-btnShow="'insert'">添加用户</el-button>
            </div>
            <!-- 表格 -->
            <el-table ref="userTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
                <!-- <el-table-column fixed type="selection" width="55">
                </el-table-column> -->
                <el-table-column label="用户名" width="140" fixed>
                  <template slot-scope="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column label="联系电话" width="140">
                  <template slot-scope="scope">{{ scope.row.userMobile }}</template>
                </el-table-column>
                <el-table-column label="登陆账号" width="120">
                  <template slot-scope="scope">{{ scope.row.loginAccount }}</template>
                </el-table-column>
                <el-table-column prop="address"  label="邮箱" width="140">
                  <template slot-scope="scope">{{ scope.row.userEmail }}</template>
                </el-table-column>
                <el-table-column label="角色名称" width="140">
                  <template slot-scope="scope">{{ scope.row.roleName }}</template>
                </el-table-column>
                <el-table-column label="所属用户组" width="140">
                  <template slot-scope="scope">{{ scope.row.groupName }}</template>
                </el-table-column>
                <el-table-column label="所属组织" width="140">
                  <template slot-scope="scope">{{ scope.row.orgName }}</template>
                </el-table-column>
                <el-table-column label="上次登陆时间" width="140">
                  <template slot-scope="scope">{{ scope.row.lastLoginTime }}</template>
                </el-table-column>
                <el-table-column label="停用启用标识" width="120">
                  <template slot-scope="scope">{{ scope.row.deleteFlgm ? '启用' : '禁用'}}</template>
                </el-table-column>
                <el-table-column label="创建日期" width="140">
                  <template slot-scope="scope">{{ scope.row.createTime }}</template>
                </el-table-column>
                <el-table-column label="操作" width="420" fixed="right">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)" v-btnShow="'update'">编辑</el-button>
                        <el-button size="mini" :type="scope.row.deleteFlgm ? 'danger' : 'primary'" @click="handleDelete(scope.$index, scope.row)">{{scope.row.deleteFlgm ? '禁用' : '启用'}}</el-button>
                        <el-button size="mini" type="primary" @click="setRole(scope.$index, scope.row)">分配角色</el-button>
                        <el-button size="mini" type="primary" @click="resetPwd(scope.$index, scope.row)">重置密码</el-button>
                        <el-button size="mini" type="primary" @click="changePwd(scope.$index, scope.row)">修改密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <!-- <div>
              <el-button type="primary" @click="delSelect()">选中删除</el-button>
              <el-button type="danger" @click="toggleSelection()">取消选择</el-button>
            </div> -->
        </el-card>
        <AccountAdd :dialogFormVisible='dialogFormVisible' @closeDilog="closeDilog" :title='title' :rowData="rowData"></AccountAdd>
        <AccountPwd :pwdChange='pwdChange' @closeDilog="closeDilog" :rowData="rowData"></AccountPwd>
        <el-dialog title="分配角色" :visible.sync="visibleRole" :close-on-click-modal="false" :show-close='false'>
          <div>
            <el-radio-group v-model="radio" v-if="radioArr.length">
              <el-radio style="margin:0 10px" v-for="(it,i) in radioArr" :key="i" :label="it.rid">{{it.roleName}}</el-radio>
            </el-radio-group>
            <div v-else>暂无数据</div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm()">取 消</el-button>
            <el-button type="primary" @click="submitForm()">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import AccountAdd from '../account/account_add';
import AccountPwd from '../account/account_pwd';
import {getUsersByAccount,deleteOneUser,resetUserPwd,getRoles,userBindRole} from '../../../api/api'

export default {
  components:{
    AccountAdd,
    AccountPwd,
  },
  data() {
    return {
      radio:'',
      radioArr:[],
      visibleRole:false,
      pwdChange:false,
      // 添加
      dialogFormVisible:false,
      title:'',
      rowData:'',
      tableData: [],
      total: 10,
      currentPage: 1,
      pageSize: 10
    };
  },
  methods: {
    resetForm(){
      this.visibleRole=false
    },
    submitForm(){
      if(this.radioArr.length){
        let arr=this.radioArr.find(it=>it.rid==this.radio)
        let obj={
          userId:this.rowData.userId,
          roleId:this.radio,
          userName:this.rowData.userName,
          roleName:arr.roleName,
        }
        userBindRole(obj).then(res=>{
          this.resetForm()
        })
      }
    },
    // 分配角色
    setRole(i,row){
      console.log(row)
      getRoles({orgId:row.orgId}).then(data=>{
        this.radioArr=data.data
      })
      this.rowData=row
      this.visibleRole=true;
    },
    // 重置密码
    resetPwd(i,row){
      let obj={
        account:row.loginAccount,
        userId:row.userId,
        userName:row.userName,
      }
      resetUserPwd(obj).then(res=>{
        this.$message({
          message:'重置成功，默认密码：123456',
          type: "success",
          // duration:2000
        });
      })
    },
    // 修改密码
    changePwd(i,row){
      this.pwdChange=true;
      // let row=this.deepClone(row)
      this.rowData=row
    },
    closeDilog(){
      this.dialogFormVisible=false;
      this.dialogEdit=false;
      this.pwdChange=false;
    },
    addAccount(){
      this.dialogFormVisible=true;
      this.title='添加用户'
    },
    handleEdit(i,row) {
      this.dialogFormVisible=true;
      this.title='编辑用户'
      let rowData=this.$common.deepClone(row)
      this.rowData=rowData
    },
    handleDelete(i,r) {
      this.delData(r);
    },
    // toggleSelection() {
    //   this.$refs.userTable.clearSelection();
    // },

    // delSelect() {
    //   let ids = [];
    //   this.$refs.userTable.selection.forEach(data => {
    //     ids.push(data.id);
    //   });
    //   this.delData(ids.join(","));
    // },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getData() {
      let groupId=JSON.parse(sessionStorage.getItem('userInfo')).groupId
      getUsersByAccount({groupId}).then(res => {
          this.tableData = res.data;
          this.total = parseInt(res.data.length);
      });
    },
    delData(row) {
      this.$confirm(`此操作将 ${row.deleteFlgm ? "禁用" : "启用"}该用户, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let parmas={
            userId:row.userId,
            delFlag:row.deleteFlgm ? 0 : 1,
            userName:row.userName
          }
          deleteOneUser(parmas).then(res => {
            if (res.status == 200) {
              this.$message({
                message:res.message,
                type: "success",
              });
              this.getData();
            } else {
              this.$message.error(res.message);
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style scoped>
.el-pagination {
  margin: 30px 0;
  text-align: center;
}
</style>
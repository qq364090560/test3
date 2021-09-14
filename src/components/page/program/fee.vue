<template>
  <div>
      <div style="height: 400px;">
        <div style="background:#fff; margin-bottom: 20px">
          <el-button type="primary" plain @click="dialogAdd=true">添加控制器</el-button>
          <!-- <el-button type="primary" plain>添加控制器</el-button> -->
        </div>
        <div class="door">
          <ul class="ul-div">
            <li v-for="(it,index) in data" :key="index" @click="doorController(it)">
              <span class="icon-door icon-font" :style="it.status=='在线' ? 'color:#15B513' : 'color:red'"></span>
              <span>{{it.snName}}</span>
            </li>
          </ul>
        </div>
      </div>

      <el-dialog title="控制器" :visible.sync="dialog" :show-close='false' :close-on-click-modal='false'>
        <el-form :model="form">
          <el-form-item label="sn" label-width="120px">
            <el-input v-model="form.sn" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="名称" label-width="120px">
            <el-input v-model="form.snName" autocomplete="off"></el-input>
            控制器名称说明：控制器名称结构为门名称；若控制器多个IO输出，应使用英文分号（";"）分隔。<br/>
            例如：“一号门;二号门;三号门;四号门”。注：不能以英文分号（";"）为结尾。
          </el-form-item>
          <!-- <el-form-item label="选择门" label-width="120px">
            <el-select v-model="form.index" placeholder="请选择开门选项">
              <el-option v-for="(it,index) in form.snName1" :key="index + 'a'"  :label="it" :value="index"></el-option>
            </el-select>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-form :model="form" style="" :inline="true">
            <div style="display:flex;justify-content: space-around;">
              <div>
                <el-form-item label="选择门" label-width="80px">
                  <el-select v-model="form.index" placeholder="请先选择开门选项再点击远程开门">
                    <el-option v-for="(it,index) in form.snName1" :key="index + 'a'"  :label="it" :value="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-button type="primary" @click="openDoor">远程开门</el-button>
              </div>
              <div>
                <el-form-item label="状态" label-width="80px">
                  <el-select v-model="doorStatus" placeholder="请先选择门再选择状态">
                    <el-option v-for="(it,index) in doorStatusArr" :key="index + 'b'"  :label="it.label" :value="it.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-button type="primary" @click="doorChange()">保存状态</el-button>
              </div>
            </div>
            <div>
              <el-button type="primary" @click="onSave">保 存</el-button>
              <el-button type="danger" @click="dialog = false">关 闭</el-button>
            </div>
          </el-form>
        </div>
      </el-dialog>
      
      <!-- <el-dialog title="保存" :visible.sync="dialogSave" :show-close='false' :close-on-click-modal='false'>
        <el-form :model="saveForm">
          <el-form-item label="sn" label-width="120px">
            <el-input v-model="saveForm.sn" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="名称" label-width="120px">
            <el-input v-model="saveForm.snName" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onSave">保 存</el-button>
          <el-button type="danger" @click="dialogSave = false">关 闭</el-button>
        </div>
      </el-dialog> -->

      <el-dialog title="添加控制器" :visible.sync="dialogAdd" :show-close='false' :close-on-click-modal='false'>
        <el-form :model="addFrom">
          <el-form-item label="sn" label-width="120px">
            <el-input v-model="addFrom.sn" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="名称" label-width="120px">
            <el-input v-model="addFrom.snName" autocomplete="off"></el-input>
            控制器名称说明：控制器名称结构为门名称；若控制器多个IO输出，应使用英文分号（";"）分隔。<br/>
            例如：“一号门;二号门;三号门;四号门”。注：不能以英文分号（";"）为结尾。
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onAdd">添 加</el-button>
          <el-button type="danger" @click="dialogAdd = false">关 闭</el-button>
        </div>
      </el-dialog>

      <el-container style="margin-top: 40px ">
        <template>
          <el-table
            ref="singleTable"
            :data="tableData"
            highlight-current-row
            @current-change="handleCurrentChange"
            :header-cell-style="{ background: '#409EFF', color: '#fff' }"
            height="40vh"
            >
            <el-table-column :label="socketStatus + ' | ' + tableData.length + '条'"  :class="[socketStatusClass ? 'success' : 'error']">
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                property="dateTime"
                label="日期"
                width="120">
              </el-table-column>
              <el-table-column
                property="name"
                label="小区"
                width="120">
              </el-table-column>
              <el-table-column
                property="detail"
                label="信息">
              </el-table-column>
            </el-table-column>
          </el-table>
          
        </template>
        
      </el-container>
  </div>
</template>

<script>
import {handOpen,setControllerStatus,updateController,addController} from '../../../api/api'
  export default {
    data(){
      return{
        data:[],
        tableData: [],

        dialog:false,
        form:{},
        doorStatusArr:[
          {value:1,label:"常开"},
          {value:2,label:"常闭"},
          {value:3,label:"在线控制"},
        ],
        doorStatus:'',

        dialogSave:false,
        saveForm:{},

        dialogAdd:false,
        addFrom:{},

        webSocket:null,
        doorWebSocket:null,
        socketStatus: '正在连接..',
        socketStatusClass: true
      }
    },
    created(){
      this.createWt()
      let ws=JSON.parse(sessionStorage.getItem('ws'))
      if(ws){
        this.tableData=ws
      }

    },
    mounted(){
        window.addEventListener('beforeunload', this.closeWebSocket);
    },
    beforeDestroy(){
      if(this.tableData.length>100){
        this.tableData=[];
        // this.tableData.splice(0,49)
      }
      sessionStorage.setItem('ws',JSON.stringify(this.tableData))
    },
    destroyed() {
        // this.closeWebSocket();
        // window.removeEventListener('beforeunload', this.closeWebSocket);
        // window.onbeforeunload = function (e) {
        //     var message = 'some word';
        //     e = e || window.event;

        //     if (e) {
        //         e.returnValue = message;
        //     }

        //     return message;
        // };
    },
    watch:{
      tableData(val,old){
        if(val.length>100){
          this.tableData=[]
          // this.tableData.splice(0,49)
        }
      }
    },
    methods:{
      // 添加
      onAdd(){
        let obj={
          wgSn:this.addFrom.sn,
          wgName:this.addFrom.snName
        }
        addController(obj).then(res=>{
          if(res.status==='200'){
            this.$message({
              message: res.message,
              type: 'success'
            });
          }
          this.dialogAdd=false;
        })
      },
      // 修改
      onSave(){
        let obj={
          wgSn:this.form.sn,
          wgName:this.form.snName
        }
        updateController(obj).then(res=>{
          if(res.status==='200'){
            this.$message({
              message: res.message,
              type: 'success'
            });
            this.dialog=false;
            this.createWt()
          }
        })
      },
      createWt(){
        if (!window.WebSocket) {
            alert('您的浏览器不支持WebSocket，请使用其他浏览器，例如谷歌浏览器');
            return;
        }
        // 获取刷卡动态
        var url="ws://plat.hlyzycn.com/hardware/passInfo/hly"
        this.websocket = new WebSocket(url);

        this.websocket.onopen = this.onOpen;
        this.websocket.onmessage = this.onMessage;
        this.websocket.onclose = this.onClose;
        // 监听控制器状态
        var burl="ws://plat.hlyzycn.com/hardware/socket/{}"
        this.doorWebSocket = new WebSocket(burl);

        this.doorWebSocket.onopen = this.onDoorOpen;
        this.doorWebSocket.onmessage = this.onDoorMessage;
        this.doorWebSocket.onclose = this.onDoorClose;
      },
      onOpen(event) {
          // console.log('websocket open')
          this.socketStatusClass = true;
      },
      //刷卡动态
      onMessage({ data }) {
          try {
              let row = JSON.parse(data);
              let keys = Object.keys(row);
              let len = keys.length;
              // 如果对象为空，或者只有一个属性并且属性的值为空，跳过
              if (!len || (len === 1 && !row[keys[0]])) {
                  return;
              }
              this.tableData.push(row);
              this.socketStatusClass = true;
          } catch(err) {
              // this.tableData=[];
              this.socketStatus = data;
              if (data === '实时通讯已连接') {
                  return;
              }
              this.socketStatusClass = false;
          }
      },
      closeWebSocket() {
          if (this.websocket) {
              this.websocket.close();
              this.websocket = null;
              // console.log('WebSocket closed.');
          }
      },

      
      
      tableRowClassName({row, rowIndex}) {
          const { tips } = row;
          console.log(tips)
          // if (tips?.trim() === '刷卡开门') {
          //     return 'success-row';
          // } else {
          //     return 'warning-row';
          // }
      },

      onClose() {
          // console.log('websocket close');
          this.socketStatusClass = false;
      },

      // 控制器
      onDoorOpen(event) {
          // console.log('websocket open')
          this.socketStatusClass = true;
      },
      onDoorMessage({ data }) {
          try {
              let row = JSON.parse(data);
              let keys = Object.keys(row);
              let len = keys.length;
              // 如果对象为空，或者只有一个属性并且属性的值为空，跳过
              if (!len || (len === 1 && !row[keys[0]])) {
                  return;
              }
              this.data=row;
              // console.log(this.data)
              this.socketStatusClass = true;
          } catch(err) {
              // this.tableData = []
              this.socketStatus = data;
              if (data === '实时通讯已连接') {
                  return;
              }
              this.socketStatusClass = false;
          }
      },
      closeDoorWebSocket() {
          if (this.doorWebSocket) {
              this.doorWebSocket.close();
              this.doorWebSocket = null;
              // console.log('WebSocket closed.');
          }
      },
      onDoorClose() {
          // console.log('websocket close');
          this.socketStatusClass = false;
      },

      doorController(v){
        this.dialog=true;
        v.snName1=v.snName.split(';')
        console.log(v)
        this.form=v
      },
      handleCurrentChange(v){
        console.log(v)
      },
      //远程开门
      openDoor(){
        if(!this.form){
          return
        }else{
          let parmas={
            userId:JSON.parse(sessionStorage.getItem('userInfo')).userId,
            sn:this.form.sn,
            door:this.form.index+1,
          }
          handOpen(parmas).then(res=>{
            if(res){
              this.$message({
                message: '开门成功',
                type: 'success'
              });
            }
          })
        }
      },
      doorChange(){
        if(!this.doorStatus){
          return
        }else{
          let parmas={
            sn:this.form.sn,
            door:this.form.index+1,
            status:this.doorStatus,
          }
          console.log(this.form)
          setControllerStatus(parmas).then(res=>{
            if(res.status==200){
              this.$message({
                message: '成功',
                type: 'success'
              });
            }else{
              this.$message.error(res.message);
            }
          })
        }
      }

    }
  }
</script>

<style scoped>
.door{
  
}
.ul-div{
  display: flex;
  align-items: center;
  flex-wrap:wrap;
}
.ul-div >li{
  width: 10%;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  cursor: pointer;

}
/*  表格行:hover样式 */

.el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: skyblue;
}
.el-table .warning-row {
    background-color: rgb(240, 152, 157);
}
.el-table .success-row {
    background-color: #89f1a3;
}
.icon-font{
  font-size: 40px;
}
</style>
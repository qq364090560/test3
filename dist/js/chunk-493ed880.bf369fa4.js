(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-493ed880"],{"1e7d":function(t,e,o){"use strict";o.r(e);var s=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[o("div",{staticStyle:{height:"400px"}},[o("div",{staticStyle:{background:"#fff","margin-bottom":"20px"}},[o("el-button",{attrs:{type:"primary",plain:""},on:{click:function(e){t.dialogAdd=!0}}},[t._v("添加控制器")])],1),o("div",{staticClass:"door"},[o("ul",{staticClass:"ul-div"},t._l(t.data,(function(e,s){return o("li",{key:s,on:{click:function(o){return t.doorController(e)}}},[o("span",{staticClass:"icon-door icon-font",style:"在线"==e.status?"color:#15B513":"color:red"}),o("span",[t._v(t._s(e.snName))])])})),0)])]),o("el-dialog",{attrs:{title:"控制器",visible:t.dialog,"show-close":!1,"close-on-click-modal":!1},on:{"update:visible":function(e){t.dialog=e}}},[o("el-form",{attrs:{model:t.form}},[o("el-form-item",{attrs:{label:"sn","label-width":"120px"}},[o("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.sn,callback:function(e){t.$set(t.form,"sn",e)},expression:"form.sn"}})],1),o("el-form-item",{attrs:{label:"名称","label-width":"120px"}},[o("el-input",{attrs:{autocomplete:"off"},model:{value:t.form.snName,callback:function(e){t.$set(t.form,"snName",e)},expression:"form.snName"}}),t._v('\n          控制器名称说明：控制器名称结构为门名称；若控制器多个IO输出，应使用英文分号（";"）分隔。'),o("br"),t._v('\n          例如：“一号门;二号门;三号门;四号门”。注：不能以英文分号（";"）为结尾。\n        ')],1)],1),o("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-form",{attrs:{model:t.form,inline:!0}},[o("div",{staticStyle:{display:"flex","justify-content":"space-around"}},[o("div",[o("el-form-item",{attrs:{label:"选择门","label-width":"80px"}},[o("el-select",{attrs:{placeholder:"请先选择开门选项再点击远程开门"},model:{value:t.form.index,callback:function(e){t.$set(t.form,"index",e)},expression:"form.index"}},t._l(t.form.snName1,(function(t,e){return o("el-option",{key:e+"a",attrs:{label:t,value:e}})})),1)],1),o("el-button",{attrs:{type:"primary"},on:{click:t.openDoor}},[t._v("远程开门")])],1),o("div",[o("el-form-item",{attrs:{label:"状态","label-width":"80px"}},[o("el-select",{attrs:{placeholder:"请先选择门再选择状态"},model:{value:t.doorStatus,callback:function(e){t.doorStatus=e},expression:"doorStatus"}},t._l(t.doorStatusArr,(function(t,e){return o("el-option",{key:e+"b",attrs:{label:t.label,value:t.value}})})),1)],1),o("el-button",{attrs:{type:"primary"},on:{click:function(e){return t.doorChange()}}},[t._v("保存状态")])],1)]),o("div",[o("el-button",{attrs:{type:"primary"},on:{click:t.onSave}},[t._v("保 存")]),o("el-button",{attrs:{type:"danger"},on:{click:function(e){t.dialog=!1}}},[t._v("关 闭")])],1)])],1)],1),o("el-dialog",{attrs:{title:"添加控制器",visible:t.dialogAdd,"show-close":!1,"close-on-click-modal":!1},on:{"update:visible":function(e){t.dialogAdd=e}}},[o("el-form",{attrs:{model:t.addFrom}},[o("el-form-item",{attrs:{label:"sn","label-width":"120px"}},[o("el-input",{attrs:{autocomplete:"off"},model:{value:t.addFrom.sn,callback:function(e){t.$set(t.addFrom,"sn",e)},expression:"addFrom.sn"}})],1),o("el-form-item",{attrs:{label:"名称","label-width":"120px"}},[o("el-input",{attrs:{autocomplete:"off"},model:{value:t.addFrom.snName,callback:function(e){t.$set(t.addFrom,"snName",e)},expression:"addFrom.snName"}}),t._v('\n          控制器名称说明：控制器名称结构为门名称；若控制器多个IO输出，应使用英文分号（";"）分隔。'),o("br"),t._v('\n          例如：“一号门;二号门;三号门;四号门”。注：不能以英文分号（";"）为结尾。\n        ')],1)],1),o("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[o("el-button",{attrs:{type:"primary"},on:{click:t.onAdd}},[t._v("添 加")]),o("el-button",{attrs:{type:"danger"},on:{click:function(e){t.dialogAdd=!1}}},[t._v("关 闭")])],1)],1),o("el-container",{staticStyle:{"margin-top":"40px"}},[[o("el-table",{ref:"singleTable",attrs:{data:t.tableData,"highlight-current-row":"","header-cell-style":{background:"#409EFF",color:"#fff"},height:"40vh"},on:{"current-change":t.handleCurrentChange}},[o("el-table-column",{class:[t.socketStatusClass?"success":"error"],attrs:{label:t.socketStatus+" | "+t.tableData.length+"条"}},[o("el-table-column",{attrs:{type:"index",label:"序号",width:"50"}}),o("el-table-column",{attrs:{property:"dateTime",label:"日期",width:"120"}}),o("el-table-column",{attrs:{property:"name",label:"小区",width:"120"}}),o("el-table-column",{attrs:{property:"detail",label:"信息"}})],1)],1)]],2)],1)},a=[],n=(o("fc02"),o("1bc7"),o("32ea"),o("4ec3")),l={data:function(){return{data:[],tableData:[],dialog:!1,form:{},doorStatusArr:[{value:1,label:"常开"},{value:2,label:"常闭"},{value:3,label:"在线控制"}],doorStatus:"",dialogSave:!1,saveForm:{},dialogAdd:!1,addFrom:{},webSocket:null,doorWebSocket:null,socketStatus:"正在连接..",socketStatusClass:!0}},created:function(){this.createWt();var t=JSON.parse(sessionStorage.getItem("ws"));t&&(this.tableData=t)},mounted:function(){window.addEventListener("beforeunload",this.closeWebSocket)},beforeDestroy:function(){this.tableData.length>100&&(this.tableData=[]),sessionStorage.setItem("ws",JSON.stringify(this.tableData))},destroyed:function(){},watch:{tableData:function(t,e){t.length>100&&(this.tableData=[])}},methods:{onAdd:function(){var t=this,e={wgSn:this.addFrom.sn,wgName:this.addFrom.snName};Object(n["a"])(e).then((function(e){"200"===e.status&&t.$message({message:e.message,type:"success"}),t.dialogAdd=!1}))},onSave:function(){var t=this,e={wgSn:this.form.sn,wgName:this.form.snName};Object(n["fb"])(e).then((function(e){"200"===e.status&&(t.$message({message:e.message,type:"success"}),t.dialog=!1,t.createWt())}))},createWt:function(){if(window.WebSocket){var t="ws://plat.hlyzycn.com/hardware/passInfo/hly";this.websocket=new WebSocket(t),this.websocket.onopen=this.onOpen,this.websocket.onmessage=this.onMessage,this.websocket.onclose=this.onClose;var e="ws://plat.hlyzycn.com/hardware/socket/{}";this.doorWebSocket=new WebSocket(e),this.doorWebSocket.onopen=this.onDoorOpen,this.doorWebSocket.onmessage=this.onDoorMessage,this.doorWebSocket.onclose=this.onDoorClose}else alert("您的浏览器不支持WebSocket，请使用其他浏览器，例如谷歌浏览器")},onOpen:function(t){this.socketStatusClass=!0},onMessage:function(t){var e=t.data;try{var o=JSON.parse(e),s=Object.keys(o),a=s.length;if(!a||1===a&&!o[s[0]])return;this.tableData.push(o),this.socketStatusClass=!0}catch(n){if(this.socketStatus=e,"实时通讯已连接"===e)return;this.socketStatusClass=!1}},closeWebSocket:function(){this.websocket&&(this.websocket.close(),this.websocket=null)},tableRowClassName:function(t){var e=t.row,o=(t.rowIndex,e.tips);console.log(o)},onClose:function(){this.socketStatusClass=!1},onDoorOpen:function(t){this.socketStatusClass=!0},onDoorMessage:function(t){var e=t.data;try{var o=JSON.parse(e),s=Object.keys(o),a=s.length;if(!a||1===a&&!o[s[0]])return;this.data=o,this.socketStatusClass=!0}catch(n){if(this.socketStatus=e,"实时通讯已连接"===e)return;this.socketStatusClass=!1}},closeDoorWebSocket:function(){this.doorWebSocket&&(this.doorWebSocket.close(),this.doorWebSocket=null)},onDoorClose:function(){this.socketStatusClass=!1},doorController:function(t){this.dialog=!0,t.snName1=t.snName.split(";"),console.log(t),this.form=t},handleCurrentChange:function(t){console.log(t)},openDoor:function(){var t=this;if(this.form){var e={userId:JSON.parse(sessionStorage.getItem("userInfo")).userId,sn:this.form.sn,door:this.form.index+1};Object(n["M"])(e).then((function(e){e&&t.$message({message:"开门成功",type:"success"})}))}},doorChange:function(){var t=this;if(this.doorStatus){var e={sn:this.form.sn,door:this.form.index+1,status:this.doorStatus};console.log(this.form),Object(n["db"])(e).then((function(e){200==e.status?t.$message({message:"成功",type:"success"}):t.$message.error(e.message)}))}}}},r=l,i=(o("6623"),o("cba8")),c=Object(i["a"])(r,s,a,!1,null,"3d9360bc",null);e["default"]=c.exports},6623:function(t,e,o){"use strict";o("9068")},9068:function(t,e,o){}}]);
//# sourceMappingURL=chunk-493ed880.bf369fa4.js.map
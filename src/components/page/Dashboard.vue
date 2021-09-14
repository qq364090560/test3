<template>
  <div>
    <el-row :gutter="20">
      <!-- <el-col :span="12">
        <el-card shadow="hover">
          <div style="height: 300px;">
            <div slot="header" class="clearfix">
              <span>语言详情</span>
            </div>Vue
            <el-progress :percentage="50" color="#42b983"></el-progress>JavaScript
            <el-progress :percentage="10" color="#f1e05a"></el-progress>CSS
            <el-progress :percentage="15"></el-progress>HTML
            <el-progress :percentage="10" color="#f56c6c"></el-progress>Node
            <el-progress :percentage="15" color="#f56c6c"></el-progress>
          </div>
        </el-card>
      </el-col> -->
      <el-row :gutter="20" class="mgb20">
            <el-col :span="8">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div class="grid-content grid-con-1">
                        <i class="el-icon-lx-people grid-con-icon"></i>
                        <div class="grid-cont-right">
                            <div class="grid-num">{{pageData.userCount || 0}}</div>
                            <div>用户数量</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div class="grid-content grid-con-2">
                        <i class="icon-tingchechang1 grid-con-icon"></i>
                        <div class="grid-cont-right">
                            <div class="grid-num">{{pageData.parkCount || 0}}</div>
                            <div>停车场数量</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" :body-style="{padding: '0px'}">
                    <div class="grid-content grid-con-3">
                        <i class="el-icon-document grid-con-icon"></i>
                        <div class="grid-cont-right">
                            <div class="grid-num">{{pageData.totalFinance || 0}}</div>
                            <div>总收益</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="bar"
            class="schart"
            canvasId="bar"
            :data="userList7"
            type="bar"
            :options="options"
          ></schart>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart
            ref="line"
            class="schart"
            canvasId="line"
            :data="financeList7"
            type="line"
            :options="options2"
          ></schart>
          
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
            <div id='pieChart' style="width:100%;height:300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card v-show="false" shadow="hover">
            <div id='linesChart' style="width:100%;height:300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Schart from "vue-schart";
import echarts from 'echarts';
import bus from "../common/bus";
import {homePage} from "../../api/api";
export default {
  name: "dashboard",
  data() {
    return {
      pageData:{},
      financeList7:[],
      userList7:[],
      pieData:[],
      // name: localStorage.getItem("ms_username"),
      Echarts:null,
      data: [
        {
          name: "2018/09/04",
          value: 1083
        },
        {
          name: "2018/09/05",
          value: 941
        },
        {
          name: "2018/09/06",
          value: 1139
        },
        {
          name: "2018/09/07",
          value: 816
        },
        {
          name: "2018/09/08",
          value: 327
        },
        {
          name: "2018/09/09",
          value: 228
        },
        {
          name: "2018/09/10",
          value: 1065
        }
      ],
      // 柱状图
      options: {
        title: "新增用户",
        showValue: true,
        fillColor: "rgb(45, 140, 240)",
        bottomPadding: 30,
        topPadding: 30
      },
      // 线状图
      options2: {
        title: "最近七天收益",
        fillColor: "#FC6FA1",
        axisColor: "#008ACD",
        contentColor: "#EEEEEE",
        bgColor: "#F5F8FD",
        bottomPadding: 30,
        topPadding: 30,
        // type: 'line',
        // title: {
        //     text: '最近七天收益',
        // },
        // bgColor: '#fbfbfb',
        // labels: ['6月', '7月', '8月', '9月', '10月'],
        // datasets: [{
        //     label: '家电',
        //     data: [234, 278, 270, 190, 230]
        // }, {
        //     label: '百货',
        //     data: [164, 178, 150, 135, 160]
        // }, {
        //     label: '食品',
        //     data: [114, 138, 200, 235, 190]
        // }]
      },
      // 饼状图
      option3: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: ["包月","临停","新办"],
        },
        // color:["#ee6666","#91cc75"],
        series: [
          {
            name: "访问来源",
            type: "pie",
            selectedMode: "single",
            // radius: [0, "30%"],

            label: {
              normal: {
                position: "inner"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.pieData,
            // data:[
            //   { name: "包月", value: 335, },
            //   { value: 279, name: "临停" },
            // ],
          },

        ]
      },
      option4 : {
          title: {
              text: '最近七天收益'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name: '邮件营销',
                  type: 'line',
                  stack: '总量',
                  data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                  name: '联盟广告',
                  type: 'line',
                  stack: '总量',
                  data: [220, 182, 191, 234, 290, 330, 310]
              },
              {
                  name: '视频广告',
                  type: 'line',
                  stack: '总量',
                  data: [150, 232, 201, 154, 190, 330, 410]
              },
              {
                  name: '直接访问',
                  type: 'line',
                  stack: '总量',
                  data: [320, 332, 301, 334, 390, 330, 320]
              },
              {
                  name: '搜索引擎',
                  type: 'line',
                  stack: '总量',
                  data: [820, 932, 901, 934, 1290, 1330, 1320]
              }
          ]
      },
    };
  },
  components: {
    Schart
  },
  computed: {
    role() {
      return this.name === "admin" ? "超级管理员" : "普通用户";
    }
  },
  created() {
    this.getHomePage()
    this.handleListener();
    // this.changeDate();
  },
  activated() {
    this.handleListener();
  },
  deactivated() {
    window.removeEventListener("resize", this.renderChart);
    bus.$off("collapse", this.handleBus);
  },
  methods: {
    getHomePage(){
      const groupId=JSON.parse(sessionStorage.getItem('userInfo')).groupId
      homePage({groupId}).then(res=>{
        if(res.status==200){
            this.pageData=res.data
          
            //更新图表数据
            this.userList7=this.pageData.userList7.reverse()
            this.financeList7=this.pageData.financeList7.reverse()
            this.pieData=this.pageData.series

            var option = this.Echarts1.getOption();
            option.series[0].data = this.pieData;
            this.Echarts1.setOption(option); 
        }else{
          this.$message.error('图表获取失败');
        }
      }).catch(err=>{
          this.$message.error('图表获取失败');
      })
    },
    showEcharts(){
        this.Echarts1=echarts.init(document.getElementById("pieChart"));
        this.Echarts1.setOption(this.option3)
        this.Echarts2=echarts.init(document.getElementById("linesChart"));
        this.Echarts2.setOption(this.option4)
      
      
    },
    changeDate() {
      // const now = new Date().getTime();
      // this.data.forEach((item, index) => {
      //   const date = new Date(now - (6 - index) * 86400000);
      //   item.name = `${date.getFullYear()}/${date.getMonth() +
      //     1}/${date.getDate()}`;
      // });
      // this.getHomePage()
      
      console.log(this.userList7)
    },
    handleListener() {
      bus.$on("collapse", this.handleBus);
      
      // 调用renderChart方法对图表进行重新渲染
      window.addEventListener("resize", this.renderChart);
    },
    handleBus(msg) {
      setTimeout(() => {
        this.renderChart();
      }, 300);
    },
    renderChart() {
      
      this.$refs.bar.renderChart();
      this.$refs.line.renderChart();
    }
  },
  mounted(){
      this.showEcharts()
  }
};
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>

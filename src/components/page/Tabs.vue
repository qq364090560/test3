<template>
    <el-dialog
        title="公告"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="60%"
        :show-close="false"
        >
        
        <el-collapse v-model="activeName" accordion v-for="(i,index) in noticeData" :key="index">
            <el-collapse-item :title="i.tittle" :name="i.index">
                <div class="prediv">
                    <pre>{{i.noticeStr}}</pre>
                </div>
            </el-collapse-item>
        </el-collapse>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleClose">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {homePageQuery} from '../../api/api'
    export default {
        name: 'tabs',
        props:{
            dialogVisible: false,
            noticeData:{
                type:Array
            }
        },
        data() {
            return {
            //    dialogVisible: false,
                activeName:1,
                // noticeData:[]
            }
        },
       
        // mounted(){
        //     this.getNotice()
        // },
        methods: {
            getNotice(){
                homePageQuery().then(res=>{
                    this.noticeData=res.data
                })
            },
            handleClose() {
                this.$emit('dialogChange',false)
            },
            // handleRead(index) {
            //     const item = this.unread.splice(index, 1);
            //     console.log(item);
            //     this.read = item.concat(this.read);
            // },
            // handleDel(index) {
            //     const item = this.read.splice(index, 1);
            //     this.recycle = item.concat(this.recycle);
            // },
            // handleRestore(index) {
            //     const item = this.recycle.splice(index, 1);
            //     this.read = item.concat(this.read);
            // }
        },
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
.prediv{
    height: 400px;
    overflow: auto;
}
</style>


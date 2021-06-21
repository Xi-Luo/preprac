<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px">
    </div>

    <div style="margin-left:2rem">
      <el-form ref="orderApply" :inline="true" class="demo-form-inline" :model="orderApply">
        <el-form-item label="编号:">{{orderApply.id}}
        </el-form-item>
        <el-form-item label="采购经费代码:">
          {{orderApply.fundCode}}
        </el-form-item>
        <el-form-item label="申请日期：">
          {{orderApply.applyDate}}
        </el-form-item>
        <el-form-item label="申请部门">
          {{orderApply.applyDepartment}}
        </el-form-item>
        <el-form-item prop="applyUser" label="申请人">
          {{orderApply.applyUser}}
        </el-form-item>
        <el-form-item label="采购总金额">
          {{orderApply.total}}
        </el-form-item>
      </el-form>
    </div>

    <div style="display: table;margin: 0 2rem;">
      <el-table
        :data="statusList"
        border>
        <el-table-column
          v-for="item in statusTable"
          :key="item.prop"
          :prop="item.prop"
          :width="item.width"
          :label="item.label"
        >
        </el-table-column>
        <el-table-column
            prop="result"
            width="150"
            label="进度"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.result">已完成</div>
            <div v-if="!scope.row.result">
              <el-button @click="uploadFile(scope.$index,scope.row)" type="text" size="small">上传文件</el-button>
              <el-button @click="finish(scope.$index,scope.row)" type="text" size="small">完成</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="display: table;margin:1rem auto">
      <el-table
          max-height="530px"
          border
          :data="orderApply.orderLists">
        <el-table-column
            v-for="(item,index) in tableList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
        >
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="上传文件" :visible.sync="fileVisible" :close-on-click-modal="false" width="400px">
      <el-upload
          class="upload-demo"
          drag
          :action="uploadUrl"
          :headers="{ Authorization: this.$store.state.token }"
          :on-success="uploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import navbar from "@/components/navbar";
export default {
  name: "applyDetail",
  components:{
    navbar
  },
  data(){
    return {
      id:'',
      orderApply:{},
      statusTable:[
        {prop: 'status',label:'状态',width:'150'}
      ],
      tableList:[
        {prop:'id',label:'序号',width:'110'},
        {prop:'name',label:'物资名称',width:'100'},
        {prop:'type',label:'品牌型号',width:'100'},
        {prop:'configuration',label:'配置或技术参数',width:'240'},
        {prop:'unit',label:'单位',width:'50'},
        {prop:'quantity',label:'数量',width:'50'},
        {prop:'budgetUnitPrice',label: '预算单价',width: '80'},
        {prop:'budgetTotalPrice',label: '预算总价',width: '80'},
        {prop:'reason',label: '申请原因',width: '240'},
        {prop: 'newUser',label: '新设备使用人',width: '80'}
      ],
      statusList:[],
      chooseStatus:'',
      fileVisible: false,
      uploadData:{
        oid:'',
        status:''
      },
      uploadUrl:'http://localhost:8080/file/upload'
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getOrder()
    this.getStatus()
  },
  methods:{
    uploadSuccess(){
      this.$message.success('上传成功')
      this.fileVisible = false
      this.getStatus()
    },
    uploadFile(index,row){
      this.uploadUrl = this.uploadUrl + '?'+'oid='+this.id+'&status='+ row.status
      console.log(this.uploadUrl)
      this.chooseStatus = row.status
      this.uploadData.status = row.status
      this.uploadData.oid = this.id
      this.fileVisible = true
    },
    finish(index,row){
      // let form = new FormData()
      // form.append('oid',this.orderApply.id)
      // form.append('status',row.status)

      this.uploadUrl = this.uploadUrl + '?'+'oid='+this.id+'&status='+ row.status
      console.log(this.uploadUrl)
      this.$axios.post(this.uploadUrl)
          .then(res=>{
            if(res.data.success){
              this.$message.success('状态完成')
              this.getStatus()
            }else{
              this.$message.error('状态完成失败')
            }
          }).catch(err=>{console.log(err)})
    },
    getStatus(){
      this.$axios.get('/order/orderStatus',{
        params:{
          oid:this.id
        }
      }).then(res=>{
        if(res.data.success){
          this.statusList = []
          for(let key in res.data.data){
            if(Object.hasOwnProperty.call(res.data.data,key)){
              let tmp= {
                status: key,
                result: res.data.data[key]
              }
              this.statusList.push(tmp)
            }
          }
        }
      }).catch(err=>{console.log(err)})
    },
    getOrder(){
      this.$axios.get('/order',{
        params:{
          id:this.id
        }
      }).then(
          (res)=>{
            if(res.data.success){
              this.orderApply = res.data.data
            }
          }
      ).catch((error)=>{console.log(error)})
    }
  }
}
</script>

<style scoped>

</style>
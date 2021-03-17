<template>
  <div>
    <navbar></navbar>

    <div style="padding-top: 65px">
      <el-form :inline="true" class="demo-form-inline" :model="orderApply">
        <el-form-item label="编号:">{{orderApply.id}}
        </el-form-item>
        <el-form-item label="采购经费代码:">
          {{orderApply.fundCode}}
        </el-form-item>
        <el-form-item label="申请日期:">
          {{orderApply.applyDate}}
        </el-form-item>
        <el-form-item label="申请部门:">
          {{orderApply.applyDepartment}}
        </el-form-item>
        <el-form-item label="申请人:">
          {{orderApply.applyUser}}
        </el-form-item>
        <el-form-item label="采购总金额:">
          {{orderApply.total}}
        </el-form-item>
      </el-form>
      <div style="display: table;margin: 0 auto;">
        <el-table
            border
            :data="orderApply.orderLists">
          <el-table-column
              type="index"
              width="50"
              label="序号">
          </el-table-column>
          <el-table-column
              v-for="(item,index) in tableList"
              :key="index"
              :width="item.width"
              :prop="item.prop"
              :label="item.label"
          ></el-table-column>
        </el-table>
      </div>
      <div class="btns">
        <el-button type="primary" @click="agree">通过</el-button>
        <el-button type="warning" @click="deny">拒绝</el-button>
      </div>
    </div>
    <el-dialog title="拒绝原因" :visible.sync="denyDialog">
      <el-input
          type="textarea"
          :rows="5"
          v-model="reason"
          aria-placeholder="请输入原因"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="denyDialog = false">取 消</el-button>
        <el-button type="primary" @click="denyConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import navbar from "@/components/navbar";
export default {
  name: "orderApprove",
  components:{
    navbar
  },
  data(){
    return{
      denyDialog:false,
      reason:'',
      orderApply:'',
      tableList:[
        {prop:'name',label:'物资名称',width:'100'},
        {prop:"type",label:"品牌型号",width:"100"},
        {prop:"configuration",label:"配置或技术参数",width:"240"},
        {prop:"unit",label:"单位",width:"80"},
        {prop:"quantity",label:"数量",width:"80"},
        {prop:"budgetUnitPrice",label:"预算单价(元)",width:"80"},
        {prop:"budgetTotalPrice",label:"预算总价(元)",width:"100"},
        {prop:"reason",label:"申请原因(请详细列明申购理由，并阐述采购必要性，要求不少于100字，如有旧设备，请列明)",width:"240"},
        {prop:"newUser",label:"新设备使用人",width:"120"}
      ]
    }
  },
  created() {
    this.orderApply = this.$route.query.order
  },
  methods:{
    agree(){
      let url
      if(this.$store.state.role===2){
        url = '/inst/approve'
      }else {
        url = '/dept/approve'
      }
      this.$getAxios(true).put(url,{
        id:this.orderApply.id
      }).then(res=>{
        if (res.data.success){
          this.$message.success('通过成功')
          this.$router.push({path:'/approval'})
        }else{
          this.$message.error('通过失败')
        }
      })
    },
    deny(){
      this.denyDialog = true
    },
    denyConfirm(){
      let url
      if(this.$store.state.role===2){
        url = '/inst/deny'
      }else {
        url = '/dept/deny'
      }
      if(this.reason===''){
        this.$message.warning('拒绝理由不能为空')
      }else{
        this.$getAxios(true).put(url,{
          id:this.orderApply.id,
          reason:this.reason
        }).then(res=>{
          if(res.data.success){
            this.$message.success('操作成功')
            this.$router.push({path:'/approval'})
          }else {
            console.log('this is denyConfirm',res)
            this.$message.error('操作失败')
          }
          this.denyDialog = false
        })
      }
    }
  }
}
</script>

<style scoped>
.btns{
  float: right;
  margin: 15px;
}
</style>
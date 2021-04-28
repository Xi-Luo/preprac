<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px">
    </div>
    <div style="display: table;margin:0 auto">
      <el-table
          height="80vh"
          border
          :data="purchaceOrders"
          @selection-change="handleSelectionChange"
      >
        <el-table-column
            fixed
            type="selection"
            width="55"
        />
        <el-table-column
            v-for="(item,index) in tableList"
            :key="index"
            :prop="item.prop"
            :width="item.width"
            :label="item.label"
        >
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 10px;position: fixed">
      <el-button type="primary" @click="pack">任命采购负责人</el-button>
    </div>

    <el-dialog title="任命采购人" width="400px" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-input placeholder="请输入采购人id" v-model="uid"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="packConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import navbar from "@/components/navbar";
export default {
  name: "purchaceOrder",
  components:{
    navbar
  },
  data(){
    return{
      uid:'',
      dialogFormVisible:false,
      purchaceOrders:[],
      multipleSelection:[],
      tableList:[
        {prop:'id',label:'序号',width:'110'},
        {prop:'name',label:'物资名称',width:'100'},
        {prop:'type',label:'品牌型号',width:'100'},
        {prop:'configuration',label:'配置或技术参数',width:'240'},
        {prop:'unit',label:'单位',width:'50'},
        {prop:'quantity',label:'数量',width:'50'},
        {prop:'budgetUnitPrice',label: '预算单价',width: '80'},
        {prop:'budgetTotalPrice',label: '预算总价',width: '80'},
        {prop:'reason',label: '申请原因(请详细列明申购理由，并阐述采购必要性，要求不少于100字，如有旧设备，请列明)',width: '240'},
        {prop: 'newUser',label: '新设备使用人',width: '80'},
        {prop: 'departmentName',label:'申请部门',width:'80'},
        {prop: 'applyUsername', label: '申请人', width: '80'}]
    }
  },
  created() {
    this.getPurchaceOrder()
  },
  methods:{
    packConfirm(){
      let orderLists =[]
      for(let i = 0;i<this.multipleSelection.length;i++){
        orderLists.push(this.multipleSelection[i].id)
      }
      this.$axios.post('/admin/purchace',{
        orderLists: orderLists,
        uid:this.uid
      }).then(res=>{
        if(res.data.success){
          this.$message.success('任命成功')
          this.dialogFormVisible = false
          this.getPurchaceOrder()
        }
      })
    },
    pack(){
      if(this.multipleSelection.length>0){
        this.uid = ''
        this.dialogFormVisible = true
      }else {
        this.$message.warning('请选择条目后任命')
      }

    },
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    getPurchaceOrder(){
      this.$axios.get('/orderlist/all',{
        params:{
          page:1
        }
      }).then((res)=>{
        this.purchaceOrders = res.data.data.content
      }).catch(err=>{console.log(err)})
    }
  }
}
</script>

<style scoped>

</style>
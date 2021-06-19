<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px">
    </div>
    <div style="display: table;margin:0 auto">
      <el-table
          :data="purchaceOrders"
          style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
                border
              :data="props.row.orderLists">
              <el-table-column
                  v-for="item in expandTable"
                  :key="item.prop"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
              ></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
            v-for="item in tableList"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
          ></el-table-column>
      </el-table>

      <div class="parent-page">
        <div class="child-page">
          <el-pagination
              background
              layout="prev, pager, next"
              :current-page="page"
              @current-change="currentChange"
              :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

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
      page:1,
      total:0,
      uid:'',
      dialogFormVisible:false,
      purchaceOrders:[],
      multipleSelection:[],
      tableList:[
        {prop:'id',label:'序号',width:'100'},
        {prop:'uid',label: '采购人', width: '180'},
        {prop:'createTime',label:'创建时间',width:'180'},
        {prop:'status0', label: '状态', width: '120'},
        {prop: 'updateTime', label: '更新时间', width: '180'}
      ],
      expandTable:[
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
      ]
    }
  },
  created() {
    this.getOrders(1)
  },
  methods:{
    handleSelectionChange(){},
    getOrders(p){
      this.$axios.get('/purchace/purchaces',{
        params:{
          page:p
        }
      }).then(res=>{
        if(res.data.success){
          console.log(res.data.data)
          this.purchaceOrders = res.data.data.content
          this.total=res.data.data.totalElements
        }
      }).catch(err=>{console.log(err)})
    },
    currentChange(current){
      this.getOrders(current)
    },
  }
}
</script>

<style scoped>
.parent-page{
  text-align: center;
  margin-top: 10px;
}
.child-page{
  display: inline-block;
}
</style>
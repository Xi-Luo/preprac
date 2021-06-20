<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px">
    </div>

    <div style="display: table;margin: 0 auto">
      <el-table
          :data="orderList"
          border
          v-loading="isLoading"
      >
        <el-table-column
            v-for="(item,index) in tableList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
        />
        <el-table-column
            label="操作"
            width="150">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.$index,scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
</template>

<script>
import navbar from "@/components/navbar";
import router from "@/router";
export default {
  name: "listOrderApply",
  components:{
    navbar
  },
  data(){
    return {
      page: 1,
      total: 0,
      isLoading: true,
      tableList:[
        {prop:'id',label:'编号',width:'100'},
        {prop:'uid',label:'申请人编号',width:'120'},
        {prop:'applyDepartment',label:'申请部门',width:'90'},
        {prop:'applyUser',label:'申请人',width:'100'},
        {prop:'applyDate',label:'申请日期',width:'150'},
        {prop:'updateTime',label:'更新日期',width:'150'},
        {prop:'fundCode',label:'申请经费代码',width:'120'},
        {prop:'total',label:'总金额',width:'120'}
      ],
      orderList:[]
    }
  },
  created() {
    this.getOrders(1)
  },
  methods:{
    handleClick(index,row){
      router.push({path:'/applyDetail',query:{id:row.id}})
    },
    currentChange(current){
      this.getOrders(current)
    },
    getOrders(p){
      this.$axios.get('/order/orders/all',{
        params:{
          page:p
        }
      }).then(res=>{
        if(res.data.success){
          console.log(res.data)
          this.orderList = res.data.data.content
          this.total = res.data.data.totalElements
          this.isLoading = false
        }else {
          this.$message.error('获取失败')
        }
      }).catch(err=>{console.log(err)})

    }
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
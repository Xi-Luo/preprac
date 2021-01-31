<template>
<div>
  <navbar></navbar>

  <div style="display: table;margin: 0 auto;padding-top: 65px">
  <el-table
      :data="orderApplies"
      border
      v-loading="isLoading">
    <el-table-column
        prop="id"
        label="编号"
        width="120">
    </el-table-column>
    <el-table-column
        prop="applyDepartment"
        label="申请部门"
        width="120">
    </el-table-column>
    <el-table-column
        prop="applyUser"
        label="申请人"
        width="120">
    </el-table-column>
    <el-table-column
        prop="applyDate"
        label="申请日期"
        width="150">
    </el-table-column>
    <el-table-column
        prop="fundCode"
        label="采购经费代码"
        width="120">
    </el-table-column>
    <el-table-column
        prop="total"
        label="总金额"
        width="120">
    </el-table-column>
    <el-table-column
        prop="status0"
        label="状态"
        width="120">
    </el-table-column>
    <el-table-column
        label="操作"
        width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.$index,scope.row)" type="text" size="small">查看</el-button>
<!--        <el-button style="color:red" @click="handleDelete(scope.$index,scope.row)" type="text" size="small">删除</el-button>-->
      </template>
    </el-table-column>
  </el-table>
    <div class="parent-page">
      <div class="child-page">
        <el-pagination
            background
            layout="prev, pager, next"
            :current-page="page"
            :page-size="pageSize"
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
import router from "@/router";
export default {
  name: "listOrder",
  components:{
    navbar
  },
  data(){
    return{
      isLoading: true,
      page:1,
      pageSize:2,
      total:0,
      orderApplies:[],
      orderApply:{
        id:'',
        applyDepartment:'',
        applyUser:'',
        fundCode:'',
        applyDate:'',
        total:'',
        orderLists:[]
      },
    }
  },
  methods:{
    handleDelete(index,row){
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$getAxios(true).delete('/order/'+row.id).then((res)=>{
          if (res.data.success){
            this.orderApplies.splice(index,1)
            this.$message(
                {
                  message:'删除成功',
                  type:"success"
                })
          }else {
            this.$message(
                {
                  message:'删除失败',
                  type:"error"
                }
            )
          }
        })
      }).catch();
    },
    handleClick(index){
       router.push({path:'/orderDetail',query:{order:this.orderApplies[index]}})
    },
    currentChange(current){
      this.$getAxios(true).get('/order/orders',{
        params:{
          id:sessionStorage.getItem('username'),
          page:current
        }
      }).then((res)=>{
        this.orderApplies = res.data.data.content;
        for(let i = 0; i <this.orderApplies.length;i++){
          console.log(this.orderApplies[i].status)
          if(this.orderApplies[i].status===0) {
            this.orderApplies[i].status0 = '已保存'
          } else if (this.orderApplies[i].status ===1) {
            this.orderApplies[i].status0 = '已提交'
          }
        }
      })
    }
  },
  created() {

    this.$getAxios(true).get('/order/orders',{
      params:{
        id:sessionStorage.getItem('username'),
        page:this.page
      }
    }).then((res)=>{
      if(res.data.success){
        this.orderApplies = res.data.data.content;
        for(let i = 0; i <this.orderApplies.length;i++){
          if(this.orderApplies[i].status===0) {
            this.orderApplies[i].status0 = '已保存'
          } else if (this.orderApplies[i].status ===1) {
            this.orderApplies[i].status0 = '已提交'
          }
        }
        this.total = res.data.data.totalElements;
        this.page = res.data.data.number+1;
        this.pageSize = res.data.data.pageSize;
        this.isLoading = false
      } else{
        this.isLoading = false
        this.$message(
            {
              message:'获取失败',
              type: 'error'
            }
        )
      }
    })
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
<template>
<div>
  <navbar></navbar>
  <div style="padding-top: 65px;display: flex;justify-content: center">
    <el-form :inline="true" :model="searchForm" >
      <el-form-item label="申请单id:">
        <el-input v-model="searchForm.oid" style="width: 6rem"></el-input>
      </el-form-item>
      <el-form-item label="申请部门">
        <el-select v-model="searchForm.applyDept" placeholder="请选择" style="width: 7rem" >
          <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.deptName"
              :value="item.deptName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请日期:">
        <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            placeholder="选择日期"
            style="width: 9rem"
        >
        </el-date-picker>~
        <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            placeholder="选择日期"
            style="width: 9rem"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="申请经费代码:">
        <el-input v-model="searchForm.fundCode" style="width: 6rem"></el-input>
      </el-form-item>
      <el-form-item label="申请人:">
        <el-input v-model="searchForm.user" style="width: 6rem"></el-input>
      </el-form-item>
      <el-button type="warning" @click="clearForm">重置</el-button>
      <el-button type="primary" @click="search" >搜索</el-button>
    </el-form>
  </div>

  <div style="display: table;margin: 0 auto">
  <el-table
      :data="orderApplies"
      border
      v-loading="isLoading">
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
        <el-button v-if="scope.row.status===1" @click="withdrawal(scope.$index,scope.row)" type="text" size="small">撤销提交</el-button>
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
      departmentOptions:[],
      searchForm:{
        oid:'',
        applyDept:'',
        startDate:'',
        endDate:'',
        user:'',
        fundCode:''
      },
      tableList:[
        {prop:'id',label:'编号',width:'100'},
        {prop:'applyDepartment',label:'申请部门',width:'90'},
        {prop:'applyUser',label:'申请人',width:'100'},
        {prop:'applyDate',label:'申请日期',width:'150'},
        {prop:'fundCode',label:'申请经费代码',width:'120'},
        {prop:'total',label:'总金额',width:'120'},
        {prop:'status0',label:'状态',width:'120'},
      ],
      isLoading: true,
      page:1,
      pageSize:2,
      total:0,
      orderApplies:[]
    }
  },
  methods:{
    getOrders(page){
      this.$axios.get('/order/orders', {
        params:{
          oid:this.searchForm.oid,
              applyDept:this.searchForm.applyDept,
              startDate:this.searchForm.startDate,
              endDate:this.searchForm.endDate,
              user:this.searchForm.user,
              fundCode:this.searchForm.fundCode,
              page:page
        }
      }).then((res)=>{
        if(res.data.success){
          this.orderApplies = res.data.data.content;
          for(let i = 0; i <this.orderApplies.length;i++){
            if(this.orderApplies[i].status===0) {
              this.orderApplies[i].status0 = '已保存'
            } else if (this.orderApplies[i].status ===1) {
              this.orderApplies[i].status0 = '已提交'
            } else if (this.orderApplies[i].status === 2) {
              this.orderApplies[i].status0 = '部门领导已通过'
            } else {
              this.orderApplies[i].status0 = '主管领导已通过'
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
      }).catch(err=>{console.log(err)})
    },
    clearForm(){
      this.searchForm={
        oid:'',
        applyDept:'',
        startDate:'',
        endDate:'',
        user:'',
        fundCode:''
      }
    },
    search(){
      this.isLoading = true
      this.getOrders(1)
    },
    getDepartmentOptions(){
      this.$axios.get('/department/departments')
          .then((res)=>{
            this.departmentOptions = res.data.data
          }).catch(err=>{console.log(err)})
    },
    withdrawal(index, row){
      this.$axios.put('/order/recall',{
        id: row.id
      }).then(res=>{
        if (res.data.success){
          this.getOrders(this.page)
        }
      }).catch(err=>{console.log(err)})

    },
    handleDelete(index,row){
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/order/'+row.id).then((res)=>{
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
       router.push({path:'/orderDetail',query:{id:this.orderApplies[index].id}})
    },
    currentChange(current){
      this.getOrders(current)
    }
  },
  created() {
    this.getDepartmentOptions()
    this.getOrders(1)
  }
}
</script>

<style scoped>
.el-button{
  padding:12px 10px;
}
.parent-page{
  text-align: center;
  margin-top: 10px;
}
.child-page{
  display: inline-block;
}
</style>
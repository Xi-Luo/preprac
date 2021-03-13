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
        <el-button type="primary" @click="getOrderList(1)" >搜索</el-button>
      </el-form>
    </div>

    <div class="main">
      <el-table
          :data="orderList"
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
            width="120">
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
            :page-size="pageSize"
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
  name: "instOrder",
  components:{
    navbar
  },
  data(){
    return{
      page:1,
      pageSize:0,
      total:0,
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
        {prop:'id',label:'编号',width:'120'},
        {prop:'applyDepartment',label:'申请部门',width:'120'},
        {prop:'applyUser',label:'申请人',width:'120'},
        {prop:'applyDate',label:'申请日期',width:'150'},
        {prop:'fundCode',label:'申请经费代码',width:'120'},
        {prop:'total',label:'总金额',width:'120'},
        {prop:'status0',label:'状态',width:'120'},
      ],
      isLoading: true,
      orderList:[]
    }
  },
  created() {
    this.getDepartmentOptions()
    this.getOrderList(1)
  },
  methods:{
    getDepartmentOptions(){
      this.$getAxios(true).get('/department/departments')
          .then((res)=>{
            this.departmentOptions = res.data.data
          }).catch(err=>{console.log(err)})
    },
    currentChange(current){
      this.getOrderList(current)
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
    getOrderList(page){
      this.$getAxios(true).get('/dept/orders',{
        params:{
          oid: this.searchForm.oid,
          applyDept: this.searchForm.applyDept,
          startDate: this.searchForm.startDate,
          endDate: this.searchForm.endDate,
          user:this.searchForm.user,
          fundCode:this.searchForm.fundCode,
          page:page
        }
      }).then(res=>{
        console.log(res)
        if (res.data.success){
          this.orderList = res.data.data.content
          for(let i = 0; i <this.orderList.length;i++){
            if(this.orderList[i].status===0) {
              this.orderList[i].status0 = '已保存'
            } else if (this.orderList[i].status ===1) {
              this.orderList[i].status0 = '已提交'
            } else if (this.orderList[i].status === 2) {
              this.orderList[i].status0 = '部门领导已通过'
            }
          }
          this.total = res.data.data.totalElements;
          this.page = res.data.data.number+1;
          this.pageSize = res.data.data.pageSize;
          this.isLoading = false
        }
      })
    },
    handleClick(index){
      router.push({path:'/orderDetail',query:{id:this.orderList[index].id}})
    }
  }

}
</script>

<style scoped>
.el-button{
  padding:12px 10px;
}
.main{
  display: table;
  margin: 0 auto;
}
.parent-page{
  text-align: center;
  margin-top: 10px;
}
.child-page{
  display: inline-block;
}
</style>
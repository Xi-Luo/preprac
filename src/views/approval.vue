<template>
  <div>
    <navbar></navbar>
    <div style="display: table;margin: 0 auto;padding-top: 65px">
      <el-table
          :data="orderApplies"
          border
          v-loading="isLoading">
        <el-table-column
            v-for="(item, index) in tableList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
        ></el-table-column>
        <el-table-column
            label="操作"
            width="80">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.$index,scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
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
import router from "@/router";
export default {
  name: "approval",
  components:{
    navbar
  },
  data(){
    return{
      page: 1,
      total:0,
      isLoading:true,
      tableList:[
        {prop:'id',label:'编号',width:'120'},
        {prop:'applyDepartment',label: '申请部门',width:'120'},
        {prop:"applyUser",label:"申请人",width:"120"},
        {prop:"applyDate",label:"申请日期",width:"150"},
        {prop:"fundCode",label:"采购经费代码",width:"120"},
        {prop:"total",label:"总金额",width:"120"}
      ],
      orderApplies:[]
    }
  },
  created() {
    let url
    if (this.$store.state.role===3){
      url = '/dept/list'
    } else {
      url = '/inst/list'
    }
    this.$getAxios(true).get(url,{
      params:{
        page: this.page
      }
    }).then(res=>{
      console.log('this is approval res', res)
      if(res.data.success){
        this.orderApplies = res.data.data.content
        this.total = res.data.data.totalElements
        this.page = res.data.data.number+1;
        this.isLoading = false
      }else{
        this.$message.error('获取失败')
        this.isLoading = false
      }
    })
  },
  methods:{
    handleClick(index,row){
      console.log('this is approval' ,index, row)
      router.push({path:'/orderApprove',query:{order:this.orderApplies[index]}})

    },
    currentChange(current){
      console.log(current)
      this.$getAxios(true).get('/dept/list',{
        params:{
          page: current
        }
      }).then(res=>{
        console.log('this is approval res', res)
        if(res.data.success){
          this.orderApplies = res.data.data.content
          this.page = res.data.data.number+1;
          this.isLoading = false
        }else{
          this.$message.error('获取失败')
          this.isLoading = false
        }
      })
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
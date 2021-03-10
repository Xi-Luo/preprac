<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px"></div>
    <div class="main">

      <el-table
          :data="orderList"
          border
          v-loading="isLoading">
        <el-table-column
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import navbar from "@/components/navbar";
export default {
  name: "deptOrder",
  components:{
    navbar
  },
  data(){
    return{
      isLoading: true,
      orderList:[]
    }
  },
  created() {
    this.getOrderList()
  },
  methods:{
    getOrderList(){

    }
  }
}
</script>

<style scoped>
.main{
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
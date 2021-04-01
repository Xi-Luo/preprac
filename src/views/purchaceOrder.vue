<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px">
      <el-table
          border
          :data="purchaceOrders"
      >
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
      purchaceOrders:[],
      tableList:[]
    }
  }
}
</script>

<style scoped>

</style>
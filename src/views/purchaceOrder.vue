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
      uid:'',
      dialogFormVisible:false,
      purchaceOrders:[],
      multipleSelection:[],
      tableList:[]
    }
  },
  created() {
  },
  methods:{
  }
}
</script>

<style scoped>

</style>
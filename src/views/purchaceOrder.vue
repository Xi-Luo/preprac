<template>
  <div>
    <navbar></navbar>
    <div style="margin-top: 65px">
      <el-table
          border
      ></el-table>
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

    }
  }
}
</script>

<style scoped>

</style>
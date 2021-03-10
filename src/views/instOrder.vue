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
  name: "instOrder",
  components:{
    navbar
  }

}
</script>

<style scoped>

</style>
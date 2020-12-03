<template>
<div>
  <navbar></navbar>
  information
</div>
</template>

<script>
// import  {getAxios} from '../store/api'
import navbar from "@/components/navbar";
export default {
name: "information",
  components: {navbar},
  // data(){
  //
  // },
  // created() {
  // getAxios().get('/user/info',{
  //   params:{
  //     username:this.$store.state.userName
  //   }
  // })
  // }
}
</script>

<style scoped>

</style>
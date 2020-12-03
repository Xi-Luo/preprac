<template>
  <div id="app">
<!--    <login></login>-->
<!--    <buyInForm></buyInForm>-->
    <router-view></router-view>
  </div>
</template>

<script>
// import login from "@/views/login";
// import buyInForm from "@/views/buyInForm";

export default {
  name: 'App',
  components:{
    // buyInForm
    // login
  }

}
</script>

<style>
#app {
  margin: 0;
  padding: 0;
}
*{
  margin: 0;
  padding: 0;
}
</style>

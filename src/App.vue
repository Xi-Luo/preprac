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
  },
  created() {
    //刷新不丢失store状态
    //在页面加载时,读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      console.log("load");
      this.$store.replaceState(
          Object.assign(
              {},
              this.$store.state,
              JSON.parse(sessionStorage.getItem("store"))
          )
      );
      sessionStorage.removeItem("store");
    }

    //在页面刷新时,将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      console.log("save");
      sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    });
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

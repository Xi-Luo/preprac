<template>
  <div>
    <el-menu
        :unique-opened="true"
        @select="handleSelect"
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
    >
      <el-submenu v-for="(item, index) in menu"
                  :key="index" :index="item.name">
        <template slot="title">
          <span slot="title">{{item.name}}</span>
        </template>
        <el-menu-item v-for="(child, index) in item.children" :key = "index" :index="child.path">{{child.name}}</el-menu-item>
      </el-submenu>
    </el-menu>

  </div>
</template>

<script>
export default {
  name: "navBar",
  data(){
    return{
      activeIndex: '1',
      menu: JSON.parse(window.sessionStorage.getItem('menu'))
    }
  },
  created() {
    // this.menu = this.$store.state.menu;
  },
  methods:{
    handleSelect(key, keyPath) {
      this.$router.push({path:key})
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>

</style>
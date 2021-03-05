<template>
  <div >
    <el-menu
        style="position: fixed;width: 100%;height: 60px;z-index: 9"
        :unique-opened="true"
        @select="handleSelect"
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal">
      <el-submenu v-for="(item, index) in menu"
                  :key="index" :index="item.name">
        <template slot="title">
          <span slot="title">{{item.name}}</span>
        </template>
        <el-menu-item v-for="(child, index) in item.children" :key = "index" :index="child.path">{{child.name}}</el-menu-item>
      </el-submenu>
        <el-dropdown trigger="click" class="account" @command="handleCommand">
          <el-badge :is-dot="showDot" class="UserMenu">
          <span class="el-dropdown-link" style="cursor: pointer">
            {{loginName}}
            <i class="el-icon-arrow-down"></i>
          </span>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-badge :value="noticeCount" class="item" :hidden="!showDot">
              <el-dropdown-item icon="el-icon-plus" command="notices">通知</el-dropdown-item>
            </el-badge>
            <el-dropdown-item icon="el-icon-switch-button" command="exit">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </el-menu>

  </div>
</template>

<script>
export default {
  name: "navBar",
  data(){
    return{
      activeIndex: '1',
      menu: JSON.parse(window.sessionStorage.getItem('menu')),
      username:'',
      showDot: false,
      noticeCount: 0,
      loginName: this.$store.state.loginName
    }
  },
  created() {
    // this.menu = this.$store.state.menu;
    this.username = this.$store.state.userName
    this.$getAxios(true).get("/notice/count",{
      params:{
        uid:this.$store.state.userName
      }
    }).then((res)=>{
      this.noticeCount = res.data.data
      if (res.data.data){
        this.showDot = true
      }
    })
  },
  methods:{
    handleSelect(key) {
      this.$router.push({path:key})
    },
    handleCommand(command){
      if(command==='exit'){
        this.exit()
      }else if (command === 'notices'){
        this.goToNotices()
      }
    },
    goToNotices(){
      this.$router.push({path:'/notices'})
    },
    exit(){
      this.$getAxios(true).get('/user/logout',{
        params:{
          uid: this.$store.state.userName
        }
      }).then(res=>{
        if(res.data.success){
          sessionStorage.clear()
          this.$store.commit('tokenClear')
          this.$store.commit('usernameClear')
          this.$store.commit('loginNameClear')
          this.$router.push({path:'/login'})
        }
      }).catch(err=>{console.log(err)})



    }
  }
}
</script>

<style scoped>
.account{
  position: fixed;
  right: 10px;
  top: 20px;
}
</style>
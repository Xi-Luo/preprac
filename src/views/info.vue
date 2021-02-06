<template>
  <div>
    <navbar></navbar>
    <div class="outer-div">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>用户信息</span>
        </div>
        <el-form ref="user" :model="user" label-width="90px">
          <el-form-item label="帐号:">{{user.id}}</el-form-item>
          <el-form-item label="用户名:">{{user.username}}</el-form-item>
          <el-form-item label="所属部门:">{{user.department}}</el-form-item>
          <el-form-item label="旧密码">
            <el-input v-model="oldPass" size="mini" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="newPass" size="mini" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input v-model="newPassConfirm" size="mini" show-password></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="confirmChange">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import navbar from "@/components/navbar";

export default {
  name: "info",
  components:{
    navbar
  },
  data(){
    return{
      user:{},
      oldPass:'',
      newPass:'',
      newPassConfirm:''
    }
  },
  methods:{
    confirmChange(){
      if(this.newPass===this.newPassConfirm){
        console.log('this is before axios')
        this.$getAxios(true).put('/user/pwd',{
          uid:this.user.id,
          oldPassword:this.oldPass,
          newPassword:this.newPass
        }).then(res=>{
          console.log(res)
          if(res.data.success){
            this.$message.success('修改成功')
          }else{
            this.$message.error('修改失败')
          }
        }).catch(err=>{console.log(err)})

      }
    }
  },

  created() {
    this.$getAxios(true).get('/user/info',{
      params:{
        id: this.$store.state.userName
      }
    }).then(res=>{
      if(res.data.success){
        console.log('this is res', res)
        this.user=res.data.data
      }
    })
  }
}
</script>

<style scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 400px;
}
.outer-div{
  padding-top: 125px;
  display: flex;
  justify-content: center;
}
.el-form-item{
  margin-bottom: 0px;
}
</style>
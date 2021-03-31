<template>
  <div>
    <navbar></navbar>
    <div class="outer-div">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>用户信息</span>
        </div>
        <el-form ref="form" :model="form" label-width="90px" :rules="rules">
          <el-form-item label="帐号:">{{user.id}}</el-form-item>
          <el-form-item label="用户名:">{{user.username}}</el-form-item>
          <el-form-item label="所属部门:">{{user.department}}</el-form-item>
          <el-form-item label="旧密码" prop="oldPass">
            <el-input v-model="form.oldPass" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input v-model="form.newPass" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="newPassConfirm">
            <el-input v-model="form.newPassConfirm" show-password></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" @click="confirmChange">确认修改</el-button>
        </div>
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
    let validateOld = (rule,value,callback)=>{
      if(value===''){
        callback(new Error('请输入旧密码'))
      } else {
        callback()
      }
    }
    let validateNew = (rule, value, callback) => {
      if (value===''){
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    let validateConfirm = (rule, value, callback) => {
      if(value===''){
        callback(new Error('请确认新密码'))
      } else if(value!==this.form.newPass){
        callback(new Error('与新密码不一致'))
      } else {
        callback()
      }
    }
    return{
      user:{},
      form:{
        oldPass:'',
        newPass:'',
        newPassConfirm:'',
      },
      rules:{
        oldPass:[{validator:validateOld, trigger:'blur'}],
        newPass:[{validator:validateNew, trigger:'blur'}],
        newPassConfirm:[{validator:validateConfirm, trigger:'blur'}]
      }
    }
  },
  methods:{
    confirmChange(){
      this.$refs['form'].validate((valid)=>{
        if(valid){
          this.$getAxios(true).put('/user/pwd',{
            uid:this.user.id,
            oldPassword:this.form.oldPass,
            newPassword:this.form.newPass
          }).then(res=>{
            console.log(res)
            if(res.data.success){
              this.$message.success('修改成功')
              sessionStorage.clear()
              this.$store.commit('tokenClear')
              this.$store.commit('usernameClear')
              this.$store.commit('loginNameClear')
              this.$router.push({path:'/login'})
            }else{
              this.$message.error('修改失败')
            }
          }).catch(err=>{console.log(err)})
        }
      })
    }
  },

  created() {
    this.$axios.get('/user/info',{
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

</style>
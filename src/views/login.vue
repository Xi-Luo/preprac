<template>
  <div class="bg">
    <el-row>
      <el-col :xs="{span:20,offset:2}"
              :sm="{span: 16,offset:4}" :md="{span:14,offset: 5}" :lg="{span:8,offset: 8}">
<!--      <el-col span="8" :offset="8">-->
        <el-card style="margin-top: 10%">
          <el-form :model="form" status-icon :rules="rules" ref="form" style="text-align: center">
            <h2>华南师范大学资产采购系统</h2>
            <h2>登 录</h2>
            <el-form-item prop="username" label="帐号" :label-width="formLabelWidth">
              <el-input v-model="form.username" autocomplete="off" aria-required="true"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
              <el-input  v-model="form.password" autocomplete="off" show-password></el-input>
            </el-form-item>
            <el-button type="primary" @click="login('form')">登录</el-button>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>


</template>

<script>

import {getAxios} from "@/store/api";
import router from "@/router";

export default {
  name: "login",
  data(){
    let validateName = (rule, value, callback)=>{
      if (value===''){
        callback(new Error('请输入帐号'))
      } else  {
        callback();
      }
    };
    let validatePass =  (rule, value, callback)=>{
      if (value===''){
        callback(new Error('请输入密码'))
      }else {
        callback();
      }
    };

    return{
      form: {
        username: '',
        password: ''
      },
      // menu:[],
      menuItem:{
        name:'',
        index:''
      },
      formLabelWidth: '40px',
      rules:{
        password:[{
          validator: validatePass,trigger:'blur'
        }],
        username:[{
          validator: validateName, trigger: 'blur'
        }]
      }
    }
  },
  methods:{
    login(formName){
      this.$refs[formName].validate((valid)=>{
        if (valid){
            getAxios(false).post('/user/login', {
              username:this.form.username,
              password: this.form.password
            }).then(response=>{
              console.log('',response)
            if(response.data.success===true){
              this.$store.commit('tokenSave',response.headers.authorization);
              this.$store.commit('userNameSave',this.form.username)
              // this.$store.commit('menuSave', response.data.data.menu)

              this.$store.commit('loginNameSave',response.data.data.loginName);
              console.log('loginName',response.data.data.loginName )
              window.sessionStorage.setItem('token',response.headers.authorization);
              window.sessionStorage.setItem('menu',JSON.stringify(response.data.data.menu));
              window.sessionStorage.setItem('username',this.form.username)
              // this.$store.commit('userNameSave', )
              this.$message({
                message:'登录成功',
                type:'success'
              })
              router.push({name:'listOrder'})
            }else{
              this.$message({
                message:'帐号或密码错误',
                type: 'error'
              });
            }
          }).catch(error=>{console.log(error);})
        }else{
          console.log('this is out')
          this.$message({
            message:'帐号或密码错误',
            type: 'error'
          });
          return false;
        }
      })

    }
  }


}
</script>

<style scoped>
 .bg{
   background-color: #efefef;
   height: 100vh;
 }


</style>
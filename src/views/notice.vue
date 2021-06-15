<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px">
      <div
        v-for="(item, index) in notices"
        :key="index"
        class="card-list">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{item.title}}</span>
            <el-button style="float: right; padding: 3px 0" type="text">申请单详情</el-button>
          </div>
          <div class="text">{{item.content}}</div>
          <div class="text">时间：{{item.time}}</div>
        </el-card>
      </div>
    </div>
    <div class="parent-page">
      <div class="child-page">
        <el-pagination
            background
            layout="prev, pager, next"
            :current-page="page"
            @current-change="currentChange"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import navbar from "@/components/navbar";
export default {
  name: "notice",
  components: {
    navbar
  },
  data(){
    return {
      page:1,
      total:0,
      notices:[]
    }
  },
  created(){
    this.markedAsRead()
    this.getNotices(1)
  },
  methods:{
    markedAsRead(){
      this.$axios.get('/notice/notices/read',{
        params:{
          uid:this.$store.state.userName
        }
      }).then().catch(err=>{console.log(err)})
    },
    getNotices(page){
      this.$axios.get('/notice/notices',{
        params:{
          uid: this.$store.state.userName,
          page: page
        }
      }).then(res=>{
        this.notices = res.data.data.content
        this.total = res.data.data.totalElements
        this.page = res.data.data.number + 1
      }).catch(err=>{console.log(err)})
    },
    currentChange(current){
      this.getNotices(current)
    }
  }
}
</script>

<style scoped>
.card-list{
  display: flex;
  justify-content: center;
}
.text{
  font-size: 14px;
}
.clearfix:before, .clearfix:after{
  display: table;
  content: "";
}
.clearfix:after{
  clear: both;
}
.box-card{
  width: 500px;
  margin-top: 20px;
}
.parent-page{
  text-align: center;
  margin-top: 10px;
}
.child-page{
  display: inline-block;
}
</style>
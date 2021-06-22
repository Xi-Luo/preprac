<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px;">
      <div style="margin-top: 1vh;margin-bottom: 1vh;margin-left: 1rem">
        <el-button type="primary" @click="getPackage">形成采购单</el-button>
      </div>
      <div style="display:table;margin:0 auto">
        <el-table
            :data="orderList"
            border
            @selection-change="handleSelectionChange"
        >
          <el-table-column
              width="40"
              type="selection"
              fixed="left"
          ></el-table-column>
          <el-table-column
              v-for="(item,index) in tableList"
              :key="index"
              :width="item.width"
              :prop="item.prop"
              :label="item.label"
          ></el-table-column>
        </el-table>
      </div>
      <div v-if="!loadingDone" id="loading" class="loading">
        加载中...
      </div>
      <div v-if="loadingDone" id="done" class="loading" >
        没有更多数据
      </div>

    </div>

    <el-dialog title="形成采购单" width="400px" :visible.sync="packageDialog" :close-on-click-modal="false">
      <el-form ref="purchaceForm" :rules="rule" :model="purchaceForm">
        <el-form-item prop="uid" label="申请人用户名" label-width="100px">
          <el-autocomplete
              popper-class="my-autocomplete"
              v-model="purchaceForm.uid"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入新设备使用人"
              :trigger-on-focus="false"
          >
            <template slot-scope="{ item }">
              <span class="name">{{ item.value }}</span>
              <span class="department">{{ item.username }}</span>
              <span class="department">{{ item.department }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="packageDialog = false">取 消</el-button>
        <el-button type="primary" @click="packageConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import navbar from "@/components/navbar";
export default {
  name: "orderList",
  components:{
    navbar
  },
  data(){
    let validateEmpty=(rule,value,callback)=>{
      if(value===''){
        callback(new Error('请输入用户帐号'))
      }else {
        callback()
      }
    }
    return {
      loadingDone:false,
      purchaceForm:{
        uid:''
      },
      packageDialog:false,
      orderList:[],
      tableList:[
        {prop:'id', label:'序号',width:'110'},
        {prop:'name', label:'物资名称',width:'100'},
        {prop:'type', label:'品牌型号',width:'100'},
        {prop:'configuration', label:'配置或技术参数',width:'240'},
        {prop:'unit', label:'单位',width:'50'},
        {prop:'quantity', label:'数量',width:'50'},
        {prop:'budgetUnitPrice', label:'预算单价',width:'80'},
        {prop:'budgetTotalPrice', label:'预算总价',width:'80'},
        {prop:'reason', label:'申购原因',width:'240'},
        {prop:'newUser', label:'新设备使用人',width:'110'},
        {prop: 'departmentName',label: '申请部门', width: '100'},
        {prop: 'applyUsername', label: '申请人姓名', width: '100'}
      ],
      page: 1,
      multipleSelection:[],
      rule:{
        uid:[{validator:validateEmpty,trigger:'blur'}]
      },
      multipleId:[],
    }
  },
  created() {
    this.getOrderList()
  },
  mounted() {
    let io = new IntersectionObserver(this.getOrderList)
    let loading = document.getElementById('loading')
    io.observe(loading)
  },
  methods:{
    querySearchAsync(queryString,cb){
      this.$axios.get('/user/users/info',{
        params:{
          username:queryString
        }
      }).then(res=>{
        let newUsers =[]
        for(let i = 0; i<res.data.data.length;i++){
          let tmp = {}
          tmp.value = res.data.data[i].id
          tmp.username = res.data.data[i].username
          tmp.department = res.data.data[i].department
          newUsers.push(tmp)
        }
        cb(newUsers)
      })
    },
    packageConfirm(){
      this.$refs['purchaceForm'].validate((valid)=>{
        if(valid){
          this.$axios.post('/purchace',{
            orderLists:this.multipleId,
            uid :this.purchaceForm.uid
          }).then(res=>{
            if(res.data.success){
              this.$message.success('操作成功')
              this.loadingDone = false
              this.orderList = []
              this.page = 1
              this.multipleId = []
              this.getOrderList()
            }else {
              this.$message.error('操作失败')
            }
          }).catch(err=>{console.log(err)})
          this.packageDialog = false
        }
      })
    },
    getPackage(){
      if(this.multipleId.length===0){
        this.$message.warning('您还没有选中设备')
      }else{
        this.packageDialog = true
        this.$nextTick(()=>{
          this.$refs['purchaceForm'].resetFields()
        })
      }
    },
    getOrderList(){
      if(!this.loadingDone){
        this.$axios.get('/orderlist/all',{
          params:{
            page:this.page
          }
        }).then(res=>{
          this.orderList = this.orderList.concat(res.data.data.content)
          if(res.data.data.content.length<10){
            this.loadingDone = true
          }
        }).catch(err=>{console.log(err)})
        this.page++
      }
    },
    handleSelectionChange(val){
      this.multipleSelection = val
      this.multipleId = []
      for(let item in this.multipleSelection){
        this.multipleId.push(this.multipleSelection[item].id)
      }
    }
  }
}
</script>

<style lang="scss">
.loading{
  text-align: center;
}
.my-autocomplete {
  li {
  line-height: normal;
  padding: 7px;
    .name {
     text-overflow: ellipsis;
      overflow: hidden;
    }
    .department {
      font-size: 12px;
      color: #b4b4b4;
      padding-top: 0;
    }
    .highlighted .department {
     color: #ddd;
    }
  }
}
</style>
<template>
<div>
  <navbar></navbar>
  <div style="padding-top: 65px"></div>
  <div class="search">
    <el-input
        placeholder="请输入用户id"
        prefix-icon="el-icon-search"
        v-model="userId"
        style="width: 16rem">
    </el-input>
    <el-button type="primary" @click="search">搜索</el-button>
    <el-button type="primary" @click="addOpen('addForm')">添加用户</el-button>
  </div>

  <div style="display: table;margin: 0 auto;">
    <el-table
        :data="userList"
        border
        v-loading="isLoading">
      <el-table-column
          v-for="(item, index) in tableList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
      ></el-table-column>
      <el-table-column
          label="操作"
          width="80">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="400px">
      <el-form ref="addForm" :model="addForm">
        <el-form-item label="帐号" prop="id" :label-width="formLabelWidth">
          <el-input v-model="addForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department" :label-width="formLabelWidth">
          <el-select v-model="addForm.department" placeholder="请选择">
            <el-option
                v-for="item in departmentOptions"
                :key="item.id"
                :label="item.deptName"
                :value="item.deptName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="role" :label-width="formLabelWidth">
          <el-select v-model="addForm.role" placeholder="请选择">
            <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="400px">
      <el-form ref="editForm" :model="editForm">
        <el-form-item label="帐号" prop="id" :label-width="formLabelWidth">
          <el-input v-model="editForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="editForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="department" :label-width="formLabelWidth">
          <el-select v-model="editForm.department" placeholder="请选择">
            <el-option
                v-for="item in departmentOptions"
                :key="item.id"
                :label="item.deptName"
                :value="item.deptName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="role" :label-width="formLabelWidth">
          <el-select v-model="editForm.role" placeholder="请选择">
            <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.name"
                :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>

<script>
import navbar from "@/components/navbar";
export default {
  name: "addUser",
  components:{
    navbar
  },
  data(){
    return{
      editDialogVisible: false,
      roleOptions:[
        {
          id:1,
          name:'管理员'
        },
        {
          id:2,
          name:'主管院领导'
        },
        {
          id:3,
          name:'部门领导'
        },
        {
          id:4,
          name:'普通用户'
        }
      ],
      departmentOptions: [],
      dialogFormVisible: false,
      addForm:{
        id:'',
        username:'',
        department:'',
        password:'',
        role:''
      },
      editForm:{
        id:'',
        username:'',
        department:'',
        password:'',
        role:''
      },
      formLabelWidth:'80px',
      userId:'',
      page: 1,
      total:0,
      isLoading:true,
      tableList:[
        {prop:'id',label:'帐号',width:'120'},
        {prop:'username',label: '用户名',width:'120'},
        {prop:"department",label:"部门",width:"120"},
        {prop:"role",label:"职位",width:"120"}
      ],
      userList:[]
    }
  },
  created() {
    this.$getAxios(true).get('/admin/user/users',{
      params:{
        page:this.page
      }
    }).then(res=>{
      if(res.data.success){
        this.userList = res.data.data.content
        this.total = res.data.data.totalElements
        this.page = res.data.data.number+1;
        this.isLoading = false
      }else{
        this.$message.error('获取失败')
        this.isLoading = false
      }
    }).catch(err=>{console.log(err)})

    this.$getAxios(true).get('/department/departments')
        .then((res)=>{
          this.departmentOptions = res.data.data
        }).catch(err=>{console.log(err)})
  },
  methods:{
    editConfirm(){
      this.$getAxios(true).put('/admin/user',this.editForm)
      .then(res=>{
        console.log(res)
        if (res.data.success){
          this.$message.success('修改成功')
        }else{
          this.$message.error('修改失败')
        }
        this.editDialogVisible = false
      })
    },
    search(){
      if(this.userId){
        this.$getAxios(true).get('/admin/user',{
          params:{
            uid:this.userId
          }
        }).then(res=>{
          if (res.data.success){
            this.userList = []
            this.userList.push(res.data.data)
          }else {
            this.$message.info('未找到该用户')
          }
        }).catch(err=>{console.log(err)})
      }else {//当输入值为空返回所有用户
        this.$getAxios(true).get('/admin/users',{
          params:{
            page:this.page
          }
        }).then(res=>{
          if(res.data.success){
            this.userList = res.data.data.content
            this.total = res.data.data.totalElements
            this.page = res.data.data.number+1;
            this.isLoading = false
          }else{
            this.$message.error('获取失败')
            this.isLoading = false
          }
        }).catch(err=>{console.log(err)})
      }

    },
    addConfirm(){
      this.$getAxios(true).post('/admin/user',this.addForm)
      .then(res=>{
        if (res.data.success){
          this.$message.success('添加成功')
        }else {
          this.$message.error('添加失败')
        }
        this.dialogFormVisible = false
      })
    },
    addOpen(formName){
      this.$nextTick(()=>{
        this.$refs[formName].resetFields()
      })
      this.dialogFormVisible=true
    },
    currentChange(current){
      this.$getAxios(true).get('/admin/users',{
        params:{
          page:current
        }
      }).then(res=>{
            if(res.data.success){
              this.userList = res.data.data.content
              this.total = res.data.data.totalElements
              this.page = res.data.data.number+1;
              this.isLoading = false
            }else{
              this.$message.error('获取失败')
              this.isLoading = false
            }
          }).catch(err=>{console.log(err)})
    },
    handleClick(index,row){
      this.editForm = row
      this.editDialogVisible = true
    }
  }
}
</script>

<style scoped>
.parent-page{
  text-align: center;
  margin-top: 10px;
}
.child-page{
  display: inline-block;
}
.search{
  display: flex;
  justify-content: center;
  margin:1rem
}
</style>
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
    <el-button type="primary" @click="batchAddVisible = true">批量添加用户</el-button>
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

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" :close-on-click-modal="false" width="400px">
      <el-form ref="addForm" :rules="addRules" :model="addForm">
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

    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" :close-on-click-modal="false" width="400px">
      <el-form ref="editForm" :model="editForm">
        <el-form-item label="帐号" prop="id" :label-width="formLabelWidth">
          <el-input v-model="editForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="editForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth" >
          <el-input v-model="editForm.password" autocomplete="off" show-password></el-input>
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
        <el-form-item label="是否采购负责人" prop="inCharge0" :label-width="formLabelWidth">
          <el-select v-model="editForm.inCharge0" placeholder="请选择">
            <el-option
                v-for="item in chargeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量添加用户" :visible.sync="batchAddVisible" :close-on-click-modal="false" width="400px">
      <el-upload
          class="upload-demo"
          drag
          action="http://localhost:8080/admin/user/batchAdd"
          :headers="{ Authorization: this.$store.state.token }"
          :on-success="uploadSuccess"
          >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <div style="margin-top: 0.5rem">
        <el-button type="primary"  @click="downloadFile">下载批量添加模板</el-button>
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
    let validateEmpty = (rule, value, callback) => {
      if(value===''){
        callback(new Error('该字段不能为空'))
      } else {
        callback()
      }
    }
    return{
      batchAddVisible: false,
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
      chargeOptions:[
        {id:0,name:'否'},
        {id:1,name:'采购负责人'},
        {id:2,name:'总采购负责人'}
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
        role:'',
        inCharge:'',
        inCharge0:''
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
        {prop:"role",label:"职位",width:"120"},
        {prop: 'inCharge0',label: '是否采购负责人', width: '120'}
      ],
      userList:[],
      addRules:{
        id:{validator:validateEmpty,trigger:'blur'},
        username:{validator:validateEmpty,trigger:'blur'},
        department:{validator:validateEmpty,trigger:'blur'},
        password:{validator:validateEmpty,trigger:'blur'},
        role:{validator:validateEmpty,trigger:'blur'}
      }
    }
  },
  created() {
    this.getUsers(1)

    this.$axios.get('/department/departments')
        .then((res)=>{
          this.departmentOptions = res.data.data
        }).catch(err=>{console.log(err)})
  },
  methods:{
    getUsers(p){
      this.$axios.get('/admin/user/users',{
        params:{
          page:p
        }
      }).then(res=>{
        if(res.data.success){
          this.userList = res.data.data.content
          for(let i = 0; i<this.userList.length;i++){
            if(this.userList[i].inCharge==='0'){
              this.userList[i].inCharge0 = '否'
            }else if(this.userList[i].inCharge==='1'){
              this.userList[i].inCharge0 = '采购负责人'
            }else {
              this.userList[i].inCharge0 = '总采购负责人'
            }
          }
          this.total = res.data.data.totalElements
          this.page = res.data.data.number+1;
          this.isLoading = false
        }else{
          this.$message.error('获取失败')
          this.isLoading = false
        }
      }).catch(err=>{console.log(err)})
    },
    chargeMan(){
      console.log('this is type',this.editForm.type)
      this.$axios.get('/admin/user/appointment',{
        params:{
          uid:this.editForm.id,
          type:this.editForm.inCharge0
        }
      }).then((res)=>{
        console.log(res)
      })
    },
    downloadFile(){
      this.$axios
          .get("/admin/user/template", {
            responseType: "blob",   //文件下载的 url 需要带上这个参数
          })
          .then((res) => {
            console.log(res);
            const { data, headers } = res;
            const fileName = headers["content-disposition"].replace(
                /\w+;filename=(.*)/,
                "$1"
            );   //根据返回头的content-disposition字段中的参数决定文件名
            //content-type 决定文件类型
            const blob = new Blob([data], { type: headers["content-type"] });
            //下载文件方式：在 html 中插入一个不可见的 a 标签，将返回的文件连接到 a 标签上实现下载
            let dom = document.createElement("a");
            let url = window.URL.createObjectURL(blob);
            dom.href = url;
            dom.download = decodeURI(fileName);
            dom.style.display = "none";
            document.body.appendChild(dom);
            dom.click();
            dom.parentNode.removeChild(dom);
            window.URL.revokeObjectURL(url);
          })
          .catch((err) => {
            console.log(err);
          });
    },
    uploadSuccess(){
      this.$message.success('上传成功')
      this.batchAddVisible = false
      this.getUsers(1)
    },
    editConfirm(){
      this.$getAxios(true).put('/admin/user',this.editForm)
      .then(res=>{
        console.log(res)
        if (res.data.success){
          this.$message.success('修改成功')
          this.getUsers(1)
        }else{
          this.$message.error('修改失败')
        }
        this.editDialogVisible = false
      }).catch(err=>{console.log(err)})
      let reg = /^\d+$/
      if(reg.test(this.editForm.inCharge0)){
        this.chargeMan()
      }
      this.getUsers(1)
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
            for(let i = 0; i<this.userList.length;i++){
              if(this.userList[i].inCharge===false){
                this.userList[i].inCharge0 = '否'
              }else{
                this.userList[i].inCharge0 = '是'
              }
            }
          }else {
            this.$message.info('未找到该用户')
          }
        }).catch(err=>{console.log(err)})
      }else {//当输入值为空返回所有用户
        this.getUsers(1)
      }
    },
    addConfirm(){
      this.$refs['addForm'].validate((valid)=>{
        if(valid){
          this.$getAxios(true).post('/admin/user',this.addForm)
              .then(res=>{
                if (res.data.success){
                  this.$message.success('添加成功')
                  this.getUsers(1)
                }else {
                  this.$message.error('添加失败')
                }
                this.dialogFormVisible = false
              })
        }
      })
    },
    addOpen(formName){
      this.$nextTick(()=>{
        this.$refs[formName].resetFields()
      })
      this.dialogFormVisible=true
    },
    currentChange(current){
      this.getUsers(current)
    },
    handleClick(index,row){
      for(let key in row){
        if(Object.hasOwnProperty.call(row,key)){
          this.editForm[key]=row[key]
        }
      }
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
<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px"></div>

    <div class="departments">
      <div class="addBtn">
        <el-button type="primary" @click="addDept">添加部门</el-button>
      </div>
      <el-table
      :data="departments"
      border
      v-loading="isLoading">
        <el-table-column
            v-for="item in tableList"
            :key="item.id"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
        ></el-table-column>
        <el-table-column
            label="操作"
            width="150">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.$index,scope.row)" type="text" style="color: red" size="small">删除</el-button>
          </template></el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加部门" :visible.sync="addFormVisible" :close-on-click-modal="false" width="350px">
      <el-form ref="addForm" :rules="addRules" :model="addForm">
        <el-form-item label="部门名称" prop="deptName" :label-width="formLabelWidth">
          <el-input v-model="addForm.deptName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑部门" :visible.sync="editFormVisible" :close-on-click-modal="false" width="350px">
      <el-form ref="editForm" :rules="addRules" :model="editForm">
        <el-form-item label="部门名称" prop="deptName" :label-width="formLabelWidth">
          <el-input v-model="editForm.deptName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import navbar from "@/components/navbar";
export default {
  name: "departmentManage",
  components:{
    navbar
  },
  data(){
    let validateEmpty=(rule,value,callback)=>{
      if(value===''){
        callback(new Error('该字段不能为空'))
      }else{
        callback()
      }
    }
    return {
      formLabelWidth:'80px',
      departments: [],
      isLoading:true,
      tableList:[
        {prop:'id',label:'序号',width:'120'},
        {prop:'deptName',label:'部门名称',width:'120'}],
      addForm:{
        deptName:''
      },
      addRules:{
        deptName:{validator:validateEmpty,trigger:'blur'}
      },
      addFormVisible:false,
      editFormVisible:false,
      editForm:{
        id:'',
        deptName:''
      },
    }
  },
  created() {
    this.getDepartments()
  },
  methods:{
    handleEdit(index,row){
      this.editForm.deptName=row.deptName
      this.editForm.id= row.id
      this.editFormVisible = true
    },
    editConfirm(){
      this.$refs['editForm'].validate((valid)=>{
        if(valid){
          this.$axios.put('/department',this.editForm)
              .then(res=>{
                if(res.data.success){
                  this.$message.success('修改成功')
                  this.getDepartments()
                }else{
                  this.$message.error('修改失败')
                }
              }).catch(err=>{console.log(err)})
          this.editFormVisible = false
        }
      })
    },
    addDept(){
      this.addForm.deptName=''
      this.addFormVisible=true
    },
    addConfirm(){
      this.$refs['addForm'].validate((valid)=>{
        if(valid){
          this.$axios.post('/department',this.addForm)
              .then(res=>{
                if(res.data.success){
                  this.$message.success('添加成功')
                  this.getDepartments()
                }else{
                  this.$message.error('添加失败')
                }
              }).catch(err=>{console.log(err)})
          this.addFormVisible=false
        }
      })
    },
    handleDelete(index,row){
      console.log(index,row)
      this.$confirm('删除部门将移除部门内所有用户，确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete('/admin/department/'+row.id)
            .then(res=>{
              if(res.data.success){
                this.$message.success('删除成功')
                this.getDepartments()
              }
            }).catch(err=>{console.log(err)})
      }).catch();
    },
    getDepartments(){
      this.$axios.get('/department/departments')
      .then(res=>{
        if(res.data.success){
          this.departments = res.data.data
          this.isLoading = false
        }
      }).catch(err=>{console.log(err)})
    }
  }
}
</script>

<style scoped>
.addBtn{
  margin:1vh
}
.departments{
  display: table;
  margin: 0 auto;
}
</style>
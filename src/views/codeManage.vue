<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px">
    </div>
    <div class="mainBody">
      <div class="addBtn">
        <el-button type="primary" @click="addCode">添加经费代码</el-button>
      </div>

      <el-table
          :data="codeList"
          border
          v-loading="isLoading">
        <el-table-column
            type="index"
            width="80"
        ></el-table-column>
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

    <el-dialog title="添加经费代码" :visible.sync="addFormVisible" :close-on-click-modal="false" width="350px">
      <el-form ref="addForm" :rules="addRules" :model="addForm">
        <el-form-item label="经费代码" prop="value" :label-width="formLabelWidth">
          <el-input v-model="addForm.value" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑经费代码" :visible.sync="editFormVisible" :close-on-click-modal="false" width="350px">
      <el-form ref="editForm" :rules="addRules" :model="editForm">
        <el-form-item label="经费代码" prop="value" :label-width="formLabelWidth">
          <el-input v-model="editForm.value" autocomplete="off"></el-input>
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
  name: "codeManage",
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
    return{
      formLabelWidth:'80px',
      isLoading:true,
      tableList:[
        {prop: 'value',label: '经费代码', width: '150'}
      ],
      codeList:[],
      addForm:{
        description: '采购经费代码',
        value:''
      },
      addRules:{
        value:{validator:validateEmpty,trigger:'blur'}
      },
      addFormVisible:false,
      editForm:{
        id:'',
        description: '采购经费代码',
        value:''
      },
      editFormVisible:false
    }
  },
  created() {
    this.getCodeList()
  },
  methods:{
    getCodeList(){
      this.$axios.get('/admin/settings/all',{
        params:{
          description:'采购经费代码'
        }
      }).then(res=>{
        if(res.data.success){
          this.codeList = res.data.data
          this.isLoading=false
        }
      }).catch(err=>{console.log(err)})
    },
    addCode(){
      this.addFormVisible = true
      this.addForm.value = ''
    },
    addConfirm(){
      this.$refs['addForm'].validate((valid)=>{
        if(valid){
          this.$axios.post('/admin/settings', this.addForm)
              .then(res=>{
                if(res.data.success){
                  this.$message.success('添加成功')
                  this.addFormVisible=false
                  this.getCodeList()
                }else {
                  this.$message.error('添加失败')
                }
              }).catch(err=>{console.log(err)})
        }
      })
    },
    handleDelete(index,row){
      this.$confirm('确定删除吗？',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:"warning"
      }).then(()=>{
        this.$axios.delete('/admin/settings/'+row.id)
            .then(res=>{
              if(res.data.success){
                this.$message.success('删除成功')
                this.getCodeList()
              }else{
                this.$message.error('删除失败')
              }
            }).catch(err=>{console.log(err)})
      }).catch(err=>{console.log(err)})
    },
    handleEdit(index,row){
      this.editForm.id = row.id
      this.editForm.value=row.value
      this.editFormVisible = true
    },
    editConfirm(){
      this.$refs['editForm'].validate((valid)=>{
        if(valid){
          this.$axios.put('/admin/settings',this.editForm)
              .then(res=>{
                if(res.data.success){
                  this.$message.success('修改成功')
                  this.editFormVisible = false
                  this.getCodeList()
                }else{
                  this.$message.error('修改失败')
                }
              }).catch(err=>{console.log(err)})
        }
      })
    }
  }
}
</script>

<style scoped>
.addBtn{
  margin:1vh
}
.mainBody{
  display: table;
  margin: 0 auto;
}
</style>
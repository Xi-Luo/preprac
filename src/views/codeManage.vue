<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px">
    </div>
    <div class="mainBody">
      <div class="addBtn">
        <el-input
            placeholder="请输入经费代码"
            prefix-icon="el-icon-search"
            v-model="description"
            style="width: 16rem">
        </el-input>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button type="primary" @click="addCode">添加经费代码</el-button>
      </div>

      <el-table
          :data="codeList"
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

    <el-dialog title="添加经费代码" :visible.sync="addFormVisible" :close-on-click-modal="false" width="350px">
      <el-form ref="addForm" :rules="addRules" :model="addForm">
        <el-form-item label="描述" prop="description" :label-width="formLabelWidth">
          <el-input v-model="addForm.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="经费代码" prop="value" :label-width="formLabelWidth">
          <el-input v-model="addForm.value" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑经费代码" :visible.sync="addFormVisible" :close-on-click-modal="false" width="350px">
      <el-form ref="editForm" :rules="addRules" :model="addForm">
        <el-form-item label="描述" prop="description" :label-width="formLabelWidth">
          <el-input v-model="editForm.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="经费代码" prop="value" :label-width="formLabelWidth">
          <el-input v-model="editForm.value" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
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
        {prop:'id',label:'序号',width:'100'},
        {prop: 'description', label: '描述', width: '150'},
        {prop: 'value',label: '经费代码', width: '150'}
      ],
      codeList:[],
      addForm:{
        description:'',
        value:''
      },
      addRules:{
        description:{validator:validateEmpty,trigger:'blur'},
        value:{validator:validateEmpty,trigger:'blur'}
      },
      addFormVisible:false,
      editForm:{
        description:'',
        value:''
      },
      description:''
    }
  },
  created() {
    this.getCodeList()
  },
  methods:{
    getCodeList(){
      this.$axios.get('/admin/settings/all',{
        params:{
          description:''
        }
      }).then(res=>{
        if(res.data.success){
          console.log(res.data)
          this.isLoading=false
        }
      }).catch(err=>{console.log(err)})
    },
    addCode(){
      this.addFormVisible = true
      this.addForm.description = ''
      this.addForm.value = ''
    },
    addConfirm(){},
    handleDelete(index,row){
      console.log(index,row)
    },
    handleEdit(index,row){
      console.log(index,row)
      this.editForm.description=row.description
      this.editForm.id= row.id
      this.addForm.value=row.value
      this.editFormVisible = true
    },
    editConfirm(){},
    search(){}
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
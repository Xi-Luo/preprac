<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px">
        <el-form :inline="true" class="demo-form-inline" :model="orderApply">

          <el-form-item label="申请部门">
            <el-select v-model="orderApply.applyDepartment" placeholder="请选择">
              <el-option
                  v-for="item in departmentOptions"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.deptName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请人">
            <el-input style="width: 10vw" placeholder="申请人" v-model="orderApply.applyUser"></el-input>
          </el-form-item>
          <el-form-item label="采购经费代码">
            <el-input style="width: 10vw" placeholder="采购经费代码" v-model="orderApply.fundCode"></el-input>
          </el-form-item>
          <el-form-item label="采购总金额：">
            {{this.orderApply.total}}
          </el-form-item>
        </el-form>
        <el-table
            height="500"
            :data="orderApply.orderLists">
          <!--      <el-table-column-->
          <!--          fixed-->
          <!--          prop="no"-->
          <!--          label="序号"-->
          <!--          width="50">-->
          <!--      </el-table-column>-->
          <el-table-column
              prop="name"
              label="物资名称"
              width="100">
          </el-table-column>
          <el-table-column
              prop="type"
              label="品牌型号"
              width="100">
          </el-table-column>
          <el-table-column
              prop="configuration"
              label="配置或技术参数"
              width="240">
          </el-table-column>
          <el-table-column
              prop="quantity"
              label="单位"
              width="80">
          </el-table-column>
          <el-table-column
              prop="quantity"
              label="数量"
              width="80">
          </el-table-column>
          <el-table-column
              prop="budgetUnitPrice"
              label="预算单价(元)"
              width="80">
          </el-table-column>
          <el-table-column
              prop="budgetTotalPrice"
              label="预算总价(元)"
              width="100">
          </el-table-column>
          <el-table-column
              prop="reason"
              label="申请原因(请详细列明申购理由，并阐述采购必要性，要求不少于100字，如有旧设备，请列明)"
              width="240">
          </el-table-column>
          <el-table-column
              prop="newUser"
              label="新设备使用人"
              width="120">
          </el-table-column>
          <el-table-column
              fixed="right"
              label="操作"
              width="150">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form :inline="true" style="float: right" class="form">
          <el-form-item>
            <el-button  @click="addItem('newForm')">添加物资条款</el-button>
          </el-form-item>

          <el-form-item>
            <el-button @click="saveOrder" type="primary" plain style="float: right">保存</el-button>
          </el-form-item>
<!--          <el-form-item>-->
<!--            <el-button type="primary" @click="addItem" style="float: right">提交</el-button>-->
<!--          </el-form-item>-->
        </el-form>

        <el-dialog title="编辑" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="物资名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="品牌型号" :label-width="formLabelWidth">
              <el-input v-model="form.type" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="配置或技术参数" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="5" v-model="form.configuration" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="unit" label="单位" :label-width="formLabelWidth">
              <el-input v-model="form.unit" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="数量" :label-width="formLabelWidth">
              <el-input type="number" v-model="form.quantity" placeholder="请输入数字"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="预算单价(元)" :label-width="formLabelWidth">
              <el-input type="number" v-model="form.budgetUnitPrice" placeholder="请输入数字"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="预算总价" :label-width="formLabelWidth">
              <el-input type="number" v-model="form.budgetTotalPrice" placeholder="请输入数字"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="原因" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="5" v-model="form.reason" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新设备使用人" :label-width="formLabelWidth">
              <el-input v-model="form.newUser" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editConfirm">确 定</el-button>
          </div>
        </el-dialog>

        <el-dialog title="添加资产" :visible.sync="newDialogVisible">
          <el-form ref="newForm" :model="newForm">
            <el-form-item prop="name" label="物资名称" :label-width="formLabelWidth">
              <el-input v-model="newForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="type" label="品牌型号" :label-width="formLabelWidth">
              <el-input v-model="newForm.type" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="configuration" label="配置或技术参数" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="5" v-model="newForm.configuration" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="unit" label="单位" :label-width="formLabelWidth">
              <el-input v-model="newForm.unit" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="quantity" label="数量" :label-width="formLabelWidth">
              <el-input-number controls-position="right" type="number" v-model="newForm.quantity" placeholder="请输入数字"  autocomplete="off"></el-input-number>
            </el-form-item>
            <el-form-item prop="budgetUnitPrice" label="预算单价(元)" :label-width="formLabelWidth">
              <el-input-number controls-position="right" type="number" v-model="newForm.budgetUnitPrice" placeholder="请输入数字" autocomplete="off"></el-input-number>
            </el-form-item>
            <el-form-item prop="budgetTotalPrice" label="预算总价" :label-width="formLabelWidth">
              <el-input type="number" v-model="newForm.budgetTotalPrice" placeholder="请输入数字" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="reason" label="原因" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="5" v-model="newForm.reason" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="newUser" label="新设备使用人" :label-width="formLabelWidth">
              <el-input v-model="newForm.newUser" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="newDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addNewItem">确 定</el-button>
          </div>
        </el-dialog>

    </div>
  </div>
</template>

<script>
import navbar from "@/components/navbar";
export default {
  name: "addOrder",
  components:{
    navbar
  },
  created() {
    this.getDepartments()
  },
  data() {
    return {
      value:'',
      departmentOptions:[
        {id:'1',
        deptName:'测试1'},
        {
          id: '2',
          deptName: '测试二'
        }
      ],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      orderApply:{
        applyDepartment:'',
        applyUser:'',
        fundCode:'',
        total:0,
        orderLists:[]
      },
      form:{
        no:'',
        name:'',
        type:'',
        configuration:'',
        unit: '',
        quantity:'',
        budgetUnitPrice:'',
        budgetTotalPrice:'',
        reason:'',
        newUser:'',
        old:''
      },
      newDialogVisible:false,

      newForm:{
        no:'',
        name:'',
        type:'',
        configuration:'',
        quantity:'',
        unit:'',
        budgetUnitPrice:'',
        budgetTotalPrice:'',
        reason:'',
        newUser:'',
        old:''
      },
      tableData: [
        {
          id:1,
          name: '王小虎',
          type: '上海',
          configuration: '普陀区',
          unit: '上海市',
          quantity: 30,
          budgetUnitPrice:100,
          budgetTotalPrice:3000,
          reason:'旧设备毁坏',
          newUser:'小王',
          old:'毁坏'
        },{
          id:1,
          name: '王小虎',
          type: '上海',
          configuration: '普陀区',
          unit: '上海市',
          quantity: 30,
          budgetUnitPrice:100,
          budgetTotalPrice:3000,
          reason:'旧设备毁坏',
          newUser:'小王',
          old:'毁坏'
        },{
          id:1,
          name: '王小虎',
          type: '上海',
          configuration: '普陀区',
          unit: '上海市',
          quantity: 30,
          budgetUnitPrice:100,
          budgetTotalPrice:3000,
          reason:'旧设备毁坏',
          newUser:'小王',
          old:'毁坏'
        },{
          id:1,
          name: '王小虎',
          type: '上海',
          configuration: '普陀区',
          unit: '上海市',
          quantity: 30,
          budgetUnitPrice:100,
          budgetTotalPrice:3000,
          reason:'旧设备毁坏',
          newUser:'小王',
          old:'毁坏'
        },{
          id:1,
          name: '王小虎',
          type: '上海',
          configuration: '普陀区',
          unit: '上海市',
          quantity: 30,
          budgetUnitPrice:100,
          budgetTotalPrice:3000,
          reason:'旧设备毁坏',
          newUser:'小王',
          old:'毁坏'
        },{
          id:1,
          name: '王小虎',
          type: '上海',
          configuration: '普陀区',
          unit: '上海市',
          quantity: 30,
          budgetUnitPrice:100,
          budgetTotalPrice:3000,
          reason:'旧设备毁坏',
          newUser:'小王',
          old:'毁坏'
        },{
          id:1,
          name: '王小虎',
          type: '上海',
          configuration: '普陀区',
          unit: '上海市',
          quantity: 30,
          budgetUnitPrice:100,
          budgetTotalPrice:3000,
          reason:'旧设备毁坏',
          newUser:'小王',
          old:'毁坏'
        },{
          id:1,
          name: '王小虎',
          type: '上海',
          configuration: '普陀区',
          unit: '上海市',
          quantity: 30,
          budgetUnitPrice:100,
          budgetTotalPrice:3000,
          reason:'旧设备毁坏',
          newUser:'小王',
          old:'毁坏'
        }]
    }
  },
  methods: {
    getDepartments(){
      this.$getAxios(true).get('/department/departments')
          .then((res)=>{
            this.departmentOptions = res.data.data
          })

    },
    addNewItem() {
      let tmp = {}
      for(let key in this.newForm){
        tmp[key] = this.newForm[key]
      }
      this.orderApply.total = this.orderApply.total + parseFloat(this.newForm.budgetTotalPrice)
      this.orderApply.orderLists.push(tmp)
      this.newDialogVisible = false
    },
    async saveOrder(){
      await console.log('addorder',this.orderApply)
      this.$getAxios(true).post('/order',this.orderApply
      ).then((res)=>{
        console.log(res.data.data)
        if (res.data.success){
          this.$message({
            type:'success',
            message:'添加成功'
          })
        }
      })
    },
    addItem(formName){
      this.newDialogVisible = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    handleEdit(index,row){
      this.dialogFormVisible = true;
      this.form = row;
    },
    editConfirm(){
      this.dialogFormVisible = false
    },
    handleDelete(index) {
      this.tableData.splice(index,1);
      console.log('delete',index)
    }
  },


}
</script>

<style>
.form{
  margin-top: 10px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

input[type="number"] {
  -moz-appearance: textfield;}

</style>
<template>
<div>
  <navbar></navbar>
  <el-form :inline="true" class="demo-form-inline" :model="orderApply">
    <el-form-item label="编号">
      <el-input style="width: 8vw" aria-placeholder="编号" v-model="orderApply.id"></el-input>
    </el-form-item>
    <el-form-item label="申请部门">
      <el-input style="width: 10vw;" placeholder="申请部门" v-model="orderApply.applyDepartment"></el-input>
    </el-form-item>
    <el-form-item label="申请人">
      <el-input style="width: 10vw" placeholder="申请人" v-model="orderApply.applyUser"></el-input>
    </el-form-item>
    <el-form-item label="采购经费代码">
      <el-input style="width: 10vw" placeholder="采购经费代码" v-model="orderApply.fundCode"></el-input>
    </el-form-item>
    <el-form-item label="申请日期">
      <el-date-picker
          style="width: 10vw"
          type="date"
          placeholder="选择日期" v-model="orderApply.applyDate">
      </el-date-picker>
      <el-form-item label="采购总金额">
        <el-input type="number" style="width: 10vw" placeholder="采购总金额" v-model="orderApply.total"></el-input>
      </el-form-item>
    </el-form-item>
  </el-form>
    <el-table
        :data="tableData">
      <el-table-column
          type="index"
          width="50"
      label="序号">
      </el-table-column>
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
      <el-button  @click="addItem">添加物资条款</el-button>
    </el-form-item>

    <el-form-item>
      <el-button type="success" plain style="float: right">打印</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" plain style="float: right">保存</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addItem" style="float: right">提交</el-button>
    </el-form-item>
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
    <el-form :model="newForm">
      <el-form-item label="物资名称" :label-width="formLabelWidth">
        <el-input v-model="newForm.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="品牌型号" :label-width="formLabelWidth">
        <el-input v-model="newForm.type" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="配置或技术参数" :label-width="formLabelWidth">
        <el-input type="textarea" :rows="5" v-model="newForm.configuration" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="数量" :label-width="formLabelWidth">
        <el-input type="number" v-model="newForm.quantity" placeholder="请输入数字"  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="预算单价(元)" :label-width="formLabelWidth">
        <el-input type="number" v-model="newForm.budgetUnitPrice" placeholder="请输入数字" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="预算总价" :label-width="formLabelWidth">
        <el-input type="number" v-model="newForm.budgetTotalPrice" placeholder="请输入数字" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="原因" :label-width="formLabelWidth">
        <el-input type="textarea" :rows="5" v-model="newForm.reason" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新设备使用人" :label-width="formLabelWidth">
        <el-input v-model="newForm.newUser" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="newDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="newDialogVisible = false">确 定</el-button>
    </div>
  </el-dialog>
  
</div>
</template>

<script>
import navbar from "@/components/navbar";
export default {
  name: "buyInForm",
  components:{
    navbar
  },
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '120px',
      orderApply:{
        id:'',
        applyDepartment:'',
        applyUser:'',
        fundCode:'',
        applyDate:'',
        total:'',
        orderLists:[]
      },
      form:{
        no:'',
        name:'',
        type:'',
        configuration:'',
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
        }]
    }
  },
  methods: {
    addItem(){
      this.newDialogVisible = true;
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
<template>
  <div>
    <navbar></navbar>
    <div style="padding-top: 65px;margin-left: 1rem">
        <el-form ref="orderApply" :rules="orderRules" :inline="true" class="demo-form-inline" :model="orderApply">
          <el-form-item prop="applyDepartment" label="申请部门">
            <el-select v-model="orderApply.applyDepartment" placeholder="请选择">
              <el-option
                  v-for="item in departmentOptions"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.deptName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="applyUser" label="申请人">
            <el-autocomplete
                popper-class="my-autocomplete"
                v-model="orderApply.applyUser"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入申请人"
                @select="handleSelect"
            >
<!--              <template slot-scope="{ item }">-->
<!--                <div class="name">{{ item.value }}</div>-->
<!--                <span class="department">{{ item.department }}</span>-->
<!--              </template>-->
            </el-autocomplete>
<!--            <el-input style="width: 10vw" placeholder="申请人" v-model="orderApply.applyUser"></el-input>-->
          </el-form-item>
          <el-form-item prop="fundCode" label="采购经费代码">
            <el-input style="width: 10vw" placeholder="采购经费代码" v-model="orderApply.fundCode"></el-input>
          </el-form-item>
          <el-form-item label="采购总金额：">
            {{this.orderApply.total}}
          </el-form-item>
        </el-form>
    </div>
    <div style="display: table;margin:0 auto">
      <el-table
          max-height="530px"
          border
          :data="orderApply.orderLists"
      >
        <el-table-column
            v-for="(item,index) in tableList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
        >
        </el-table-column>
        <el-table-column
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
    </div>
    <div >
      <div style="float: right;margin: 1rem">
        <el-button  @click="addItem('newForm')">添加物资条款</el-button>
        <el-button @click="saveOrder" type="primary" >提交</el-button>
      </div>
    </div>
    <el-dialog title="编辑" width="550px" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="form" ref="form" :rules="newFormRules">
        <el-form-item prop="name" label="物资名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="type" label="品牌型号" :label-width="formLabelWidth">
          <el-input v-model="form.type" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="configuration" label="配置或技术参数" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="5" v-model="form.configuration" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="unit" label="单位" :label-width="formLabelWidth">
          <el-select v-model="form.unit" placeholder="请选择">
            <el-option
                v-for="item in unitOptions"
                :key="item.id"
                :label="item.value"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="quantity" label="数量" :label-width="formLabelWidth">
          <el-input-number controls-position="right" v-model="formQuantity" placeholder="请输入数字"  autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item prop="budgetUnitPrice" label="预算单价(元)" :label-width="formLabelWidth">
          <el-input-number controls-position="right" v-model="formUnitPrice" placeholder="请输入数字"  autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="预算总价" :label-width="formLabelWidth">
          {{ formTotal }}
        </el-form-item>
        <el-form-item prop="reason" label="原因(请详细列明申购理由，并阐述采购必要性，要求不少于100字，如有旧设备，请列明)" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="6" v-model="form.reason" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="newUser" label="新设备使用人" :label-width="formLabelWidth">
          <el-autocomplete
              v-model="form.newUser"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入新设备使用人"
              @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加资产" width="550px" :visible.sync="newDialogVisible" :close-on-click-modal="false">
      <el-form ref="newForm" :rules="newFormRules" :model="newForm">
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
          <el-select v-model="newForm.unit" placeholder="请选择">
            <el-option
                v-for="item in unitOptions"
                :key="item.id"
                :label="item.value"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="quantity" label="数量" :label-width="formLabelWidth">
          <el-input-number controls-position="right" type="number" v-model="newFormQuantity" placeholder="请输入数字"  autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item prop="budgetUnitPrice" label="预算单价(元)" :label-width="formLabelWidth">
          <el-input-number controls-position="right" type="number" v-model="newFormUnitPrice" placeholder="请输入数字" autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item prop="budgetTotalPrice" label="预算总价" :label-width="formLabelWidth">
          {{itemTotal}}
        </el-form-item>
        <el-form-item prop="reason" label="原因(请详细列明申购理由，并阐述采购必要性，要求不少于100字，如有旧设备，请列明)" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="6" v-model="newForm.reason" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="newUser" label="新设备使用人" :label-width="formLabelWidth">
          <el-autocomplete
              v-model="newForm.newUser"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入新设备使用人"
              @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewItem">确 定</el-button>
      </div>
    </el-dialog>
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
    this.init()
  },
  computed:{
    formTotal:{
      get(){
        if (this.formQuantity && this.formUnitPrice) {
          return parseFloat(this.formQuantity)*parseFloat(this.formUnitPrice)
        } else {
          return 0
        }
      },
      set(){}
    },
    itemTotal:{
      get(){
        if(this.newFormUnitPrice&&this.newFormQuantity){
          return parseFloat(this.newFormQuantity)*parseFloat(this.newFormUnitPrice)
        }else{
          return 0
        }
      },
      set(val){ this.newForm.budgetTotalPrice = val}
    }
  },
  watch:{
    itemTotal(){
      this.newForm.budgetTotalPrice = this.itemTotal
    },
    newFormQuantity(){
      this.newForm.quantity = this.newFormQuantity
    },
    newFormUnitPrice(){
      console.log('this is newFormPrice', this.newFormUnitPrice)
      this.newForm.budgetUnitPrice = this.newFormUnitPrice
    },
    formQuantity(){
      this.form.quantity = this.formQuantity
    },
    formUnitPrice(){
      this.form.budgetUnitPrice = this.formUnitPrice
    },
    formTotal(){
      this.orderApply.total = this.orderApply.total-this.form.budgetTotalPrice + this.formTotal
      this.form.budgetTotalPrice = this.formTotal
    }

  },
  data() {
    let validateEmpty = (rule, value, callback) => {
      if(value===''){
        callback(new Error('该字段不能为空'))
      } else {
        callback()
      }
    }
    let validateZero = (rule, value, callback) => {
      if(value===0){
        callback(new Error('该字段不能为0'))
      } else {
        callback()
      }
    }
    return {
      unitOptions:[
          {
            id:0,
            value:'个'
          }, {
            id:1,
            value:'台'
          }, {
            id:2,
            value:'箱'
          },{
            id:3,
            value:'套'
          }

      ],
      tableList:[
        {prop:'name',label:'物资名称',width:'100'},
        {prop:'type',label:'品牌型号',width:'100'},
        {prop:'configuration',label:'配置或技术参数',width:'240'},
        {prop:'unit',label:'单位',width:'50'},
        {prop:'quantity',label:'数量',width:'50'},
        {prop:'budgetUnitPrice',label: '预算单价',width: '80'},
        {prop:'budgetTotalPrice',label: '预算总价',width: '80'},
        {prop:'reason',label: '申请原因(请详细列明申购理由，并阐述采购必要性，要求不少于100字，如有旧设备，请列明)',width: '240'},
        {prop: 'newUser',label: '新设备使用人',width: '100'}
      ],
      formQuantity:0,
      formUnitPrice:0,
      newFormQuantity:0,
      newFormUnitPrice:0,
      departmentOptions:[
        {id:'1',
        deptName:'测试1'}
      ],
      dialogFormVisible: false,
      formLabelWidth: '170px',
      orderApply:{
        applyDepartment:this.$store.state.deptName,
        applyUser:this.$store.state.loginName,
        fundCode:'',
        total:0,
        orderLists:[],
        uid:''
      },
      form:{
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
      editIndex:'',//编辑条目的索引
      newDialogVisible:false,
      newForm:{
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
      newFormRules:{
        name:[{validator:validateEmpty, trigger:'blur'}],
        type:[{validator:validateEmpty, trigger:'blur'}],
        configuration:[{validator:validateEmpty, trigger:'blur'}],
        unit:[{validator:validateEmpty, trigger:'blur'}],
        quantity:[{validator:validateZero, trigger:'blur'}],
        budgetUnitPrice:[{validator:validateZero, trigger:'blur'}],
        reason:[{validator:validateEmpty, trigger:'blur'}],
        newUser:[{validator:validateEmpty, trigger:'blur'}]
      },
      orderRules:{
        applyDepartment: [{validator:validateEmpty, trigger:'blur'}],
        applyUser: [{validator:validateEmpty, trigger:'blur'}],
        fundCode: [{validator:validateEmpty, trigger:'blur'}]
      }
    }
  },
  methods: {
    querySearchAsync(queryString,cb){
      this.$axios.get('/user/search',{
        params:{
          name:queryString
        }
      }).then(res=>{
        console.log('this is res ',res)
        let newUsers =[]
        for(let i = 0; i<res.data.data.length;i++){
          let tmp = {}
          tmp.value = res.data.data[i].username
          tmp.department = res.data.data[i].department
          newUsers.push(tmp)
        }
        cb(newUsers)
      })
    },
    handleSelect(item){
      console.log('this is handleS item',item)
    },
    init(){
      this.$axios.get('/department/departments')
          .then((res)=>{
            this.departmentOptions = res.data.data
          })
      this.orderApply.uid = this.$store.state.userName
    },
    addNewItem() {
      this.$refs['newForm'].validate((valid)=>{
        if(valid){
          let tmp = {}
          tmp = JSON.parse(JSON.stringify(this.newForm))
          this.orderApply.orderLists.push(tmp)
          this.orderApply.total = this.orderApply.total + parseFloat(this.newForm.budgetTotalPrice)
          if (this.newForm.budgetUnitPrice>=300000){
            this.$confirm('单价超过30万，即将下载可行性文件', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.downloadFile()
              this.newDialogVisible = false
            }).catch(()=>{ this.newDialogVisible = false });
          }else {
            this.newDialogVisible = false
          }
        }
      })
    },
    downloadFile(){
      this.$axios
          .get("/order/download", {
            params: {
              id: this.orderApply.id,
            },
            responseType: "blob",   //文件下载的 url 需要带上这个参数
            headers: {
              Authorization: this.$store.state.token,
            },
          })
          .then((res) => {
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
    saveOrder(){
      this.$refs['orderApply'].validate((valid)=>{
        if(valid){
          this.$axios.post('/order',this.orderApply
          ).then((res)=>{
            if (res.data.success){
              this.$message({
                type:'success',
                message:'添加成功'
              })
              this.$router.push({path:'/listOrder'})
            }
          })
        }
      })
    },
    addItem(formName){
      if(this.orderApply.orderLists.length>=6){
        this.$message({
          type:'warning',
          message:'申请单条款数已达上限'
        })
      } else {
        this.newDialogVisible = true;
        this.$nextTick(() => {
          this.$refs[formName].resetFields()
          this.newFormQuantity = ''
          this.newFormUnitPrice = ''
          this.itemTotal = 0
        })
      }
    },
    handleEdit(index,row){
      this.dialogFormVisible = true;
      this.editIndex = index
      this.form = JSON.parse(JSON.stringify(row))
      this.formTotal = this.form.budgetTotalPrice
      this.formQuantity = this.form.quantity
      this.formUnitPrice = this.form.budgetUnitPrice
    },
    editConfirm(){
      this.$refs['form'].validate((valid)=>{
        if(valid){
          this.$set(this.orderApply.orderLists,this.editIndex, this.form)
          if (this.formUnitPrice>=300000){
            this.$confirm('单价超过30万，即将下载可行性文件', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.downloadFile()
              this.dialogFormVisible = false
            }).catch(()=>{
              this.dialogFormVisible = false
            });
          } else {
            this.dialogFormVisible = false
          }
        }
      })
    },
    handleDelete(index, row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.orderApply.total = this.orderApply.total-row.budgetTotalPrice
        this.orderApply.orderLists.splice(index,1)
        this.$message.success('删除成功')
      }).catch();
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
}

.highlighted .addr {
  color: #ddd;
}
}
}
</style>
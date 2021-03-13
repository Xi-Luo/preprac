<template>
  <div>
    <navbar></navbar>

    <div style="padding-top: 65px">
    <el-form :inline="true" class="demo-form-inline" :model="orderApply">
      <el-form-item label="编号:">{{orderApply.id}}
      </el-form-item>
      <el-form-item label="采购经费代码:">
        {{orderApply.fundCode}}
      </el-form-item>
      <el-form-item label="申请日期：">
        {{orderApply.applyDate}}
      </el-form-item>
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
        <el-form-item label="采购总金额">
          {{orderApply.total}}
        </el-form-item>
      <el-form-item label="状态:">
        {{orderApply.status0}}
      </el-form-item>
    </el-form>
    <el-table
        :data="orderApply.orderLists">
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
          prop="unit"
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
      <div style="width: 300px;margin:1rem">
        <el-upload
            class="upload-demo"
            action="http://localhost:8080/order/file"
            :headers="{ Authorization: this.$store.state.token }"
            :data="{ id: this.orderApply.id }"
            :before-upload="beforeUpload"
        >
          <el-button size="small" type="primary">点击上传申请单图片</el-button>
          <div class="el-upload__tip" slot="tip">
            只能上传 jpg/png 图片，且大小不能超过5MB
          </div>
        </el-upload>
      </div>
    <el-form :inline="true" style="float: right" class="form">
      <el-form-item>
        <el-button v-if="orderApply.hasFile" @click="downloadPhoto">下载签名文件</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  @click="addItem('newForm')">添加物资条款</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" plain style="float: right" @click="print">打印</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save" style="float: right" :disabled="saveDisabled">提交</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="editClose">
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
          <el-input-number controls-position="right" v-model="formQuantity" placeholder="请输入数字"  autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="预算单价(元)" :label-width="formLabelWidth">
          <el-input-number controls-position="right" v-model="formUnitPrice" placeholder="请输入数字"  autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item label="预算总价" :label-width="formLabelWidth">
          {{ formTotal }}
<!--          <el-input type="number" v-model="form.budgetTotalPrice" placeholder="请输入数字"  autocomplete="off"></el-input>-->
        </el-form-item>
        <el-form-item label="原因(请详细列明申购理由，并阐述采购必要性，要求不少于100字，如有旧设备，请列明)" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="5" v-model="form.reason" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新设备使用人" :label-width="formLabelWidth">
          <el-input v-model="form.newUser" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="dialogFormVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="editConfirm">确 定</el-button>-->
<!--      </div>-->
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
          <el-input-number controls-position="right" type="number" v-model="newFormQuantity" placeholder="请输入数字"  autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item prop="budgetUnitPrice" label="预算单价(元)" :label-width="formLabelWidth">
          <el-input-number controls-position="right" type="number" v-model="newFormUnitPrice" placeholder="请输入数字" autocomplete="off"></el-input-number>
        </el-form-item>
        <el-form-item prop="budgetTotalPrice" label="预算总价" :label-width="formLabelWidth">
          {{itemTotal}}
<!--          <el-input type="number" v-model="newForm.budgetTotalPrice" placeholder="请输入数字" autocomplete="off"></el-input>-->
        </el-form-item>
        <el-form-item prop="reason" label="原因(请详细列明申购理由，并阐述采购必要性，要求不少于100字，如有旧设备，请列明)" :label-width="formLabelWidth">
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
  name: "orderDetail",
  components:{
    navbar
  },
  created() {

    this.initData()
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
          return 0;
        }
      },
      set() {}
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
      this.newForm.budgetUnitPrice = this.newFormUnitPrice
    },
    formQuantity(){
      this.form.quantity = this.formQuantity
    },
    formUnitPrice(){
      this.form.budgetUnitPrice = this.formUnitPrice
      if (this.formUnitPrice>=300000) {
        this.editConfirm()
      }
    },
    formTotal(){
      this.orderApply.total = this.orderApply.total-this.form.budgetTotalPrice + this.formTotal
      this.form.budgetTotalPrice = this.formTotal
    }
  },
  data() {
    return {
      saveDisabled:false,
      formQuantity:0,
      formUnitPrice:0,
      departmentOptions:[
        {id:'1',
          deptName:'测试1'}
      ],
      fileList: [],
      newFormQuantity:'',
      newFormUnitPrice:'',
      dialogFormVisible: false,
      formLabelWidth: '170px',
      orderApply:{
        id:'',
        applyDepartment:'',
        applyUser:'',
        fundCode:'',
        applyDate:'',
        total:'',
        orderLists:[],
        uid:'',
        status: 0
      },
      form:{
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
      }
    }
  },

  methods: {
    downloadPhoto(){
      this.$axios
          .get("/order/file/download", {
            params: {
              id: this.orderApply.id,
            },
            responseType: "blob",   //文件下载的 url 需要带上这个参数
            headers: {
              Authorization: this.$store.state.token,
            },
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
    editClose(){
      if (this.formUnitPrice>=300000) {
        this.editConfirm()
      }
    },
    initData () {
      // 获取部门列表
      this.$getAxios(true).get('/department/departments')
          .then((res)=>{
            this.departmentOptions = res.data.data
          }).catch(err=>{console.log(err)})
      this.orderApply.uid = this.$store.state.userName


      this.$getAxios(true).get('/order',{
        params:{
          id:this.$route.query.id
        }
      }).then(
          (res)=>{
            if(res.data.success){
              this.orderApply = res.data.data
              if(this.orderApply.status===0) {
                this.orderApply.status0 = '已保存'
              } else if (this.orderApply.status ===1) {
                this.orderApply.status0 = '已提交'
                this.saveDisabled = true
              }
              console.log('this is orderdetail orderapply',this.orderApply)
            }
          }
      ).catch((error)=>{console.log(error)})

    },
    addNewItem () {
      let tmp = {}
      for(let key in this.newForm){
        tmp[key] = this.newForm[key]
      }

      if (this.newForm.budgetUnitPrice>=300000){
        this.$confirm('单价超过30万，即将下载可行性文件', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.downloadFile()
          this.orderApply.orderLists.push(tmp)
          this.orderApply.total = this.orderApply.total + parseFloat(this.newForm.budgetTotalPrice)
          console.log('here is then')
          this.newDialogVisible = false
        }).catch(()=>{console.log('catch')});
      } else {
        this.orderApply.orderLists.push(tmp)
        this.orderApply.total = this.orderApply.total + parseFloat(this.newForm.budgetTotalPrice)
        console.log('here is else')
        this.newDialogVisible = false
      }
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
    save () {
      this.orderApply.status=1
      this.$getAxios(true).put('/order',this.orderApply).then(res=>{
        console.log('res',res.data)
        if (res.data.success) {
          this.$message({
            type: 'success',
            message: '提交成功'
          })
          this.$router.push({path:'/listOrder'})
        }else{
          this.$message.error('提交失败')
        }
      })
    },
    print(){
      //下载 Excel 文件
      this.$axios
          .get("/order/file", {
            params: {
              id: this.orderApply.id,
            },
            responseType: "blob",   //文件下载的 url 需要带上这个参数
            headers: {
              Authorization: this.$store.state.token,
            },
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
        })
      }
    },
    handleEdit(index,row){
      this.dialogFormVisible = true;
      this.form = row;
      this.formTotal = this.form.budgetTotalPrice
      this.formQuantity = this.form.quantity
      this.formUnitPrice = this.form.budgetUnitPrice
    },
    editConfirm(){
      if (this.formUnitPrice>=300000){
        this.$confirm('单价超过30万，即将下载可行性文件', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.downloadFile()
          this.dialogFormVisible = false
        }).catch((err)=>{console.log(err)});
      } else {
        this.dialogFormVisible = false
      }

    },
    handleDelete(index) {
      console.log('delete',index)
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.orderApply.total = this.orderApply.total-this.orderApply.orderLists[index].budgetTotalPrice
        this.orderApply.orderLists.splice(index,1)
        this.$message.success('删除成功')
      }).catch();


    },
    beforeUpload (file) {
      const isJpgOrPng = (file.type === 'image/jpeg')||(file.type==='image/png')
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isJpgOrPng) {
        this.$message.error('上传文件只能是jpg或png格式！')
      }
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过5MB')
      }
      return isLt5M && isJpgOrPng
    }
  }
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
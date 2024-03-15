<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="生产编号" prop="serialNumber">
        <el-input v-model="formData.serialNumber" placeholder="请输入生产编号" />
      </el-form-item>
      <el-row>
        <el-col :span="12" :align="left">
          <el-form-item label="生产产品" prop="productId">
            <el-select
              v-model="formData.productId"
              clearable
              filterable
              @change="onChangeProduct($event, row)"
              placeholder="请选择产品"
              class="!w-240px"
            >
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :align="left">
          <el-form-item>
            <el-input disabled v-model="formData.productUnitName" placeholder="单位" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="客户编号" prop="customerId">
        <el-input v-model="formData.customerId" placeholder="请输入客户编号" />
      </el-form-item>
      <el-form-item label="生产状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            disabled
            v-for="dict in getIntDictOptions(DICT_TYPE.ERP_PRODUCTION_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生产主管" prop="productionSupervisorId">
        <el-input v-model="formData.productionSupervisorId" placeholder="请输入生产主管" />
      </el-form-item>
      <el-form-item label="调试主管" prop="commissioningSupervisorId">
        <el-input v-model="formData.commissioningSupervisorId" placeholder="请输入调试主管" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ProductionApi, ProductionVO } from '@/api/erp/production'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { ProductApi, ProductVO } from '@/api/erp/product/product'

/** ERP 生产 表单 */
defineOptions({ name: 'ProductionForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  serialNumber: undefined,
  productId: undefined,
  productUnitName: '请选择生产产品',
  status: undefined,
  productionSupervisorId: undefined,
  commissioningSupervisorId: undefined,
  productUnitId: undefined
})
const formRules = reactive({
  productId: [{ required: true, message: '产品名称不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const productList = ref<ProductVO[]>([]) // 产品列表
/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await ProductionApi.getProduction(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ProductionVO
    if (formType.value === 'create') {
      await ProductionApi.createProduction(data)
      message.success(t('common.createSuccess'))
    } else {
      await ProductionApi.updateProduction(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    serialNumber: undefined,
    productId: undefined,
    productUnitName: '请选择生产产品',
    customerId: undefined,
    status: 1,
    productionSupervisorId: undefined,
    commissioningSupervisorId: undefined,
    productUnitId: undefined
  }
  formRef.value?.resetFields()
}
const onChangeProduct = (productId, row) => {
  const product = productList.value.find((item) => item.id === productId)
  if (product) {
    formData.value.productUnitName = product.unitName
  }
}

onMounted(async () => {
  productList.value = await ProductApi.getProductSimpleList()
  // 默认添加一个
  if (formData.value.length === 0) {
    handleAdd()
  }
})
</script>

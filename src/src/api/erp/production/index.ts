import request from '@/config/axios'

// ERP 生产 VO
export interface ProductionVO {
  id: number // 产品编号
  serialNumber: string // 生产编号
  productId: number // 产品编号
  customerId: number // 客户编号
  status: number // 生产状态
  productionSupervisorId: number // 生产主管
  commissioningSupervisorId: number // 调试主管
  productUnitId: number // 产品单位单位
}

// ERP 生产 API
export const ProductionApi = {
  // 查询ERP 生产分页
  getProductionPage: async (params: any) => {
    return await request.get({ url: `/erp/production/page`, params })
  },

  // 查询ERP 生产详情
  getProduction: async (id: number) => {
    return await request.get({ url: `/erp/production/get?id=` + id })
  },

  // 新增ERP 生产
  createProduction: async (data: ProductionVO) => {
    return await request.post({ url: `/erp/production/create`, data })
  },

  // 修改ERP 生产
  updateProduction: async (data: ProductionVO) => {
    return await request.put({ url: `/erp/production/update`, data })
  },

  // 删除ERP 生产
  deleteProduction: async (id: number) => {
    return await request.delete({ url: `/erp/production/delete?id=` + id })
  },

  // 导出ERP 生产 Excel
  exportProduction: async (params) => {
    return await request.download({ url: `/erp/production/export-excel`, params })
  }
}

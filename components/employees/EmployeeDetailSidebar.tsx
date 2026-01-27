'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { 
  FileText, 
  Package, 
  DollarSign, 
  Plus, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  RotateCcw
} from 'lucide-react'
import { 
  createContractAction, 
  deleteContractAction,
  assignAssetAction,
  returnAssetAction
} from '@/server/actions/employee-detail-actions'
import { useRouter } from 'next/navigation'

interface Contract {
  id: number
  contract_type: string
  start_date: string
  end_date: string | null
  file_path: string | null
  notes: string | null
}

interface Asset {
  id: number
  name: string
  asset_tag: string
  status: string
  assigned_date?: string
}

interface SalaryHistory {
  id: number
  old_salary: number | null
  new_salary: number
  change_date: string
  reason: string | null
  changed_by?: {
    first_name: string
    last_name: string
  }
}

interface Props {
  employeeId: number
  employeeName: string
  contracts: Contract[]
  assets: Asset[]
  salaryHistory: SalaryHistory[]
  availableAssets: Asset[]
}

const initialState = { error: '', success: false, message: '' }

export default function EmployeeDetailSidebar({
  employeeId,
  employeeName,
  contracts,
  assets,
  salaryHistory,
  availableAssets
}: Props) {
  const router = useRouter()
  const [deletingContractId, setDeletingContractId] = useState<number | null>(null)
  const [returningAssetId, setReturningAssetId] = useState<number | null>(null)
  
  // Contract form
  const createContractWithId = createContractAction.bind(null, employeeId)
  const [contractState, contractFormAction, contractPending] = useActionState(createContractWithId, initialState)
  
  // Asset form
  const assignAssetWithId = assignAssetAction.bind(null, employeeId)
  const [assetState, assetFormAction, assetPending] = useActionState(assignAssetWithId, initialState)
  
  const handleDeleteContract = async (contractId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) return
    setDeletingContractId(contractId)
    await deleteContractAction(contractId, employeeId)
    setDeletingContractId(null)
    router.refresh()
  }
  
  const handleReturnAsset = async (assetId: number) => {
    if (!confirm('Bạn có chắc chắn muốn thu hồi tài sản này?')) return
    setReturningAssetId(assetId)
    await returnAssetAction(assetId, employeeId)
    setReturningAssetId(null)
    router.refresh()
  }
  
  const formatCurrency = (value: number | null) => {
    if (!value) return '---'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  return (
    <div className="space-y-8">
      {/* Row 1: Form thêm hợp đồng + Form cấp phát tài sản */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form thêm hợp đồng mới */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-blue-50/50">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Thêm Hợp đồng Mới
            </h4>
          </div>
          <form action={contractFormAction} className="p-5 space-y-4">
            {contractState?.error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {contractState.error}
              </div>
            )}
            {contractState?.success && (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" /> {contractState.message}
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-700">Loại Hợp đồng <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="contract_type" 
                required
                placeholder="VD: HĐ 1 năm, HĐ thử việc..."
                className="mt-1 w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Ngày bắt đầu <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  name="start_date" 
                  required
                  className="mt-1 w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Ngày kết thúc</label>
                <input 
                  type="date" 
                  name="end_date"
                  className="mt-1 w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Ghi chú</label>
              <textarea 
                name="notes"
                rows={2}
                placeholder="Ghi chú thêm..."
                className="mt-1 w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
            <button 
              type="submit"
              disabled={contractPending}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2 transition-all"
            >
              {contractPending ? 'Đang lưu...' : (<><Plus className="w-4 h-4" /> Lưu Hợp đồng</>)}
            </button>
          </form>
        </div>
        
        {/* Form cấp phát tài sản */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-green-50/50">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Cấp phát Tài sản
            </h4>
          </div>
          <form action={assetFormAction} className="p-5 space-y-4">
            {assetState?.error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {assetState.error}
              </div>
            )}
            {assetState?.success && (
              <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" /> {assetState.message}
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-gray-700">Chọn Tài sản (Sẵn sàng)</label>
              <select 
                name="asset_id" 
                required
                className="mt-1 w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
              >
                <option value="">-- Chọn tài sản --</option>
                {availableAssets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.asset_tag})
                  </option>
                ))}
              </select>
              {availableAssets.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">Không có tài sản sẵn sàng để cấp phát</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Ngày cấp phát</label>
              <input 
                type="date" 
                name="assigned_date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="mt-1 w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <button 
              type="submit"
              disabled={assetPending || availableAssets.length === 0}
              className="w-full py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-70 flex items-center justify-center gap-2 transition-all"
            >
              {assetPending ? 'Đang cấp...' : (<><Package className="w-4 h-4" /> Cấp phát</>)}
            </button>
          </form>
        </div>
      </div>
      
      {/* Row 2: Lịch sử hợp đồng + Tài sản đang giữ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lịch sử hợp đồng */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Lịch sử Hợp đồng của {employeeName}
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs uppercase">Loại HĐ</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs uppercase">Ngày bắt đầu</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs uppercase">Ngày kết thúc</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-600 text-xs uppercase">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      Nhân viên này chưa có hợp đồng nào.
                    </td>
                  </tr>
                ) : contracts.map(contract => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{contract.contract_type}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(contract.start_date).toLocaleDateString('vi-VN')}</td>
                    <td className="px-4 py-3 text-gray-600">{contract.end_date ? new Date(contract.end_date).toLocaleDateString('vi-VN') : '---'}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleDeleteContract(contract.id)}
                        disabled={deletingContractId === contract.id}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Tài sản đang giữ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Tài sản Đang giữ
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs uppercase">Tài sản</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs uppercase">Ngày cấp</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-600 text-xs uppercase">Thu hồi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                      Nhân viên này không giữ tài sản nào.
                    </td>
                  </tr>
                ) : assets.map(asset => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-800">{asset.name}</span>
                      <span className="text-gray-400 ml-1 text-xs">({asset.asset_tag})</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{asset.assigned_date ? new Date(asset.assigned_date).toLocaleDateString('vi-VN') : '---'}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleReturnAsset(asset.id)}
                        disabled={returningAssetId === asset.id}
                        className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg disabled:opacity-50 transition-colors"
                        title="Thu hồi"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Row 3: Lịch sử thay đổi lương - full width */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-yellow-600" />
            Lịch sử Thay đổi Lương
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs uppercase">Ngày thay đổi</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600 text-xs uppercase">Lương cũ</th>
                <th className="px-4 py-3 text-right font-bold text-gray-600 text-xs uppercase">Lương mới</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs uppercase">Người thay đổi</th>
                <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs uppercase">Lý do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {salaryHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Chưa có lịch sử thay đổi lương.
                  </td>
                </tr>
              ) : salaryHistory.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{new Date(record.change_date).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3 text-right text-red-600">{formatCurrency(record.old_salary)}</td>
                  <td className="px-4 py-3 text-right text-green-600 font-medium">{formatCurrency(record.new_salary)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {record.changed_by ? `${record.changed_by.last_name} ${record.changed_by.first_name}` : '---'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{record.reason || '---'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

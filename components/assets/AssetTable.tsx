'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Monitor, Laptop, Mouse, Printer, User, Pencil } from 'lucide-react'
import { saveAssetAction, deleteAssetAction } from '@/server/actions/asset-actions'
import { useActionState } from 'react'

const initialState = { success: false, error: '' }

export default function AssetTable({ assets }: { assets: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingAsset, setEditingAsset] = useState<any>(null)
  const [state, formAction, isPending] = useActionState(saveAssetAction, initialState)

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.asset_tag.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getIcon = (name: string) => {
    const lower = name.toLowerCase()
    if (lower.includes('laptop')) return Laptop
    if (lower.includes('chuột') || lower.includes('mouse')) return Mouse
    if (lower.includes('in') || lower.includes('printer')) return Printer
    return Monitor
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Available': 
      case 'Sẵn sàng':
        return 'bg-green-100 text-green-700'
      case 'Assigned': 
      case 'Đang sử dụng':
      case 'Da cap':
        return 'bg-blue-100 text-blue-700'
      case 'Broken': 
      case 'Hỏng':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'Available': return 'Sẵn sàng'
      case 'Assigned': return 'Đang sử dụng'
      case 'Broken': return 'Hỏng'
      default: return status
    }
  }

  // Đóng form khi thêm/sửa thành công
  useEffect(() => {
    if (state?.success) {
      setShowForm(false)
      setEditingAsset(null)
    }
  }, [state?.success])

  const handleDelete = async (id: number) => {
      if(confirm('Bạn có chắc chắn muốn xóa tài sản này?')) {
          const res = await deleteAssetAction(id)
          if (!res.success) {
            alert(res.error || 'Không thể xóa tài sản')
          }
      }
  }

  const handleEdit = (asset: any) => {
    setEditingAsset(asset)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingAsset(null)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-800">Quản lý Tài sản & Thiết bị</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
             <input 
                type="text" 
                placeholder="Tìm tên hoặc mã..." 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-black text-sm w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
             />
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Thêm thiết bị
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm animate-in slide-in-from-top-2">
            <h4 className="font-bold text-gray-800 mb-4">
              {editingAsset ? 'Cập nhật thiết bị' : 'Thêm thiết bị mới'}
            </h4>
            {state?.error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {state.error}
                </div>
            )}
            <form action={formAction} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {editingAsset && <input type="hidden" name="id" value={editingAsset.id} />}
                
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Tên thiết bị</label>
                    <input 
                      name="name" 
                      defaultValue={editingAsset?.name}
                      required 
                      placeholder="VD: Macbook Pro M1" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Mã tài sản</label>
                    <input 
                      name="asset_tag" 
                      defaultValue={editingAsset?.asset_tag}
                      required 
                      placeholder="AST-001" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Ngày mua</label>
                    <input 
                      type="date" 
                      name="purchase_date" 
                      defaultValue={editingAsset?.purchase_date}
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Giá trị (VNĐ)</label>
                    <input 
                      type="number" 
                      name="purchase_cost" 
                      defaultValue={editingAsset?.purchase_cost}
                      required 
                      placeholder="0" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      {editingAsset ? 'Trạng thái' : 'Trạng thái Ban đầu'}
                    </label>
                    <select 
                      name="status" 
                      defaultValue={editingAsset?.status || "Available"} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="Available">Available (Sẵn sàng)</option>
                        <option value="Assigned">Assigned (Đã cấp)</option>
                        <option value="Broken">Broken (Hỏng)</option>
                    </select>
                </div>
                
                <div className="md:col-span-12 flex justify-end gap-2 mt-4">
                     <button type="button" onClick={() => { setShowForm(false); setEditingAsset(null) }} className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg">Hủy</button>
                     <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-70">
                        {isPending ? 'Đang lưu...' : (editingAsset ? 'Cập nhật' : 'Lưu thiết bị')}
                     </button>
                </div>
            </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Thiết bị</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mã TS</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Ngày mua</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Giá trị</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nhân viên được cấp</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {filteredAssets.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-gray-500">Chưa có thiết bị nào</td></tr>
                ) : filteredAssets.map((asset) => {
                    const Icon = getIcon(asset.name)
                    return (
                    <tr key={asset.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-gray-800 text-sm">{asset.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-600">{asset.asset_tag}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{asset.PurchaseDateFormatted}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{asset.CostFormatted}</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(asset.status)}`}>
                                {getStatusLabel(asset.status)}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                            {asset.employees ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User className="w-3 h-3 text-gray-500" />
                                    </div>
                                    <span className="font-medium text-gray-700">
                                        {asset.employees.last_name} {asset.employees.first_name}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-gray-400 italic">--</span>
                            )}
                        </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button 
                                  onClick={() => handleEdit(asset)}
                                  className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Sửa"
                              >
                                  <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                  onClick={() => handleDelete(asset.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  title="Xóa"
                              >
                                  <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                        </td>
                    </tr>
                )})}
            </tbody>
        </table>
      </div>
    </div>
  )
}

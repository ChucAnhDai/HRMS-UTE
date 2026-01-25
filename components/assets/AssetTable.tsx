'use client'

import React, { useState } from 'react'
import { Plus, Search, Trash2, Monitor, Laptop, Mouse, Printer } from 'lucide-react'
import { createAssetAction, deleteAssetAction } from '@/server/actions/asset-actions' // Import action xóa nếu cần

export default function AssetTable({ assets }: { assets: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)

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
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Thêm thiết bị
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm animate-in slide-in-from-top-2">
            <h4 className="font-bold text-gray-800 mb-4">Thêm thiết bị mới</h4>
            <form action={createAssetAction} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Tên thiết bị</label>
                    <input name="name" required placeholder="VD: Macbook Pro M1" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Mã tài sản</label>
                    <input name="asset_tag" required placeholder="AST-001" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Ngày mua</label>
                    <input type="date" name="purchase_date" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Giá trị (VNĐ)</label>
                    <input type="number" name="purchase_cost" required placeholder="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="hidden">
                    <input name="status" value="Sẵn sàng" readOnly />
                </div>
                <div className="md:col-span-5 flex justify-end gap-2 mt-2">
                     <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg">Hủy</button>
                     <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm">Lưu thiết bị</button>
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
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {filteredAssets.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">Chưa có thiết bị nào</td></tr>
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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                asset.status === 'Sẵn sàng' ? 'bg-green-100 text-green-700' : 
                                asset.status === 'Hỏng' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                                {asset.status}
                            </span>
                        </td>
                         <td className="px-6 py-4 text-right">
                            <button 
                                onClick={() => deleteAssetAction(asset.id)}
                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                )})}
            </tbody>
        </table>
      </div>
    </div>
  )
}

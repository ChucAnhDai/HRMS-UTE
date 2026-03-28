"use client";

import { Monitor, Calendar, DollarSign, XCircle } from "lucide-react";
import { unassignAssetAction } from "@/server/actions/asset-assignment-actions";
import { useState } from "react";
import { Asset } from "@/types";
import { toast } from "@/hooks/use-toast";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface EmployeeAsset extends Asset {
  AssignedDateFormatted?: string;
  CostFormatted?: string;
}

interface EmployeeAssetListProps {
  assets: EmployeeAsset[];
  employeeId: number;
}

export default function EmployeeAssetList({
  assets,
  employeeId,
}: EmployeeAssetListProps) {
  const [loading, setLoading] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [assetToUnassignId, setAssetToUnassignId] = useState<number | null>(null);

  const handleUnassignRequest = (assetId: number) => {
    setAssetToUnassignId(assetId);
    setIsConfirmOpen(true);
  };

  const confirmUnassign = async () => {
    if (assetToUnassignId === null) return;
    const assetId = assetToUnassignId;

    setLoading(assetId);
    const result = await unassignAssetAction(assetId, employeeId);
    setLoading(null);

    if (result.success) {
      toast({
        title: "Thành công",
        description: result.message || "Đã thu hồi tài sản thành công",
      });
    } else {
      toast({
        title: "Lỗi",
        description: result.error || "Không thể thu hồi tài sản",
        variant: "destructive",
      });
    }
    setAssetToUnassignId(null);
  };

  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-12">
        <Monitor className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">
          Nhân viên chưa được cấp phát tài sản nào
        </p>
      </div>
    );
  }

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Monitor className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{asset.name}</h3>
                <p className="text-xs text-gray-500 font-mono">
                  {asset.asset_tag}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleUnassignRequest(asset.id)}
              disabled={loading === asset.id}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              title="Thu hồi tài sản"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Cấp phát: {asset.AssignedDateFormatted}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>Giá trị: {asset.CostFormatted}</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {asset.status}
            </span>
          </div>
        </div>
      ))}
    </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Xác nhận thu hồi tài sản"
        description="Bạn có chắc chắn muốn thu hồi tài sản này từ nhân viên? Thao tác này sẽ cập nhật trạng thái tài sản thành sẵn dùng."
        onConfirm={confirmUnassign}
        variant="danger"
        confirmText="Xác nhận thu hồi"
      />
    </>
  );
}

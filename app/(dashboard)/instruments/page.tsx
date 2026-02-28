import AssetTable from "@/components/assets/AssetTable";
import { assetService } from "@/server/services/asset-service";
import { requireRoleForPage } from "@/lib/auth-helpers";

export const metadata = { title: "Tài sản | HCMUTE" };


export const dynamic = "force-dynamic";

export default async function InstrumentsPage() {
  await requireRoleForPage(["ADMIN", "MANAGER"]);
  const assets = await assetService.getAssets();

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <AssetTable assets={assets || []} />
      </div>
    </div>
  );
}

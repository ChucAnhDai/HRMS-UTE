import { settingRepo } from "@/server/repositories/setting-repo";
import SettingsView from "@/components/settings/SettingsView";
import { requireRoleForPage } from "@/lib/auth-helpers";

export const metadata = {
  title: "Settings - Payroll System",
};

export default async function SettingsPage() {
  const currentUser = await requireRoleForPage(["ADMIN", "MANAGER"]);

  const settings = await settingRepo.getSettings();
  const currentYear = new Date().getFullYear();
  const holidays = await settingRepo.getHolidays(currentYear);

  const isReadOnly = currentUser?.role !== "ADMIN";

  return (
    <SettingsView
      settings={settings}
      holidays={holidays || []}
      readOnly={isReadOnly}
    />
  );
}

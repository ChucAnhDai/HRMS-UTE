import { settingRepo } from "@/server/repositories/setting-repo";
import SettingsView from "@/components/settings/SettingsView";
import { requireRoleForPage } from "@/lib/auth-helpers";
import { calculateWorkingDays, parseWeekendDays } from "@/lib/working-days";

export const metadata = {
  title: "Cài đặt | HCMUTE",
};

export default async function SettingsPage() {
  const currentUser = await requireRoleForPage(["ADMIN", "MANAGER"]);

  const settings = await settingRepo.getSettings();
  const currentYear = new Date().getFullYear();
  const holidays = await settingRepo.getHolidays(currentYear);

  // Tính ngày công chuẩn cho 12 tháng (hiển thị read-only trên UI)
  const weekendDays = parseWeekendDays(settings["weekend_days"]);
  const workingDaysPerMonth: Record<number, number> = {};
  for (let m = 1; m <= 12; m++) {
    workingDaysPerMonth[m] = calculateWorkingDays(
      m,
      currentYear,
      weekendDays,
      holidays || [],
    );
  }

  const isReadOnly = currentUser?.role !== "ADMIN";

  return (
    <SettingsView
      settings={settings}
      holidays={holidays || []}
      readOnly={isReadOnly}
      workingDaysPerMonth={workingDaysPerMonth}
      currentYear={currentYear}
    />
  );
}

import { settingRepo } from '@/server/repositories/setting-repo'
import SettingsView from '@/components/settings/SettingsView'
import { requireRole } from '@/lib/auth-helpers'

export const metadata = {
  title: 'Settings - Payroll System',
}

export default async function SettingsPage() {
  await requireRole(['ADMIN'])

  const settings = await settingRepo.getSettings()
  const currentYear = new Date().getFullYear()
  const holidays = await settingRepo.getHolidays(currentYear)

  return <SettingsView settings={settings} holidays={holidays || []} />
}

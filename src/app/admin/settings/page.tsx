import { getSettings } from "@/lib/actions/settings.actions";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">الإعدادات العامة</h1>
        <p className="mt-1 text-sm text-ink-muted">
          تخصيص اسم المؤسسة والشعار واللون الأساسي المستخدم في الواجهة
        </p>
      </header>

      <SettingsForm settings={settings} />
    </div>
  );
}

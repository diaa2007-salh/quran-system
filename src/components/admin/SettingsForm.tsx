"use client";

import { useActionState } from "react";
import { updateSettings, type ActionState } from "@/lib/actions/settings.actions";
import { SubmitButton } from "@/components/shared/FormButtons";
import { FormInput } from "@/components/shared/FormInput";

type Settings = {
  schoolName: string;
  logoUrl: string | null;
  primaryColor: string;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateSettings, undefined);

  return (
    <form
      action={formAction}
      className="max-w-xl space-y-4 rounded-card border border-border bg-surface-raised p-6"
    >
      <FormInput
        label="اسم المؤسسة / المركز"
        name="schoolName"
        defaultValue={settings.schoolName}
        required
      />

      <FormInput
        label="رابط الشعار (اختياري)"
        name="logoUrl"
        defaultValue={settings.logoUrl ?? ""}
        dir="ltr"
        placeholder="https://example.com/logo.png"
      />

      <div>
        <label htmlFor="primaryColor" className="mb-1.5 block text-sm font-medium text-ink">
          اللون الأساسي للواجهة
        </label>
        <div className="flex items-center gap-3">
          <input
            id="primaryColor"
            name="primaryColor"
            type="color"
            defaultValue={settings.primaryColor}
            className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-surface p-1"
          />
          <span className="text-sm text-ink-muted" dir="ltr">
            {settings.primaryColor}
          </span>
        </div>
        <p className="mt-1.5 text-xs text-ink-muted">
          هذه القيمة تُحفظ في قاعدة البيانات وتُتيح لاحقاً تخصيص هوية الواجهة
          دون تعديل الكود.
        </p>
      </div>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          تم حفظ الإعدادات بنجاح.
        </p>
      )}

      <div className="flex items-center justify-end pt-2">
        <SubmitButton>حفظ الإعدادات</SubmitButton>
      </div>
    </form>
  );
}

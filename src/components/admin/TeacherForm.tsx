"use client";

import { useActionState, useEffect } from "react";
import {
  createTeacher,
  updateTeacher,
  type ActionState,
} from "@/lib/actions/teachers.actions";
import { SubmitButton } from "@/components/shared/FormButtons";
import { FormInput } from "@/components/shared/FormInput";

type Teacher = { id: string; name: string; email: string };

export function TeacherForm({
  teacher,
  onSuccess,
}: {
  teacher?: Teacher;
  onSuccess?: () => void;
}) {
  const action = teacher ? updateTeacher.bind(null, teacher.id) : createTeacher;
  const [state, formAction] = useActionState<ActionState, FormData>(action, undefined);

  // بعد نجاح الحفظ (بدون أي إعادة توجيه) نُخبر الأب لإغلاق النافذة المنبثقة
  useEffect(() => {
    if (state?.success) onSuccess?.();
  }, [state?.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput label="الاسم الكامل" name="name" defaultValue={teacher?.name} required />
        <FormInput
          label="البريد الإلكتروني"
          name="email"
          type="email"
          defaultValue={teacher?.email}
          required
          dir="ltr"
        />
      </div>

      <FormInput
        label={
          teacher
            ? "كلمة المرور الجديدة (اتركها فارغة للاحتفاظ بالحالية)"
            : "كلمة المرور"
        }
        name="password"
        type="password"
        required={!teacher}
        dir="ltr"
      />

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <SubmitButton>{teacher ? "حفظ التعديلات" : "إضافة المعلم"}</SubmitButton>
      </div>
    </form>
  );
}

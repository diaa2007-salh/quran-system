"use client";

import { useActionState, useEffect } from "react";
import { createGroup, updateGroup, type ActionState } from "@/lib/actions/groups.actions";
import { SubmitButton } from "@/components/shared/FormButtons";
import { FormInput } from "@/components/shared/FormInput";

type Group = {
  id: string;
  name: string;
  description: string | null;
  teacherId: string | null;
};
type TeacherOption = { id: string; name: string };

export function GroupForm({
  group,
  teachers,
  onSuccess,
}: {
  group?: Group;
  teachers: TeacherOption[];
  onSuccess?: () => void;
}) {
  const action = group ? updateGroup.bind(null, group.id) : createGroup;
  const [state, formAction] = useActionState<ActionState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.success) onSuccess?.();
  }, [state?.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <FormInput label="اسم الفوج" name="name" defaultValue={group?.name} required placeholder="مثال: فوج الفجر - المستوى الأول" />

      <div>
        <label htmlFor="teacherId" className="mb-1.5 block text-sm font-medium text-ink">
          المعلم المسؤول
        </label>
        <select
          id="teacherId"
          name="teacherId"
          defaultValue={group?.teacherId ?? ""}
          className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-ink focus:border-primary"
        >
          <option value="">بدون معلم (غير مسنَد)</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
          وصف مختصر (اختياري)
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={group?.description ?? ""}
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-ink focus:border-primary"
        />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <SubmitButton>{group ? "حفظ التعديلات" : "إضافة الفوج"}</SubmitButton>
      </div>
    </form>
  );
}

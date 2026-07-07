"use client";

import { useActionState, useEffect } from "react";
import {
  createStudent,
  updateStudent,
  type ActionState,
} from "@/lib/actions/students.actions";
import { SubmitButton } from "@/components/shared/FormButtons";
import { FormInput } from "@/components/shared/FormInput";
import { toDateInputValue } from "@/lib/utils";

type Student = {
  id: string;
  fullName: string;
  guardianPhone: string | null;
  notes: string | null;
  birthDate: Date | null;
  groupId: string | null;
};
type GroupOption = { id: string; name: string };

export function StudentForm({
  student,
  groups,
  onSuccess,
}: {
  student?: Student;
  groups: GroupOption[];
  onSuccess?: () => void;
}) {
  const action = student ? updateStudent.bind(null, student.id) : createStudent;
  const [state, formAction] = useActionState<ActionState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.success) onSuccess?.();
  }, [state?.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput label="الاسم الكامل" name="fullName" defaultValue={student?.fullName} required />

        <div>
          <label htmlFor="groupId" className="mb-1.5 block text-sm font-medium text-ink">
            الفوج
          </label>
          <select
            id="groupId"
            name="groupId"
            defaultValue={student?.groupId ?? ""}
            className="w-full rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-ink focus:border-primary"
          >
            <option value="">غير موزَّع بعد</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          label="هاتف ولي الأمر (اختياري)"
          name="guardianPhone"
          defaultValue={student?.guardianPhone ?? ""}
          dir="ltr"
        />

        <FormInput
          label="تاريخ الميلاد (اختياري)"
          name="birthDate"
          type="date"
          defaultValue={student?.birthDate ? toDateInputValue(student.birthDate) : ""}
        />
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-ink">
          ملاحظات (اختياري)
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={student?.notes ?? ""}
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
        <SubmitButton>{student ? "حفظ التعديلات" : "إضافة التلميذ"}</SubmitButton>
      </div>
    </form>
  );
}


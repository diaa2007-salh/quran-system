"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { CustomModal } from "@/components/shared/CustomModal";
import { TeacherForm } from "@/components/admin/TeacherForm";
import { DeleteButton } from "@/components/shared/FormButtons";
import { deleteTeacher, type TeacherListItem } from "@/lib/actions/teachers.actions";

type ModalState = { mode: "create" } | { mode: "edit"; teacher: TeacherListItem } | null;

export function TeachersManager({ teachers }: { teachers: TeacherListItem[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>(null);

  function closeModal() {
    setModal(null);
    // نحدّث بيانات الصفحة الحالية دون أي تنقّل كامل، لتظهر التعديلات فوراً
    router.refresh();
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">المعلمون</h1>
          <p className="mt-1 text-sm text-ink-muted">
            إنشاء حسابات المعلمين وتعديلها وحذفها
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          إضافة معلم
        </button>
      </header>

      <div className="overflow-hidden rounded-card border border-border bg-surface-raised">
        <table className="w-full text-start text-sm">
          <thead className="bg-surface text-ink-muted">
            <tr>
              <th className="px-5 py-3 text-start font-medium">الاسم</th>
              <th className="px-5 py-3 text-start font-medium">البريد الإلكتروني</th>
              <th className="px-5 py-3 text-start font-medium">عدد الأفواج</th>
              <th className="px-5 py-3 text-end font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="px-5 py-3.5 font-medium text-ink">{teacher.name}</td>
                <td className="px-5 py-3.5 text-ink-muted" dir="ltr">
                  {teacher.email}
                </td>
                <td className="px-5 py-3.5 text-ink-muted">{teacher._count.groups}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="تعديل"
                      onClick={() => setModal({ mode: "edit", teacher })}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-ink-muted hover:bg-primary-light hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <form action={deleteTeacher}>
                      <input type="hidden" name="id" value={teacher.id} />
                      <DeleteButton
                        confirmMessage={`هل تريد حذف المعلم "${teacher.name}"؟ ستصبح أفواجه بلا معلم مسؤول.`}
                      />
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {teachers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-ink-muted">
                  لا يوجد معلمون بعد. اضغط «إضافة معلم» لإنشاء أول حساب.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CustomModal
        isOpen={modal !== null}
        onClose={closeModal}
        title={modal?.mode === "edit" ? "تعديل بيانات المعلم" : "إضافة معلم جديد"}
      >
        {modal && (
          <TeacherForm
            teacher={modal.mode === "edit" ? modal.teacher : undefined}
            onSuccess={closeModal}
          />
        )}
      </CustomModal>
    </div>
  );
}

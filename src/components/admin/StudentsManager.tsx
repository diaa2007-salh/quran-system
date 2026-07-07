"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { CustomModal } from "@/components/shared/CustomModal";
import { StudentForm } from "@/components/admin/StudentForm";
import { DeleteButton } from "@/components/shared/FormButtons";
import { deleteStudent, type StudentListItem } from "@/lib/actions/students.actions";

type GroupOption = { id: string; name: string };
type ModalState = { mode: "create" } | { mode: "edit"; student: StudentListItem } | null;

export function StudentsManager({
  students,
  groups,
}: {
  students: StudentListItem[];
  groups: GroupOption[];
}) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>(null);

  function closeModal() {
    setModal(null);
    router.refresh();
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">التلاميذ</h1>
          <p className="mt-1 text-sm text-ink-muted">إضافة التلاميذ وتوزيعهم على الأفواج</p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          إضافة تلميذ
        </button>
      </header>

      <div className="overflow-hidden rounded-card border border-border bg-surface-raised">
        <table className="w-full text-start text-sm">
          <thead className="bg-surface text-ink-muted">
            <tr>
              <th className="px-5 py-3 text-start font-medium">الاسم</th>
              <th className="px-5 py-3 text-start font-medium">الفوج</th>
              <th className="px-5 py-3 text-start font-medium">هاتف ولي الأمر</th>
              <th className="px-5 py-3 text-end font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-5 py-3.5 font-medium text-ink">{student.fullName}</td>
                <td className="px-5 py-3.5 text-ink-muted">
                  {student.group?.name ?? <span className="text-amber-600">غير موزَّع</span>}
                </td>
                <td className="px-5 py-3.5 text-ink-muted" dir="ltr">
                  {student.guardianPhone ?? "—"}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="تعديل"
                      onClick={() => setModal({ mode: "edit", student })}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-ink-muted hover:bg-primary-light hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <form action={deleteStudent}>
                      <input type="hidden" name="id" value={student.id} />
                      <DeleteButton
                        confirmMessage={`هل تريد حذف التلميذ "${student.fullName}"؟ سيتم حذف كل سجلات حضوره أيضاً.`}
                      />
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-ink-muted">
                  لا يوجد تلاميذ بعد. اضغط «إضافة تلميذ» لإضافة أول تلميذ.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CustomModal
        isOpen={modal !== null}
        onClose={closeModal}
        title={modal?.mode === "edit" ? "تعديل بيانات التلميذ" : "إضافة تلميذ جديد"}
      >
        {modal && (
          <StudentForm
            student={modal.mode === "edit" ? modal.student : undefined}
            groups={groups}
            onSuccess={closeModal}
          />
        )}
      </CustomModal>
    </div>
  );
}

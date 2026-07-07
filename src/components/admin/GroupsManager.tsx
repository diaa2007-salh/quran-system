"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Users } from "lucide-react";
import { CustomModal } from "@/components/shared/CustomModal";
import { GroupForm } from "@/components/admin/GroupForm";
import { DeleteButton } from "@/components/shared/FormButtons";
import { deleteGroup, type GroupListItem } from "@/lib/actions/groups.actions";

type TeacherOption = { id: string; name: string };
type ModalState = { mode: "create" } | { mode: "edit"; group: GroupListItem } | null;

export function GroupsManager({
  groups,
  teachers,
}: {
  groups: GroupListItem[];
  teachers: TeacherOption[];
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
          <h1 className="font-display text-2xl font-bold text-ink">الأفواج / الحلقات</h1>
          <p className="mt-1 text-sm text-ink-muted">إنشاء الأفواج وربطها بالمعلمين</p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          إضافة فوج
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex flex-col rounded-card border border-border bg-surface-raised p-5"
          >
            <div className="flex items-start justify-between">
              <h2 className="font-display font-bold text-ink">{group.name}</h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="تعديل"
                  onClick={() => setModal({ mode: "edit", group })}
                  className="inline-flex items-center justify-center rounded-lg p-1.5 text-ink-muted hover:bg-primary-light hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <form action={deleteGroup}>
                  <input type="hidden" name="id" value={group.id} />
                  <DeleteButton
                    confirmMessage={`هل تريد حذف فوج "${group.name}"؟ سيتم فصل تلاميذه وحذف سجلات حضوره.`}
                  />
                </form>
              </div>
            </div>

            {group.description && (
              <p className="mt-1.5 text-sm text-ink-muted">{group.description}</p>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-ink-muted">
                المعلم:{" "}
                <span className="font-medium text-ink">
                  {group.teacher?.name ?? "غير مسنَد"}
                </span>
              </span>
              <span className="flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary">
                <Users className="h-3.5 w-3.5" />
                {group._count.students} تلميذ
              </span>
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <p className="col-span-full rounded-card border border-dashed border-border p-10 text-center text-ink-muted">
            لا توجد أفواج بعد. اضغط «إضافة فوج» لإنشاء أول فوج.
          </p>
        )}
      </div>

      <CustomModal
        isOpen={modal !== null}
        onClose={closeModal}
        title={modal?.mode === "edit" ? "تعديل الفوج" : "إضافة فوج جديد"}
      >
        {modal && (
          <GroupForm
            group={modal.mode === "edit" ? modal.group : undefined}
            teachers={teachers}
            onSuccess={closeModal}
          />
        )}
      </CustomModal>
    </div>
  );
}

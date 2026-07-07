import { BookOpenText, Users, CalendarCheck2 } from "lucide-react";
import { getSettings } from "@/lib/actions/settings.actions";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen">
      {/* اللوحة التعريفية — تظهر فقط على الشاشات الكبيرة */}
      <div className="pattern-geometric relative hidden w-1/2 flex-col justify-between p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
            <BookOpenText className="h-6 w-6" />
          </div>
          <span className="font-display text-lg font-bold">{settings.schoolName}</span>
        </div>

        <div className="space-y-6">
          <h1 className="font-display text-3xl font-bold leading-snug">
            إدارة أفواج التحفيظ
            <br />
            بكل يسر ووضوح
          </h1>
          <p className="max-w-md text-sm leading-7 text-white/75">
            منصة واحدة لمتابعة المعلمين والتلاميذ وتسجيل الحضور اليومي لكل
            حلقة، مع تقارير فورية لنسبة الحضور عبر جميع الأفواج.
          </p>
          <ul className="space-y-3 text-sm text-white/85">
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0 text-accent" />
              تنظيم الأفواج وربطها بالمعلمين المسؤولين
            </li>
            <li className="flex items-center gap-2">
              <CalendarCheck2 className="h-4 w-4 shrink-0 text-accent" />
              تسجيل الحضور اليومي بضغطة واحدة لكل تلميذ
            </li>
          </ul>
        </div>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} {settings.schoolName}
        </p>
      </div>

      {/* لوحة تسجيل الدخول */}
      <div className="flex flex-1 items-center justify-center bg-surface px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-start">
            <h2 className="font-display text-2xl font-bold text-ink">تسجيل الدخول</h2>
            <p className="mt-2 text-sm text-ink-muted">
              أدخل بيانات حسابك للوصول إلى لوحتك الخاصة
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-xs text-ink-muted">
            الحسابات تُنشأ من قبل مدير النظام فقط — لا يوجد تسجيل عام.
          </p>
        </div>
      </div>
    </div>
  );
}

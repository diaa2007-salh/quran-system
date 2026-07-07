# نظام إدارة حلقات تحفيظ القرآن الكريم

نظام متكامل لتسيير الأفواج والمعلمين والتلاميذ، مع تسجيل يومي للحضور
والغياب وتقارير فورية. مبني بـ **Next.js 16 (App Router)**، **React 19**،
**Prisma ORM**، **NextAuth.js (Auth.js) v5**، و **Tailwind CSS v4**.

## المزايا

- **مصادقة وحماية مسارات حسب الدور**: مدير (`ADMIN`) ومعلم (`TEACHER`)،
  محمية على طبقتين: Middleware + تحقق داخل كل صفحة وكل Server Action.
- **لوحة إدارة (`/admin`)**:
  - نظرة عامة: عدد المعلمين/التلاميذ/الأفواج + نسبة حضور اليوم والنسبة الكلية.
  - إدارة المعلمين (`/admin/teachers`): إنشاء/تعديل/حذف عبر نافذة منبثقة (Modal).
  - إدارة الأفواج (`/admin/groups`): إنشاء الأفواج وربطها بالمعلمين (Modal).
  - إدارة التلاميذ (`/admin/students`): إضافة وتوزيع على الأفواج (Modal).
  - تقارير الحضور (`/admin/reports`): فلترة حسب الفوج والتاريخ.
  - الإعدادات العامة (`/admin/settings`): اسم المؤسسة، الشعار، اللون الأساسي.
- **لوحة معلم (`/teacher`)**: عرض أفواجه فقط، وتسجيل حضور يومي بضغطة واحدة
  لكل تلميذ (حاضر / متأخر / غائب) عبر Server Actions مباشرة بدون تحديث الصفحة.
- تصميم عربي RTL كامل، مكوّنات واجهة قابلة لإعادة الاستخدام
  (`CustomModal`, `FormInput`, `SubmitButton`, `DeleteButton`, `StatusBadge`...).
- تحقق صارم من كل المدخلات عبر Zod، على مستوى الخادم في كل Server Action.

## التقنيات المستخدمة

| الطبقة | التقنية |
|---|---|
| الواجهة الأمامية | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| المصادقة | NextAuth.js (Auth.js) v5 — Credentials Provider |
| قاعدة البيانات | PostgreSQL عبر Prisma ORM |
| التحقق من المدخلات | Zod |
| الأيقونات | lucide-react |

## هيكلة المشروع

```
prisma/
  schema.prisma        User, Group, Student, Attendance, Settings
  seed.ts               سكربت إنشاء حساب المدير الأول
src/
  auth.ts               إعدادات NextAuth الكاملة (Credentials + callbacks)
  auth.config.ts        إعدادات متوافقة مع Edge + منطق حماية المسارات
  middleware.ts          تطبيق الحماية على كل الطلبات
  lib/
    prisma.ts            singleton لـ Prisma Client
    auth-guard.ts        دوال requireAdmin/requireTeacher (حماية إضافية)
    utils.ts             دوال مساعدة (تواريخ، تشفير كلمات المرور...)
    actions/             كل Server Actions مقسّمة حسب النطاق
  components/
    shared/              CustomModal, FormInput, SubmitButton, DeleteButton...
    admin/                Managers (Teachers/Groups/Students) + النماذج
    teacher/              بطاقات الأفواج وجدول الحضور التفاعلي
  app/
    login/                صفحة تسجيل الدخول
    admin/                لوحة الإدارة (layout + كل الصفحات الفرعية)
    teacher/               لوحة المعلم (layout + تسجيل الحضور)
```

## التشغيل محلياً

### 1. المتطلبات
- Node.js 20.9 أو أحدث
- قاعدة بيانات PostgreSQL (مجانية عبر [Neon](https://neon.tech) أو
  [Supabase](https://supabase.com))

### 2. التثبيت
```bash
npm install
```

### 3. متغيرات البيئة
```bash
cp .env.example .env
```
ثم عبّئ `DATABASE_URL` برابط قاعدة بياناتك، ووّلد `AUTH_SECRET` عبر:
```bash
npx auth secret
```

### 4. إنشاء الجداول
```bash
npx prisma migrate dev --name init
```

### 5. إنشاء حساب المدير الأول
```bash
npx prisma db seed
```

### 6. التشغيل
```bash
npm run dev
```
افتح `http://localhost:3000` وسجّل الدخول بحساب المدير.

---

## 🚀 النشر على Vercel (بالتفصيل)

### الخطوة 1: تجهيز قاعدة بيانات إنتاج
Vercel لا توفّر Postgres تلقائياً لكل مشروع، لذا أنشئ واحدة أولاً:
1. اذهب إلى [neon.tech](https://neon.tech) (أو Supabase) وأنشئ حساباً مجانياً.
2. أنشئ مشروع/قاعدة بيانات جديدة، ثم انسخ **Connection String** الكامل
   (يبدأ بـ `postgresql://...`). تأكد أنه يحتوي `?sslmode=require` في النهاية.

> بديل: من داخل مشروعك على Vercel نفسه → تبويب **Storage** → **Create
> Database** → اختر **Neon** أو **Supabase Postgres**، وسيُنشئ لك المتغيّر
> `DATABASE_URL` تلقائياً في إعدادات المشروع.

### الخطوة 2: رفع المشروع إلى GitHub
```bash
cd quran-halaqat-system
git init
git add .
git commit -m "النسخة الأولى من نظام إدارة حلقات التحفيظ"
```
أنشئ مستودعاً جديداً فارغاً على GitHub، ثم:
```bash
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### الخطوة 3: استيراد المشروع في Vercel
1. سجّل الدخول إلى [vercel.com](https://vercel.com) بحساب GitHub.
2. اضغط **Add New → Project**، واختر المستودع الذي رفعته للتو.
3. Vercel سيكتشف تلقائياً أنه مشروع Next.js — لا حاجة لتغيير أي إعداد بناء.

### الخطوة 4: إضافة متغيرات البيئة
في شاشة الاستيراد (أو لاحقاً من **Settings → Environment Variables**)
أضف المتغيرات التالية لكل من بيئتَي **Production** و **Preview**:

| المتغيّر | القيمة |
|---|---|
| `DATABASE_URL` | رابط Postgres من الخطوة 1 |
| `AUTH_SECRET` | نتيجة الأمر `npx auth secret` |
| `AUTH_URL` | رابط مشروعك، مثال: `https://your-project.vercel.app` |
| `SEED_ADMIN_NAME` | اسم المدير (اختياري، للبذر فقط) |
| `SEED_ADMIN_EMAIL` | بريد المدير الأول |
| `SEED_ADMIN_PASSWORD` | كلمة مرور المدير الأول |

### الخطوة 5: النشر
اضغط **Deploy**. سيقوم Vercel تلقائياً بتنفيذ:
```
npm install   →  يُشغّل postinstall → prisma generate
npm run build →  next build
```
(أمر `prisma generate` مُدرَج مسبقاً ضمن `postinstall` في `package.json`،
لذلك عميل Prisma يُنشأ تلقائياً في كل عملية نشر بدون أي تدخل يدوي).

### الخطوة 6: إنشاء الجداول وحساب المدير في قاعدة بيانات الإنتاج
بعد أول نشر ناجح، نفّذ الترحيل والبذر **محلياً** موجَّهين إلى قاعدة بيانات
الإنتاج (أسهل طريقة):

```bash
# في جهازك، مؤقتاً وجّه المتغيّر لقاعدة بيانات الإنتاج
DATABASE_URL="رابط-قاعدة-بيانات-الإنتاج" npx prisma migrate deploy
DATABASE_URL="رابط-قاعدة-بيانات-الإنتاج" npx prisma db seed
```

أو عبر Vercel CLI مباشرة من بيئة المشروع على Vercel:
```bash
npm i -g vercel
vercel login
vercel link          # اربط المجلد الحالي بمشروع Vercel
vercel env pull .env.production.local
npx prisma migrate deploy
npx prisma db seed
```

### الخطوة 7: افتح موقعك
اذهب إلى الرابط الذي يعطيك إياه Vercel (مثال: `https://your-project.vercel.app`)
وسجّل الدخول بحساب المدير الذي أنشأته في الخطوة السابقة.

### تحديثات لاحقة
كل `git push` إلى الفرع `main` سيُشغّل نشراً جديداً تلقائياً. إن أضفت
حقولاً جديدة إلى `schema.prisma`، تذكّر تنفيذ:
```bash
npx prisma migrate dev --name اسم_التعديل   # محلياً، لإنشاء ملف الترحيل
git push                                      # هذا ينشر الكود فقط
DATABASE_URL="..." npx prisma migrate deploy  # هذا يطبّق الترحيل على قاعدة الإنتاج
```

---

## ملاحظات هندسية

- **الحماية على طبقتين**: `middleware.ts` يحجب الصفحات، وكل Server Action
  حسّاس يتحقق أيضاً من الجلسة والدور بنفسه (`requireAdmin`/`requireTeacher`).
- **فصل Edge عن Node الكاملة**: `auth.config.ts` خالٍ من أي كود يحتاج
  Node.js الكاملة (مثل bcrypt) لأن `middleware.ts` يعمل على بيئة Edge؛
  الإعدادات الكاملة (Credentials Provider) موجودة في `auth.ts` فقط.
- **الأنماط المنبثقة (Modals)**: إدارة المعلمين/الأفواج/التلاميذ تستخدم
  `CustomModal` بدل صفحات منفصلة؛ بعد نجاح الحفظ يُستدعى `router.refresh()`
  لتحديث القائمة خلف النافذة دون أي تنقّل كامل.
- **تسجيل الحضور**: يُحفظ فوراً بصيغة upsert بالاعتماد على قيد فريد
  `[studentId, date]`، فلا يمكن لأي تلميذ أن يمتلك أكثر من سجل حضور
  في نفس اليوم.
- **الإعدادات العامة**: نموذج `Settings` سطر وحيد (`id: "global"`) يُنشأ
  تلقائياً بالقيم الافتراضية عند أول قراءة (upsert)، ويُستخدم فعلياً في
  الشريط الجانبي وصفحة الدخول (اسم المؤسسة).

## أفكار للتوسعة لاحقاً
- صفحة لتغيير كلمة مرور المعلم بنفسه.
- تصدير تقارير الحضور إلى Excel/PDF.
- إشعارات لولي الأمر عبر SMS عند تسجيل غياب.
- دعم التقويم الهجري إلى جانب الميلادي.
- تطبيق `primaryColor` من الإعدادات فعلياً على متغيّر CSS `--color-primary`.

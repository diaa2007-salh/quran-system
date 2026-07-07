"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export type LoginState = { error?: string } | undefined;

export async function authenticate(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      // بعد نجاح الدخول نمرّ دوماً بالصفحة الجذرية، وهي التي تُحوِّل
      // المستخدم تلقائياً إلى /admin أو /teacher بحسب دوره
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }
    // أي خطأ آخر (بما فيه إعادة التوجيه الداخلية الناجحة) يجب أن يُرمى كما هو
    throw error;
  }
}

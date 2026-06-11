import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getSessionUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(user.name?.trim() ? "/" : "/perfil");
  }

  const cookieStore = await cookies();
  const savedWhatsApp = cookieStore.get("bolao_whatsapp_last")?.value ?? "";

  return <LoginForm defaultWhatsApp={savedWhatsApp} />;
}

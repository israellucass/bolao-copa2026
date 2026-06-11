import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getSessionUser, userNeedsProfile } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect(userNeedsProfile(user) ? "/perfil" : "/");
  }

  const cookieStore = await cookies();
  const savedWhatsApp = cookieStore.get("bolao_whatsapp_last")?.value ?? "";

  return <LoginForm defaultWhatsApp={savedWhatsApp} />;
}

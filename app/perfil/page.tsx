import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";
import { getSessionUser } from "@/lib/auth";

export default async function PerfilPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return <ProfileForm defaultName={user.name ?? ""} />;
}

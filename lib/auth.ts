import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import type { User } from "./types";

const SESSION_COOKIE = "bolao_session";

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id, name, whatsapp, pix_key, email, is_admin")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function setSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function setRememberedWhatsApp(whatsapp: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("bolao_whatsapp_last", whatsapp, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export function userNeedsProfile(
  user: Pick<User, "name">
): boolean {
  return !user.name?.trim() || user.name.trim().length < 2;
}

export async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireCompleteUser(): Promise<User> {
  const user = await requireUser();
  if (userNeedsProfile(user)) redirect("/perfil");
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (!user.is_admin) throw new Error("Acesso negado");
  return user;
}

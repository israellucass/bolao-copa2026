"use server";

import { redirect } from "next/navigation";
import {
  clearSession,
  setRememberedWhatsApp,
  setSession,
  userNeedsProfile,
} from "../auth";
import { normalizeWhatsApp } from "../format";
import { supabase } from "../supabase";

export type AuthState = {
  error?: string;
};

export async function loginWithWhatsApp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const whatsapp = normalizeWhatsApp(
    (formData.get("whatsapp") as string) ?? ""
  );

  if (whatsapp.length < 10) {
    return { error: "Informe um número de WhatsApp válido." };
  }

  const { data: existing } = await supabase
    .from("users")
    .select("id, name")
    .eq("whatsapp", whatsapp)
    .maybeSingle();

  if (existing) {
    await setSession(existing.id);
    await setRememberedWhatsApp(whatsapp);
    if (userNeedsProfile(existing)) {
      redirect("/perfil");
    }
    redirect("/");
  }

  const { data: created, error } = await supabase
    .from("users")
    .insert({ whatsapp })
    .select("id")
    .single();

  if (error || !created) {
    return { error: "Não foi possível entrar. Tente novamente." };
  }

  await setSession(created.id);
  await setRememberedWhatsApp(whatsapp);
  redirect("/perfil");
}

export async function logout(): Promise<void> {
  await clearSession();
  redirect("/login");
}

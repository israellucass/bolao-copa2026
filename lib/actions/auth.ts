"use server";

import { redirect } from "next/navigation";
import {
  clearSession,
  setRememberedWhatsApp,
  setSession,
  userNeedsProfile,
} from "../auth";
import {
  isValidBrazilianMobileWhatsApp,
  normalizeWhatsApp,
  whatsAppLookupVariants,
} from "../format";
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

  if (!isValidBrazilianMobileWhatsApp(whatsapp)) {
    return {
      error: "Informe um WhatsApp válido com DDD (ex: (98) 99999-9999).",
    };
  }

  const variants = whatsAppLookupVariants(whatsapp);
  const { data: matches } = await supabase
    .from("users")
    .select("id, name, whatsapp")
    .in("whatsapp", variants)
    .order("created_at", { ascending: true });

  const existing = matches?.[0];

  if (existing) {
    if (existing.whatsapp !== whatsapp) {
      await supabase
        .from("users")
        .update({ whatsapp })
        .eq("id", existing.id);
    }

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

  if (error?.code === "23505") {
    const { data: raced } = await supabase
      .from("users")
      .select("id, name")
      .in("whatsapp", variants)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (raced) {
      await setSession(raced.id);
      await setRememberedWhatsApp(whatsapp);
      if (userNeedsProfile(raced)) {
        redirect("/perfil");
      }
      redirect("/");
    }
  }

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

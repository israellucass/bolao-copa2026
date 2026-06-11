"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, userNeedsProfile } from "../auth";
import { supabase } from "../supabase";

export type ProfileState = {
  error?: string;
};

const MAX_PIX_KEY_LENGTH = 140;

function normalizePixKey(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, MAX_PIX_KEY_LENGTH);
}

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await requireUser();
  const wasNewProfile = userNeedsProfile(user);
  const name = (formData.get("name") as string)?.trim();
  const pixKey = normalizePixKey((formData.get("pix_key") as string) ?? "");

  if (!name || name.length < 2) {
    return { error: "Informe um nome com pelo menos 2 caracteres." };
  }

  const { error } = await supabase
    .from("users")
    .update({ name, pix_key: pixKey })
    .eq("id", user.id);

  if (error) {
    return { error: "Não foi possível salvar seu perfil." };
  }

  revalidatePath("/");
  revalidatePath("/perfil");
  revalidatePath("/ranking");

  if (wasNewProfile && !pixKey) {
    redirect("/perfil?step=pix");
  }

  redirect("/");
}

export async function savePixKey(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await requireUser();
  const pixKey = normalizePixKey((formData.get("pix_key") as string) ?? "");

  if (!pixKey) {
    return { error: "Cole sua chave Pix ou toque em Pular." };
  }

  const { error } = await supabase
    .from("users")
    .update({ pix_key: pixKey })
    .eq("id", user.id);

  if (error) {
    return { error: "Não foi possível salvar sua chave Pix." };
  }

  revalidatePath("/");
  revalidatePath("/perfil");
  redirect("/");
}

export async function skipPixOnboarding(): Promise<void> {
  await requireUser();
  redirect("/");
}

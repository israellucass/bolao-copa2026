"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "../auth";
import { supabase } from "../supabase";

export type ProfileState = {
  error?: string;
};

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await requireUser();
  const name = (formData.get("name") as string)?.trim();

  if (!name || name.length < 2) {
    return { error: "Informe um nome com pelo menos 2 caracteres." };
  }

  const { error } = await supabase
    .from("users")
    .update({ name })
    .eq("id", user.id);

  if (error) {
    return { error: "Não foi possível salvar seu nome." };
  }

  revalidatePath("/");
  revalidatePath("/perfil");
  revalidatePath("/ranking");
  redirect("/");
}

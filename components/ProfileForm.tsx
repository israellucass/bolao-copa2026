"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/lib/actions/profile";

const initialState: ProfileState = {};

interface ProfileFormProps {
  defaultName?: string;
}

export function ProfileForm({ defaultName = "" }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState
  );

  return (
    <main className="flex min-h-full flex-col bg-gray-50">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-10">
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl" aria-hidden>
            👤
          </div>
          <h1 className="text-xl font-black text-emerald-950">
            {defaultName ? "Editar seu nome" : "Como você quer aparecer?"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Este nome aparece no ranking e nos palpites do bolão.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
                Seu nome no bolão
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                autoComplete="name"
                defaultValue={defaultName}
                placeholder="Ex: João Silva"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            {state.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-700">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {pending ? "Salvando..." : defaultName ? "Salvar" : "Continuar"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

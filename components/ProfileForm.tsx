"use client";

import { useActionState } from "react";
import { logout } from "@/lib/actions/auth";
import { updateProfile, type ProfileState } from "@/lib/actions/profile";
import { CRICKET_ICON, theme } from "@/lib/theme";

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
    <main className={`${theme.mainWithNav} flex flex-col`}>
      <div className="mx-auto w-full max-w-sm flex-1 py-4 sm:py-8">
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-stone-900 text-2xl ring-1 ring-lime-500/30"
            aria-hidden
          >
            {CRICKET_ICON}
          </div>
          <h1 className={theme.heading}>
            {defaultName ? "Editar seu nome" : "Como você quer aparecer?"}
          </h1>
          <p className={`mt-1 ${theme.subheading}`}>
            Este nome aparece no ranking e nos palpites do bolão.
          </p>
        </div>

        <div className={theme.cardInner}>
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="name" className={theme.label}>
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
                className={theme.input}
              />
            </div>

            {state.error && <p className={theme.alertError}>{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className={theme.btnPrimaryFull}
            >
              {pending ? "Salvando..." : defaultName ? "Salvar" : "Continuar"}
            </button>
          </form>
        </div>

        <form action={logout} className="mt-6">
          <button
            type="submit"
            className="flex min-h-12 w-full items-center justify-center rounded-xl border border-stone-700 bg-stone-900 py-3 text-sm font-semibold text-stone-400 transition active:scale-[0.98] hover:border-stone-600 hover:text-amber-100"
          >
            Sair da conta
          </button>
        </form>
      </div>
    </main>
  );
}

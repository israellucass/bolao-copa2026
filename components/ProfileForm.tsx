"use client";

import { useActionState } from "react";
import { logout } from "@/lib/actions/auth";
import {
  savePixKey,
  skipPixOnboarding,
  updateProfile,
  type ProfileState,
} from "@/lib/actions/profile";
import { CRICKET_ICON, theme } from "@/lib/theme";

const initialState: ProfileState = {};

interface ProfileFormProps {
  defaultName?: string;
  defaultPixKey?: string;
  step?: "pix";
}

export function ProfileForm({
  defaultName = "",
  defaultPixKey = "",
  step,
}: ProfileFormProps) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfile,
    initialState
  );
  const [pixState, pixAction, pixPending] = useActionState(
    savePixKey,
    initialState
  );

  if (step === "pix") {
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
            <h1 className={theme.heading}>Sua chave Pix</h1>
            <p className={`mt-1 ${theme.subheading}`}>
              Opcional. Quando você ganhar uma rodada, todos verão sua chave
              para enviar o Pix.
            </p>
          </div>

          <div className={theme.cardInner}>
            <form action={pixAction} className="space-y-4">
              <div>
                <label htmlFor="pix_key" className={theme.label}>
                  Chave Pix
                </label>
                <input
                  id="pix_key"
                  name="pix_key"
                  type="text"
                  autoComplete="off"
                  placeholder="CPF, e-mail, celular ou chave aleatória"
                  className={theme.input}
                />
                <p className="mt-2 text-xs leading-relaxed text-stone-500">
                  Você pode cadastrar depois em Perfil.
                </p>
              </div>

              {pixState.error && (
                <p className={theme.alertError}>{pixState.error}</p>
              )}

              <button
                type="submit"
                disabled={pixPending}
                className={theme.btnPrimaryFull}
              >
                {pixPending ? "Salvando..." : "Salvar chave Pix"}
              </button>
            </form>

            <form action={skipPixOnboarding} className="mt-3">
              <button
                type="submit"
                className="flex min-h-12 w-full items-center justify-center rounded-xl border border-stone-700 bg-stone-900 py-3 text-sm font-semibold text-stone-400 transition active:scale-[0.98] hover:border-stone-600 hover:text-amber-100"
              >
                Pular por agora
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

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
            {defaultName ? "Seu perfil" : "Como você quer aparecer?"}
          </h1>
          <p className={`mt-1 ${theme.subheading}`}>
            {defaultName
              ? "Atualize seu nome e chave Pix para receber apostas."
              : "Este nome aparece no ranking e nos palpites do bolão."}
          </p>
        </div>

        <div className={theme.cardInner}>
          <form action={profileAction} className="space-y-4">
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

            {defaultName && (
              <div>
                <label htmlFor="pix_key" className={theme.label}>
                  Chave Pix (opcional)
                </label>
                <input
                  id="pix_key"
                  name="pix_key"
                  type="text"
                  autoComplete="off"
                  defaultValue={defaultPixKey}
                  placeholder="CPF, e-mail, celular ou chave aleatória"
                  className={theme.input}
                />
                <p className="mt-2 text-xs leading-relaxed text-stone-500">
                  Exibida para todos quando você vencer uma partida.
                </p>
              </div>
            )}

            {profileState.error && (
              <p className={theme.alertError}>{profileState.error}</p>
            )}

            <button
              type="submit"
              disabled={profilePending}
              className={theme.btnPrimaryFull}
            >
              {profilePending
                ? "Salvando..."
                : defaultName
                  ? "Salvar"
                  : "Continuar"}
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

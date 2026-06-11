"use client";

import { useActionState } from "react";
import { GrileirosMascot } from "@/components/GrileirosMascot";
import { loginWithWhatsApp, type AuthState } from "@/lib/actions/auth";
import { formatWhatsApp } from "@/lib/format";
import { APP_SUBTITLE, APP_TITLE, theme } from "@/lib/theme";

const initialState: AuthState = {};

interface LoginFormProps {
  defaultWhatsApp?: string;
}

export function LoginForm({ defaultWhatsApp = "" }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(
    loginWithWhatsApp,
    initialState
  );

  const displayDefault = defaultWhatsApp
    ? formatWhatsApp(defaultWhatsApp)
    : "";

  return (
    <main className="flex min-h-dvh flex-col bg-gradient-to-b from-stone-950 via-emerald-950 to-stone-900 safe-x safe-bottom safe-top">
      <div className="flex flex-1 flex-col items-center justify-center px-2 py-8 sm:px-4 sm:py-10">
        <header className="mb-6 w-full max-w-sm text-center">
          <GrileirosMascot
            variant="hero"
            priority
            className="mx-auto mb-4 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          />
          <h1 className="text-2xl font-black tracking-tight text-amber-100 sm:text-3xl">
            {APP_TITLE}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-400">
            {APP_SUBTITLE}
          </p>
        </header>

        <div className={`w-full max-w-sm p-4 sm:p-5 ${theme.cardInner}`}>
          <form action={formAction} className="space-y-5">
            <div>
              <label htmlFor="whatsapp" className={theme.label}>
                Seu WhatsApp
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                required
                autoComplete="tel"
                defaultValue={displayDefault}
                placeholder="(98) 99999-9999"
                className={theme.input}
              />
              <p className="mt-2 text-xs leading-relaxed text-stone-500">
                Seu número de identificação no bolão. Depois você escolhe seu
                nome.
              </p>
            </div>
            <button
              type="submit"
              disabled={pending}
              className={theme.btnPrimaryFull}
            >
              {pending ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {state.error && (
            <p className={`mt-4 ${theme.alertError}`}>{state.error}</p>
          )}
        </div>
      </div>
    </main>
  );
}

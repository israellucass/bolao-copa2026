"use client";

import { useActionState } from "react";
import { loginWithWhatsApp, type AuthState } from "@/lib/actions/auth";
import { formatWhatsApp } from "@/lib/format";

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
    <main className="flex min-h-full flex-col bg-gradient-to-b from-emerald-950 via-green-900 to-emerald-800">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="mb-8 text-center text-white">
          <div className="mb-3 text-5xl" aria-hidden>
            🇧🇷⚽
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Bolão Copa 2026
          </h1>
          <p className="mt-1 text-sm text-yellow-200/90">
            Palpites da Seleção · Grupo WhatsApp
          </p>
        </div>

        <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-black/5">
          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="whatsapp"
                className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500"
              >
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
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Seu número de identificação no bolão. Depois você escolhe seu
                nome.
              </p>
            </div>
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-3 text-sm font-bold text-white shadow-md transition hover:from-emerald-700 hover:to-green-700 disabled:opacity-60"
            >
              {pending ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {state.error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-700">
              {state.error}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

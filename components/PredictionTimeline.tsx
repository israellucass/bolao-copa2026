"use client";

import { useMemo, useState } from "react";
import { formatLogTimestamp } from "@/lib/format";
import { buildMatchTimelineRows } from "@/lib/prediction-timeline";
import { theme } from "@/lib/theme";
import type { PredictionLogEntry } from "@/lib/types";

interface PredictionTimelineProps {
  entries: PredictionLogEntry[];
  currentUserId: string;
  canStillChange: boolean;
}

export function PredictionTimeline({
  entries,
  currentUserId,
  canStillChange,
}: PredictionTimelineProps) {
  const [open, setOpen] = useState(true);
  const rows = useMemo(() => buildMatchTimelineRows(entries), [entries]);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-700 bg-stone-950/40 px-4 py-4 text-center">
        <p className="text-sm text-stone-400">
          Nenhum palpite registrado ainda nesta partida.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-950/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-lime-400">
            Histórico de palpites
          </p>
          <p className="mt-0.5 text-sm text-stone-400">
            {rows.length} {rows.length === 1 ? "palpite" : "palpites"} · visível
            para todos
            {canStillChange && " · ainda pode alterar até o apito"}
          </p>
        </div>
        <span className="shrink-0 text-stone-500" aria-hidden>
          {open ? "▾" : "▸"}
        </span>
      </button>

      {open && (
        <div className="border-t border-stone-800 px-3 py-3 sm:px-4">
          <ol className="relative">
            {rows.length > 1 && (
              <span
                className="absolute left-[9px] top-[11px] bottom-[11px] w-px bg-stone-700"
                aria-hidden
              />
            )}

            {rows.map((entry, index) => {
              const isCurrentUser = entry.user_id === currentUserId;
              const isLatest = index === rows.length - 1;

              return (
                <li key={entry.user_id} className="relative flex gap-3 py-2.5">
                  <div className="relative z-10 flex w-5 shrink-0 justify-center pt-0.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isLatest
                          ? "bg-lime-400 ring-2 ring-lime-400/30"
                          : "bg-stone-600 ring-2 ring-stone-950"
                      }`}
                      aria-hidden
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                      <p
                        className={`text-sm font-semibold ${
                          isCurrentUser ? "text-lime-400" : "text-amber-100"
                        }`}
                      >
                        {entry.user_name}
                        {isCurrentUser && (
                          <span className="ml-1 text-xs font-normal text-stone-400">
                            (você)
                          </span>
                        )}
                      </p>
                      <time
                        dateTime={entry.created_at}
                        className="shrink-0 text-xs text-stone-500"
                      >
                        {formatLogTimestamp(entry.created_at)}
                      </time>
                    </div>
                    <p className="mt-0.5 text-sm text-stone-300">
                      {entry.action === "created" ? "Palpitou" : "Alterou para"}{" "}
                      <span className="font-bold text-amber-50">
                        {entry.home_score} × {entry.away_score}
                      </span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {canStillChange && (
        <p className={`border-t border-stone-800 px-4 py-2.5 ${theme.meta}`}>
          Os palpites podem ser alterados até o início da partida.
        </p>
      )}
    </div>
  );
}

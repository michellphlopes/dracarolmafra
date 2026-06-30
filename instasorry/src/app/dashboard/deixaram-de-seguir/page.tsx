"use client";

import { useState, useEffect } from "react";
import { UserCheck, ExternalLink } from "lucide-react";
import { formatDate, getInstagramProfileUrl } from "@/lib/utils";

interface Event {
  id: string;
  targetUsername: string;
  targetFullName?: string | null;
  targetProfileUrl?: string | null;
  detectedAt: string;
  eventType: string;
}

export default function DeixaramDeSeguirPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/instagram/events?type=UNFOLLOWED&page=${page}`)
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events ?? []);
        setTotal(data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center">
          <UserCheck className="h-5 w-5 text-pink-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Deixaram de seguir</h1>
      </div>
      <p className="text-gray-400 mb-8">
        Histórico de pessoas que pararam de te seguir detectado nas sincronizações.
      </p>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-800/50 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum unfollow detectado ainda.</p>
          <p className="text-sm mt-1">Importe seus dados para começar a monitorar.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">{total.toLocaleString("pt-BR")} evento(s)</p>
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-800/40 hover:bg-gray-800/70 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {event.targetUsername[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">@{event.targetUsername}</p>
                    <p className="text-xs text-gray-400">{formatDate(event.detectedAt)}</p>
                  </div>
                </div>
                <a
                  href={event.targetProfileUrl ?? getInstagramProfileUrl(event.targetUsername)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-pink-400 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>

          {total > 50 && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-700 text-gray-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-400">Página {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={events.length < 50}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-700 text-gray-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

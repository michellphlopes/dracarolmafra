"use client";

import { useState, useEffect } from "react";
import { ExternalLink, User } from "lucide-react";
import { getInstagramProfileUrl } from "@/lib/utils";

interface UserEntry {
  username: string;
  fullName?: string | null;
  profileUrl?: string | null;
}

interface UserListProps {
  apiUrl: string;
  emptyMessage?: string;
}

export function UserList({ apiUrl, emptyMessage = "Nenhum resultado encontrado." }: UserListProps) {
  const [items, setItems] = useState<UserEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}&page=${page}`)
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [apiUrl, page]);

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-gray-800/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-4">{total.toLocaleString("pt-BR")} resultado(s)</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.username}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/40 hover:bg-gray-800/70 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">
                  {item.username[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">@{item.username}</p>
                {item.fullName && (
                  <p className="text-xs text-gray-400">{item.fullName}</p>
                )}
              </div>
            </div>
            <a
              href={item.profileUrl ?? getInstagramProfileUrl(item.username)}
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
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-400">Página {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={items.length < 50}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:pointer-events-none"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

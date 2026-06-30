"use client";

import { useEffect, useState } from "react";
import { Bell, Mail, Smartphone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Prefs {
  emailEnabled: boolean;
  pushEnabled: boolean;
  unfollowAlert: boolean;
  newFollowerAlert: boolean;
  weeklyDigest: boolean;
}

export default function ConfiguracoesPage() {
  const [prefs, setPrefs] = useState<Prefs>({
    emailEnabled: true,
    pushEnabled: true,
    unfollowAlert: true,
    newFollowerAlert: true,
    weeklyDigest: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/notifications/preferences")
      .then((r) => r.json())
      .then((data) => {
        if (data.emailEnabled !== undefined) setPrefs(data);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/notifications/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function toggle(key: keyof Prefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  if (loading) {
    return (
      <div className="p-6 sm:p-8 max-w-xl">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-gray-800/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center">
          <Bell className="h-5 w-5 text-pink-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Notificações</h1>
      </div>
      <p className="text-gray-400 mb-8">Configure como e quando você deseja ser notificado.</p>

      <div className="space-y-3">
        <ToggleRow
          icon={Mail}
          label="Notificações por e-mail"
          description="Receba alertas no seu e-mail cadastrado"
          checked={prefs.emailEnabled}
          onChange={() => toggle("emailEnabled")}
        />
        <ToggleRow
          icon={Smartphone}
          label="Notificações push"
          description="Alertas direto no navegador (em breve)"
          checked={prefs.pushEnabled}
          onChange={() => toggle("pushEnabled")}
          disabled
        />

        <div className="mt-6 mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Tipos de alerta
          </p>
        </div>

        <ToggleRow
          icon={Bell}
          label="Alerta de unfollow"
          description="Notificar quando alguém deixar de te seguir"
          checked={prefs.unfollowAlert}
          onChange={() => toggle("unfollowAlert")}
        />
        <ToggleRow
          icon={Bell}
          label="Alerta de novo seguidor"
          description="Notificar quando alguém começar a te seguir"
          checked={prefs.newFollowerAlert}
          onChange={() => toggle("newFollowerAlert")}
        />
        <ToggleRow
          icon={Calendar}
          label="Resumo semanal"
          description="Receba um resumo todo domingo com as mudanças da semana"
          checked={prefs.weeklyDigest}
          onChange={() => toggle("weeklyDigest")}
        />
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Button onClick={handleSave} loading={saving}>
          Salvar preferências
        </Button>
        {saved && (
          <span className="text-sm text-green-400">✓ Salvo com sucesso</span>
        )}
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-900/40 ${disabled ? "opacity-50" : ""}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? "bg-pink-500" : "bg-gray-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

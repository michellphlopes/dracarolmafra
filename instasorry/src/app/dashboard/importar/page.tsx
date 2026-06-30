"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface UploadResult {
  followerCount: number;
  followingCount: number;
  unfollowed: number;
  newFollowers: number;
  notFollowingBack: number;
  userDoesNotFollowBack: number;
}

export default function ImportarPage() {
  const [followersFile, setFollowersFile] = useState<File | null>(null);
  const [followingFile, setFollowingFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!followersFile || !followingFile) {
      setError("Selecione os dois arquivos.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("followers", followersFile);
    formData.append("following", followingFile);
    if (username) formData.append("username", username);

    const res = await fetch("/api/instagram/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erro ao processar arquivos.");
      return;
    }

    setResult(data);
  }

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">Importar dados do Instagram</h1>
      <p className="text-gray-400 mb-8">
        Use os arquivos exportados pela Central de Contas da Meta para sincronizar seus seguidores.
      </p>

      {/* Instruções */}
      <div className="mb-8 p-5 rounded-xl border border-blue-800/50 bg-blue-900/10">
        <h2 className="text-sm font-semibold text-blue-300 mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Como exportar seus dados do Instagram
        </h2>
        <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside leading-relaxed">
          <li>Abra o Instagram e vá em <strong className="text-gray-200">Configurações → Central de Contas</strong></li>
          <li>Acesse <strong className="text-gray-200">Suas informações e permissões → Baixar suas informações</strong></li>
          <li>Selecione sua conta do Instagram</li>
          <li>Em <strong className="text-gray-200">Tipo de informação</strong>, selecione <strong className="text-gray-200">Seguidores e seguindo</strong></li>
          <li>Escolha o formato <strong className="text-gray-200">JSON</strong> e solicite o download</li>
          <li>Quando receber o e-mail com o link, baixe e descompacte o arquivo</li>
          <li>Faça upload dos arquivos <code className="text-pink-400">followers_1.json</code> e <code className="text-pink-400">following.json</code> abaixo</li>
        </ol>
        <a
          href="https://accountscenter.instagram.com/info_and_permissions/dyi/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-3 text-xs text-blue-400 hover:text-blue-300"
        >
          Ir para Central de Contas da Meta
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {result ? (
        <div className="p-6 rounded-xl border border-green-700/50 bg-green-900/10">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white">Dados importados com sucesso!</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-lg bg-gray-800/50">
              <p className="text-gray-400">Seguidores</p>
              <p className="text-xl font-bold text-white">{result.followerCount.toLocaleString("pt-BR")}</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-800/50">
              <p className="text-gray-400">Seguindo</p>
              <p className="text-xl font-bold text-white">{result.followingCount.toLocaleString("pt-BR")}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/30">
              <p className="text-gray-400">Deixaram de seguir</p>
              <p className="text-xl font-bold text-red-400">{result.unfollowed.toLocaleString("pt-BR")}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-900/20 border border-green-800/30">
              <p className="text-gray-400">Novos seguidores</p>
              <p className="text-xl font-bold text-green-400">{result.newFollowers.toLocaleString("pt-BR")}</p>
            </div>
          </div>
          <Button
            className="mt-4 w-full"
            variant="secondary"
            onClick={() => setResult(null)}
          >
            Importar novamente
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Seu username do Instagram (primeira vez)"
            type="text"
            placeholder="@seuusuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <FileDropzone
            label="Arquivo de seguidores (followers_1.json / followers.html)"
            accept=".json,.html,.htm"
            file={followersFile}
            onChange={setFollowersFile}
          />

          <FileDropzone
            label="Arquivo de seguindo (following.json / following.html)"
            accept=".json,.html,.htm"
            file={followingFile}
            onChange={setFollowingFile}
          />

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            <Upload className="h-4 w-4" />
            Processar e sincronizar
          </Button>

          <p className="text-xs text-gray-500 text-center">
            🔒 Seus dados são processados de forma segura e nunca compartilhados.
            Não solicitamos sua senha do Instagram.
          </p>
        </form>
      )}
    </div>
  );
}

function FileDropzone({
  label,
  accept,
  file,
  onChange,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <label
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
          file
            ? "border-green-600/50 bg-green-900/10"
            : "border-gray-700 hover:border-pink-500/50 hover:bg-pink-500/5"
        )}
      >
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
        ) : (
          <div className="text-gray-400">
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Clique para selecionar ou arraste o arquivo</p>
            <p className="text-xs mt-1 opacity-60">{accept.split(",").join(", ")}</p>
          </div>
        )}
      </label>
    </div>
  );
}

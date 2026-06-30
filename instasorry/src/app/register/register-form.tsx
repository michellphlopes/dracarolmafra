"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const plan = params.get("plan") ?? "MONTHLY";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Erro ao criar conta.");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    router.push(`/pricing?plan=${plan}&new=1`);
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-white">InstaSorry</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Criar conta grátis</h1>
          <p className="text-gray-400 mt-2">3 dias de trial sem precisar de cartão</p>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Seu nome"
              type="text"
              placeholder="João Silva"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
              autoComplete="name"
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              required
              autoComplete="new-password"
            />

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Criar conta e continuar
            </Button>

            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Ao criar conta você concorda com nossos{" "}
              <Link href="/termos" className="text-pink-400 hover:underline">Termos de Uso</Link>{" "}
              e{" "}
              <Link href="/privacidade" className="text-pink-400 hover:underline">Política de Privacidade</Link>.
            </p>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            Já tem conta?{" "}
            <Link href="/login" className="text-pink-400 hover:text-pink-300 font-medium">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Heart, Bell, Users, TrendingDown, Shield, CheckCircle, ArrowRight, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800/50 sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold text-white">InstaSorry</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link
              href="/register"
              className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 via-purple-500/5 to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-400 text-sm font-medium mb-6">
            <Star className="h-3.5 w-3.5 fill-current" />
            3 dias grátis — sem cartão
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
            Descubra quem{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              deixou de te seguir
            </span>{" "}
            no Instagram
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Acompanhe seus seguidores, veja quem não te segue de volta e receba alertas sempre que houver mudança. Simples, rápido e seguro.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40"
            >
              Começar por R$20/mês
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-300 font-semibold text-lg hover:bg-gray-800 hover:text-white transition-all"
            >
              Economizar no plano anual
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Sem senha do Instagram • 100% seguro • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">
          Tudo que você precisa saber sobre seus seguidores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: TrendingDown,
              color: "red",
              title: "Quem deixou de seguir",
              desc: "Saiba exatamente quem parou de te seguir e quando isso aconteceu.",
            },
            {
              icon: Users,
              color: "purple",
              title: "Quem não te segue de volta",
              desc: "Veja a lista completa de pessoas que você segue mas não te seguem de volta.",
            },
            {
              icon: Bell,
              color: "pink",
              title: "Alertas por e-mail",
              desc: "Receba notificações no e-mail sempre que alguém deixar de te seguir.",
            },
            {
              icon: Shield,
              color: "green",
              title: "100% seguro",
              desc: "Usamos exportação oficial da Meta. Nunca pedimos sua senha do Instagram.",
            },
            {
              icon: CheckCircle,
              color: "blue",
              title: "Histórico completo",
              desc: "Acesse todo o histórico de mudanças nos seus seguidores por data.",
            },
            {
              icon: Heart,
              color: "pink",
              title: "Novos seguidores",
              desc: "Acompanhe quem começou a te seguir em cada sincronização.",
            },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-xl border border-gray-800 bg-gray-900/40 hover:bg-gray-900/70 transition-all"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                  color === "red"
                    ? "bg-red-500/10"
                    : color === "purple"
                    ? "bg-purple-500/10"
                    : color === "pink"
                    ? "bg-pink-500/10"
                    : color === "green"
                    ? "bg-green-500/10"
                    : "bg-blue-500/10"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    color === "red"
                      ? "text-red-400"
                      : color === "purple"
                      ? "text-purple-400"
                      : color === "pink"
                      ? "text-pink-400"
                      : color === "green"
                      ? "text-green-400"
                      : "text-blue-400"
                  }`}
                />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 bg-gray-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Como funciona?
          </h2>
          <p className="text-gray-400 mb-12">
            Sem senha, sem risco. Usamos a exportação oficial de dados da Meta.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Crie sua conta", desc: "Cadastre-se em segundos e comece seu trial de 3 dias." },
              { step: "2", title: "Exporte seus dados", desc: "Baixe seus dados do Instagram pela Central de Contas da Meta." },
              { step: "3", title: "Veja tudo", desc: "Faça upload e descubra quem te segue, quem não segue de volta e quem parou." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                  {step}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
          Preços simples e transparentes
        </h2>
        <p className="text-gray-400 text-center mb-12">3 dias grátis em qualquer plano</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Monthly */}
          <div className="p-6 rounded-xl border border-gray-700 bg-gray-900/50">
            <h3 className="text-lg font-semibold text-white mb-1">Mensal</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-white">R$20</span>
              <span className="text-gray-400">/mês</span>
            </div>
            <ul className="space-y-2.5 mb-6 text-sm text-gray-300">
              {["Monitorar 1 conta", "Histórico ilimitado", "Alertas por e-mail", "Sincronização manual"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register?plan=MONTHLY"
              className="block text-center px-4 py-2.5 rounded-lg border border-gray-700 text-white font-medium hover:bg-gray-800 transition-all"
            >
              Começar trial grátis
            </Link>
          </div>

          {/* Annual */}
          <div className="p-6 rounded-xl border border-pink-500/40 bg-gradient-to-b from-pink-500/5 to-purple-500/5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold">
              2 MESES GRÁTIS
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Anual</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold text-white">R$200</span>
              <span className="text-gray-400">/ano</span>
            </div>
            <p className="text-xs text-pink-400 mb-4">≈ R$16,67/mês — economia de R$40</p>
            <ul className="space-y-2.5 mb-6 text-sm text-gray-300">
              {["Monitorar 1 conta", "Histórico ilimitado", "Alertas por e-mail", "Sincronização prioritária", "Suporte prioritário"].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/register?plan=ANNUAL"
              className="block text-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-pink-500/25"
            >
              Economizar agora
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Pronto para descobrir a verdade?
          </h2>
          <p className="text-gray-400 mb-8">
            Junte-se a milhares de usuários que já sabem exatamente quem está no Instagram deles.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-pink-500/25"
          >
            Começar trial de 3 dias grátis
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Heart className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="text-sm font-semibold text-white">InstaSorry</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacidade" className="hover:text-gray-300 transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-gray-300 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/contato" className="hover:text-gray-300 transition-colors">
              Contato
            </Link>
          </div>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} InstaSorry. Não é afiliado ao Meta/Instagram.
          </p>
        </div>
      </footer>
    </div>
  );
}

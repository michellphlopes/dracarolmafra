import Link from "next/link";
import { Heart } from "lucide-react";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="font-bold text-white">InstaSorry</span>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Termos de Uso</h1>
        <p className="text-gray-400 mb-10">Última atualização: junho de 2025</p>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Serviço</h2>
            <p>
              O InstaSorry é um serviço de análise de seguidores do Instagram que permite ao usuário
              importar dados exportados oficialmente pela Meta e visualizar informações sobre seus
              seguidores. O serviço não acessa diretamente contas do Instagram.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Uso permitido</h2>
            <p>Ao usar o InstaSorry, você concorda que:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
              <li>Utilizará apenas dados que lhe pertencem (sua própria conta do Instagram)</li>
              <li>Não tentará acessar dados de terceiros sem autorização</li>
              <li>Não utilizará o serviço para fins ilegais ou que violem os Termos do Instagram</li>
              <li>Tem 18 anos ou mais, ou conta com autorização de responsável legal</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Assinatura e pagamentos</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Trial de 3 dias gratuito, sem necessidade de cartão</li>
              <li>Plano mensal: R$20/mês; Plano anual: R$200/ano</li>
              <li>Cobranças são processadas por Stripe ou Mercado Pago</li>
              <li>Cancelamento pode ser feito a qualquer momento</li>
              <li>Não há reembolso por período já utilizado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Limitações do serviço</h2>
            <p className="text-yellow-300/80 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
              O InstaSorry <strong>não oferece monitoramento em tempo real</strong>. As análises são
              baseadas em snapshots dos dados importados pelo usuário. A detecção de unfollows ocorre
              apenas após nova importação de dados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Isenção de responsabilidade</h2>
            <p>
              O InstaSorry não é afiliado ao Instagram ou à Meta Platforms. O serviço pode ser
              descontinuado a qualquer momento mediante aviso prévio de 30 dias.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Contato</h2>
            <p>
              Dúvidas:{" "}
              <a href="mailto:contato@instasorry.com.br" className="text-pink-400 hover:underline">
                contato@instasorry.com.br
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

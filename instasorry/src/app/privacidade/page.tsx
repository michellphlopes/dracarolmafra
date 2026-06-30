import Link from "next/link";
import { Heart } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="font-bold text-white">InstaSorry</span>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Política de Privacidade</h1>
        <p className="text-gray-400 mb-10">Última atualização: junho de 2025</p>

        <div className="prose prose-invert max-w-none space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Dados coletados</h2>
            <p>O InstaSorry coleta apenas os dados necessários para o funcionamento do serviço:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
              <li>Nome e endereço de e-mail (criação de conta)</li>
              <li>Usernames de seguidores/seguindo importados por você via exportação oficial da Meta</li>
              <li>Dados de pagamento processados por Stripe ou Mercado Pago (não armazenamos dados de cartão)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. O que NÃO coletamos</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-400">
              <li>Senha do Instagram ou qualquer credencial de acesso</li>
              <li>Mensagens, stories, fotos ou conteúdo privado</li>
              <li>Dados de localização</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Uso dos dados</h2>
            <p>Os dados são utilizados exclusivamente para:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-gray-400">
              <li>Exibir as análises de seguidores no seu dashboard</li>
              <li>Enviar notificações conforme suas preferências</li>
              <li>Processar pagamentos e gerenciar sua assinatura</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Compartilhamento</h2>
            <p>
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto
              processadores de pagamento (Stripe, Mercado Pago) e infraestrutura de e-mail para envio
              de notificações, todos sujeitos a suas próprias políticas de privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Retenção de dados</h2>
            <p>
              Seus dados de seguidores são mantidos enquanto sua conta estiver ativa. Ao cancelar,
              você pode solicitar a exclusão completa enviando e-mail para contato@instasorry.com.br.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. LGPD</h2>
            <p>
              Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), você
              tem direito de acesso, correção, portabilidade e exclusão dos seus dados. Entre em
              contato via contato@instasorry.com.br.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Relação com o Instagram/Meta</h2>
            <p className="text-yellow-300/80 bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
              ⚠️ O InstaSorry não é afiliado, patrocinado ou aprovado pelo Instagram ou Meta Platforms.
              Utilizamos apenas dados exportados diretamente pelo usuário através da Central de Contas
              da Meta, em conformidade com os Termos de Serviço do Instagram.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

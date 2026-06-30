import { UserList } from "@/components/dashboard/user-list";
import { UserMinus } from "lucide-react";

export default function NaoMeSeguemPage() {
  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
          <UserMinus className="h-5 w-5 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Não me seguem de volta</h1>
      </div>
      <p className="text-gray-400 mb-8">
        Você segue essas pessoas, mas elas não te seguem de volta.
      </p>
      <UserList
        apiUrl="/api/instagram/list?type=not-following-back"
        emptyMessage="Ótimo! Todos que você segue também te seguem de volta."
      />
    </div>
  );
}

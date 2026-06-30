import { UserList } from "@/components/dashboard/user-list";
import { UserX } from "lucide-react";

export default function EuNaoSigoPage() {
  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <UserX className="h-5 w-5 text-yellow-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Eu não sigo de volta</h1>
      </div>
      <p className="text-gray-400 mb-8">
        Essas pessoas te seguem, mas você não as segue de volta.
      </p>
      <UserList
        apiUrl="/api/instagram/list?type=user-not-following-back"
        emptyMessage="Você segue de volta todos que te seguem."
      />
    </div>
  );
}

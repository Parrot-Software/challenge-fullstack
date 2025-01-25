"use client";

import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie =
      "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  return (
    <div
      className="mt-5 text-sm text-gray-400 cursor-pointer"
      onClick={handleLogout}
    >
      Cerrar sesión
    </div>
  );
}

"use client";
import Link from "next/link";
import Logout from "./logout";
import useAuth from "@/app/hooks/use-auth";
function Sidebar() {
  const { user } = useAuth();
  return (
    <div className="w-64 bg-black text-white p-5 flex flex-col h-full">
      <Link href="/" className="text-2xl font-bold mb-5">
        parrotconnect
      </Link>
      <input
        className="w-full p-2 mb-5 rounded bg-gray-800 text-white placeholder-gray-400"
        type="text"
        placeholder="Pregunta a Parrot AI"
      />
      <ul className="space-y-4 flex-grow">
        <li>
          <Link href="/orders" className="flex items-center space-x-2">
            <span>🍽️</span>
            <span>Menú</span>
          </Link>
        </li>
        <li>
          <Link href="/products" className="flex items-center space-x-2">
            <span>📦</span>
            <span>Productos</span>
          </Link>
        </li>

        <li>
          <p className="flex items-center space-x-2">
            <span>👤</span>
            <span>{user?.username}</span>
          </p>
        </li>
      </ul>
      <Logout />
    </div>
  );
}

export default Sidebar;

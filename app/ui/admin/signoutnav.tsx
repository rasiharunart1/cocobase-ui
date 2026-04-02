"use client";

import { PowerIcon } from "@heroicons/react/24/outline";
import { removeCookiesToken } from "@/app/utils/cookies";

export default function FormSignOutNav() {
  const handleLogout = async () => {
    // Hapus token dari localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    // Hapus httpOnly cookie via server action
    await removeCookiesToken();
    // Redirect ke landing page
    window.location.href = "/";
  };

  return (
    <div className="md:w-[95%]">
      <button
        onClick={handleLogout}
        className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-white p-3 text-sm font-medium text-[#202224] hover:bg-red-50 hover:text-red-600 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors"
      >
        <PowerIcon className="w-6" />
        <div className="hidden md:block">Sign Out</div>
      </button>
    </div>
  );
}

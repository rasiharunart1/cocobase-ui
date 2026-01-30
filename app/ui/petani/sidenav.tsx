import PetaniNavLinks from "@/app/ui/petani/nav-links";
import Logo from "../../../public/cblogo.png";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiLogout } from "@mdi/js";

export default function PetaniSideNav() {
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-white shadow-md border-r">
            <Link href="/petani/dashboard" className="flex justify-center items-center mb-6">
                <Image src={Logo} alt="logo" width={150} height={50} priority />
            </Link>
            <div className="flex grow flex-row justify-between md:mt-2 md:border-t-[1px] md:border-gray-100 items-end md:items-center space-x-2 bg-white md:flex-col md:space-x-0 md:space-y-2">
                <PetaniNavLinks />
                <div className="hidden h-auto w-full grow rounded-md bg-white md:block"></div>

                {/* Sign Out Button for Farmer */}
                <button
                    onClick={() => {
                        document.cookie = "petani_token=; path=/; max-age=0";
                        localStorage.removeItem("petani_user");
                        window.location.href = "/petani/login";
                    }}
                    className="flex h-[48px] md:w-[95%] grow items-center justify-center gap-2 rounded-md bg-white p-3 text-sm font-medium text-red-600 hover:bg-red-50 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors mb-4"
                >
                    <Icon path={mdiLogout} size={1.2} className="w-6" />
                    <p className="hidden md:block">Keluar</p>
                </button>
            </div>
        </div>
    );
}

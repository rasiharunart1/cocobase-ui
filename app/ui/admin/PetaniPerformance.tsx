import Icon from "@mdi/react";
import { mdiTrophy, mdiAccountGroup, mdiWeightKilogram, mdiPackageVariantClosed } from "@mdi/js";
import { getData } from "@/app/utils/fetchData";
import Link from "next/link";

export default async function PetaniPerformance() {
    const data = await getData({ path: "/dashboard/atas" });
    const topFarmers = data?.topFarmers || [];

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full mt-8">
            <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                        <Icon path={mdiTrophy} size={0.8} />
                    </div>
                    Leaderboard Performa Petani
                </h2>
                <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    <Icon path={mdiAccountGroup} size={0.5} />
                    Mitra Teraktif
                </div>
            </div>

            <div className="flex-grow divide-y divide-gray-50 overflow-y-auto custom-scrollbar">
                {topFarmers && topFarmers.length > 0 ? (
                    topFarmers.map((farmer: any, index: number) => (
                        <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${index === 0 ? "bg-yellow-400 text-white" :
                                            index === 1 ? "bg-gray-300 text-white" :
                                                index === 2 ? "bg-orange-300 text-white" :
                                                    "bg-gray-100 text-gray-400"
                                        }`}>
                                        {farmer.rank}
                                    </div>
                                    {index < 3 && (
                                        <div className="absolute -top-1 -right-1">
                                            <Icon path={mdiTrophy} size={0.4} className={
                                                index === 0 ? "text-yellow-600" :
                                                    index === 1 ? "text-gray-500" :
                                                        "text-orange-600"
                                            } />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{farmer.nama}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-medium tracking-tight">Mitra Petani Cocobase</p>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-6">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 text-[#00B69B]">
                                        <Icon path={mdiWeightKilogram} size={0.5} />
                                        <span className="font-black text-sm">{farmer.totalWeight.toFixed(1)}</span>
                                    </div>
                                    <p className="text-[9px] text-gray-400 uppercase italic">kg Total</p>
                                </div>
                                <div className="flex flex-col items-end border-l pl-4 border-gray-100">
                                    <div className="flex items-center gap-1 text-blue-600">
                                        <Icon path={mdiPackageVariantClosed} size={0.5} />
                                        <span className="font-black text-sm">{farmer.totalPacking}</span>
                                    </div>
                                    <p className="text-[9px] text-gray-400 uppercase italic">Packing</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-10 text-center text-gray-400 italic text-sm">
                        Belum ada data performa petani.
                    </div>
                )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <Link href="/admin/petani" className="text-[10px] font-bold text-[#00B69B] uppercase tracking-widest hover:underline">
                    Lihat Semua Statistik Petani
                </Link>
            </div>
        </div>
    );
}

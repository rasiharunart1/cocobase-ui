"use client";

import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiTrophy, mdiMedal, mdiChevronRight } from "@mdi/js";
import Link from "next/link";

interface FarmerRank {
    rank: number;
    nama: string;
    totalWeight: number;
    totalPacking: number;
}

export default function TopFarmersWidget() {
    const [topFarmers, setTopFarmers] = useState<FarmerRank[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopFarmers();
    }, []);

    const fetchTopFarmers = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
                cache: "no-store",
                credentials: "include",  // Include cookies for authentication
            });
            const data = await res.json();
            if (data.success && data.data.topFarmers) {
                setTopFarmers(data.data.topFarmers);
            }
        } catch (error) {
            console.error("Failed to fetch top farmers:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return "text-yellow-500";
        if (rank === 2) return "text-gray-400";
        if (rank === 3) return "text-orange-400";
        return "text-gray-300";
    };

    const getRankBg = (rank: number) => {
        if (rank === 1) return "bg-yellow-50 border-yellow-200";
        if (rank === 2) return "bg-gray-50 border-gray-200";
        if (rank === 3) return "bg-orange-50 border-orange-200";
        return "bg-white border-gray-100";
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6">
                <div className="flex items-center gap-3">
                    <Icon path={mdiTrophy} size={1.5} className="text-white" />
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-wide">
                            Top Farmers
                        </h3>
                        <p className="text-white/80 text-xs font-medium">
                            Ranked by verified packing weight
                        </p>
                    </div>
                </div>
            </div>

            {/* Rankings */}
            <div className="p-4 space-y-2">
                {topFarmers.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <Icon path={mdiTrophy} size={2} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No verified packing data yet</p>
                    </div>
                ) : (
                    topFarmers.map((farmer) => (
                        <div
                            key={farmer.rank}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:shadow-md ${getRankBg(
                                farmer.rank
                            )}`}
                        >
                            {/* Rank Medal */}
                            <div className="flex-shrink-0">
                                {farmer.rank <= 3 ? (
                                    <Icon
                                        path={mdiMedal}
                                        size={1.5}
                                        className={getRankColor(farmer.rank)}
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-lg font-black text-gray-400">
                                            {farmer.rank}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Farmer Info */}
                            <div className="flex-grow min-w-0">
                                <h4 className="font-bold text-gray-800 truncate">
                                    {farmer.nama}
                                </h4>
                                <p className="text-xs text-gray-500">
                                    {farmer.totalPacking} packs
                                </p>
                            </div>

                            {/* Weight */}
                            <div className="text-right flex-shrink-0">
                                <div className="font-black text-lg text-blue-600">
                                    {farmer.totalWeight.toFixed(1)}
                                </div>
                                <div className="text-[10px] text-gray-400 uppercase font-bold">
                                    KG
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* View All Link */}
            {topFarmers.length > 0 && (
                <div className="border-t border-gray-100 p-4">
                    <Link
                        href="/admin/leaderboard"
                        className="flex items-center justify-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors group"
                    >
                        View Full Leaderboard
                        <Icon
                            path={mdiChevronRight}
                            size={0.8}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>
            )}
        </div>
    );
}

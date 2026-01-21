"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiMinus, mdiPlus, mdiChatProcessing, mdiCartPlus } from "@mdi/js";
import { toast } from "react-toastify";
import { getData } from "@/app/utils/fetchData";
import { Produk } from "@/app/utils/interface";
import { Skeleton } from "@/app/ui/admin/skeleton/card";
import { Footer, Chat } from "@/app/(main)/HomeView";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string>("");
    const [product, setProduct] = useState<Produk | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const nomorTujuan = 6285727055150;

    useEffect(() => {
        params.then(p => setId(p.id));
    }, [params]);

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const data = await getData({ path: `/produk/${id}` });
                setProduct(data);
                setLoading(false);
            } catch (error) {
                toast.error("Gagal memuat detail produk");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleQuantityChange = (type: "inc" | "dec") => {
        if (type === "inc") setQuantity(q => q + 1);
        else if (type === "dec" && quantity > 1) setQuantity(q => q - 1);
    };

    if (loading) return <div className="p-10"><Skeleton /></div>;
    if (!product) return <div className="p-10 text-center">Produk tidak ditemukan</div>;

    const waLink = `https://api.whatsapp.com/send?phone=${nomorTujuan}&text=Halo%20Admin%20Cocobase!%20Saya%20tertarik%20membeli%20produk%20ini%3A%0A%0A*Nama%20Produk%3A*%20${product.nama}%0A*Harga%3A*%20Rp%20${product.harga?.toLocaleString("id-ID")}%0A*Jumlah%3A*%20${quantity}%0A*Total%3A*%20Rp%20${(product.harga * quantity).toLocaleString("id-ID")}%0A%0AMohon%20informasi%20stok%20dan%20cara%20pemesanannya.%20Terima%20kasih!`;

    return (
        <main className="bg-gray-50 min-h-screen pt-10">
            <Chat />
            <div className="container mx-auto px-4 py-8">
                {/* Product Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row gap-8">
                    {/* Image Column */}
                    <div className="w-full md:w-2/5">
                        <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
                            <Image
                                src={product.gambar}
                                alt={product.nama}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Info Column */}
                    <div className="w-full md:w-3/5 flex flex-col">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-4">{product.nama}</h1>

                        <div className="bg-orange-50/50 p-4 rounded-lg mb-6">
                            <span className="text-3xl font-bold text-[#E37D2E]">
                                Rp {product.harga?.toLocaleString("id-ID")}
                            </span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
                            <span className="w-20">Kuantitas</span>
                            <div className="flex items-center border rounded-md">
                                <button
                                    onClick={() => handleQuantityChange("dec")}
                                    className="p-2 hover:bg-gray-50 border-r"
                                >
                                    <Icon path={mdiMinus} size={0.7} />
                                </button>
                                <input
                                    type="text"
                                    value={quantity}
                                    readOnly
                                    className="w-12 text-center focus:outline-none text-gray-800 font-medium"
                                />
                                <button
                                    onClick={() => handleQuantityChange("inc")}
                                    className="p-2 hover:bg-gray-50 border-l"
                                >
                                    <Icon path={mdiPlus} size={0.7} />
                                </button>
                            </div>
                            <span>Tersedia {product.jumlah} stok</span>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mt-auto">
                            <Link
                                href={waLink}
                                target="_blank"
                                className="flex items-center gap-2 border-2 border-[#E37D2E] text-[#E37D2E] px-6 py-3 rounded-md font-semibold hover:bg-orange-50 transition"
                            >
                                <Icon path={mdiChatProcessing} size={0.8} />
                                Chat Sekarang
                            </Link>
                            <Link
                                href={waLink}
                                target="_blank"
                                className="flex items-center gap-2 bg-[#E37D2E] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#c47438] transition shadow-lg shadow-orange-100"
                            >
                                <Icon path={mdiCartPlus} size={0.8} />
                                Beli Sekarang
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider bg-gray-50 p-3 -mx-6 -mt-6 rounded-t-lg">Deskripsi Produk</h2>
                    <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {product.deskripsi}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

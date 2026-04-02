"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Icon from "@mdi/react";
import { mdiPlus, mdiPencil, mdiDelete, mdiContentCopy } from "@mdi/js";
import {
    fetchDevicesAction,
    createDeviceAction,
    updateDeviceAction,
    deleteDeviceAction,
} from "./actions";

export default function DeviceManagement() {
    const [devices, setDevices] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDevice, setCurrentDevice] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", threshold: 10, relayThreshold: 10 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const result = await fetchDevicesAction();
            if (result.success) {
                setDevices(result.data);
            } else {
                toast.error("Gagal memuat daftar perangkat");
            }
        } catch (error) {
            toast.error("Gagal mengambil data perangkat");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = currentDevice
                ? await updateDeviceAction(currentDevice.id, formData)
                : await createDeviceAction(formData);

            if (data.success) {
                toast.success(`Device ${currentDevice ? "diperbarui" : "dibuat"} berhasil`);
                setIsModalOpen(false);
                setFormData({ name: "", threshold: 10, relayThreshold: 10 });
                setCurrentDevice(null);
                fetchDevices();
            } else {
                toast.error(data.message || "Operasi gagal");
            }
        } catch (error) {
            toast.error("Operasi gagal");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus perangkat ini?")) return;
        try {
            const data = await deleteDeviceAction(id);
            if (data.success) {
                toast.success("Perangkat dihapus");
                fetchDevices();
            } else {
                toast.error(data.message || "Gagal menghapus perangkat");
            }
        } catch (error) {
            toast.error("Gagal menghapus perangkat");
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.info("Token berhasil disalin!");
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Manajemen Perangkat</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola perangkat IoT kelompok tani Anda</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentDevice(null);
                        setFormData({ name: "", threshold: 10, relayThreshold: 10 });
                        setIsModalOpen(true);
                    }}
                    className="bg-[#00B69B] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#00947d] transition"
                >
                    <Icon path={mdiPlus} size={1} /> Tambah Perangkat
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">Memuat perangkat...</div>
                ) : devices.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p className="font-medium">Belum ada perangkat</p>
                        <p className="text-sm mt-1">Klik "Tambah Perangkat" untuk mendaftarkan alat baru</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Auth Token (ESP32)</th>
                                <th className="px-6 py-4">Batas Log (kg)</th>
                                <th className="px-6 py-4">Batas Relay (kg)</th>
                                <th className="px-6 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {devices.map((device) => (
                                <tr key={device.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{device.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <code className="bg-gray-100 px-2 py-1 rounded text-xs max-w-[200px] truncate block">
                                                {device.token}
                                            </code>
                                            <button onClick={() => copyToClipboard(device.token)} className="text-gray-400 hover:text-[#00B69B] flex-shrink-0">
                                                <Icon path={mdiContentCopy} size={0.7} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{device.threshold} kg</td>
                                    <td className="px-6 py-4">{device.relayThreshold} kg</td>
                                    <td className="px-6 py-4 flex gap-3">
                                        <button
                                            onClick={() => {
                                                setCurrentDevice(device);
                                                setFormData({ name: device.name, threshold: device.threshold, relayThreshold: device.relayThreshold });
                                                setIsModalOpen(true);
                                            }}
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Edit"
                                        >
                                            <Icon path={mdiPencil} size={0.8} />
                                        </button>
                                        <button onClick={() => handleDelete(device.id)} className="text-red-400 hover:text-red-600" title="Hapus">
                                            <Icon path={mdiDelete} size={0.8} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                        <h2 className="text-xl font-bold mb-4">{currentDevice ? "Edit" : "Tambah"} Perangkat</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Perangkat</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B69B]"
                                    placeholder="cth. Mesin Packing A"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Batas Auto-Log (kg)</label>
                                <input
                                    type="number"
                                    required
                                    step="0.1"
                                    value={formData.threshold}
                                    onChange={(e) => setFormData({ ...formData, threshold: parseFloat(e.target.value) })}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B69B]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Batas Relay Maks (kg)</label>
                                <input
                                    type="number"
                                    required
                                    step="0.1"
                                    value={formData.relayThreshold}
                                    onChange={(e) => setFormData({ ...formData, relayThreshold: parseFloat(e.target.value) })}
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00B69B]"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setIsModalOpen(false); setCurrentDevice(null); }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                >
                                    Batal
                                </button>
                                <button type="submit" className="bg-[#00B69B] text-white px-6 py-2 rounded-md font-medium hover:bg-[#00947d]">
                                    {currentDevice ? "Simpan Perubahan" : "Buat Perangkat"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

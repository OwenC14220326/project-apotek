'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { Button } from "@/components/ui/button";
import { obatAPI } from "@/lib/api";

export default function ObatPage() {
    const [obats, setObats] = useState<any[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        fetchObats();
    }, []);

    const fetchObats = async () => {
        try {
            const data = await obatAPI.getAll();
            setObats(data);
        } catch (error) {
            toast({
                title: "Gagal",
                description: "Gagal memuat data obat",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await obatAPI.delete(id);
            setObats((prev) => prev.filter((obat) => obat.id !== id));
            toast({
                title: "Berhasil",
                description: "Obat berhasil dihapus",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Gagal menghapus obat",
                variant: "destructive",
            });
        }
    };

    return (
        <ProtectedRoute adminOnly>
            <div className="p-5 max-w-6xl mx-auto">
                <div className="mb-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Manajemen Obat</h1>
                    <Button asChild>
                        <Link href="/admin/obat/tambah" className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Tambah Obat
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                    {obats.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">
                            Tidak ada data obat.
                        </p>
                    ) : (
                        obats.map((obat) => (
                            <div
                                key={obat.id}
                                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                            >
                                {obat.foto && (
                                    <div className="aspect-square overflow-hidden w-full bg-gray-100">
                                        <img
                                            src={obat.foto}
                                            alt={obat.nama_obat}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-4 space-y-2">
                                    <h2 className="text-lg font-semibold">{obat.nama_obat}</h2>
                                    <p className="text-sm text-gray-600">Expired: {obat.expired}</p>
                                    <p className="text-sm text-gray-600">Stok: {obat.stok}</p>
                                    <p className="text-sm text-gray-600">Harga: Rp {obat.harga}</p>
                                    <div className="flex gap-2 pt-2">
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(obat.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/admin/obat/edit/${obat.id}`}>
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

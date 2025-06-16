'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { obatAPI } from '@/lib/api';

export default function EditObatPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        nama_obat: '',
        stok: '',
        harga: '',
        deskripsi: '',
        foto: '',
        expired: ''
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchObat = async () => {
            try {
                const data = await obatAPI.getById(params.id);
                setFormData({
                    nama_obat: data.nama_obat || '',
                    stok: data.stok || '',
                    harga: data.harga?.toString() || '',
                    deskripsi: data.deskripsi || '',
                    foto: data.foto || '',
                    expired: data.expired || ''
                });
            } catch (error) {
                toast({
                    title: 'Gagal',
                    description: 'Gagal memuat data obat',
                    variant: 'destructive',
                });
                router.push('/admin/obat');
            } finally {
                setIsLoading(false);
            }
        };

        fetchObat();
    }, [params.id, router, toast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await obatAPI.update(params.id, {
                ...formData,
                harga: parseInt(formData.harga) || 0
            });
            toast({ title: 'Berhasil', description: 'Obat berhasil diperbarui' });
            router.push('/admin/obat');
        } catch (error) {
            toast({
                title: 'Gagal',
                description: 'Gagal memperbarui obat',
                variant: 'destructive'
            });
        }
    };

    if (isLoading) return <p className="text-center mt-10">Memuat data...</p>;

    return (
        <ProtectedRoute adminOnly>
            <div className="max-w-xl mx-auto p-5">
                <h1 className="text-xl font-bold mb-4">Edit Obat</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="nama_obat"
                        placeholder="Nama Obat"
                        value={formData.nama_obat}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="stok"
                        placeholder="Stok"
                        value={formData.stok}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="number"
                        name="harga"
                        placeholder="Harga"
                        value={formData.harga}
                        onChange={handleChange}
                        required
                    />
                    <Textarea
                        name="deskripsi"
                        placeholder="Deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        name="foto"
                        placeholder="Link Foto"
                        value={formData.foto}
                        onChange={handleChange}
                    />
                    <Input
                        type="date"
                        name="expired"
                        value={formData.expired}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit">Simpan Perubahan</Button>
                </form>
            </div>
        </ProtectedRoute>
    );
}

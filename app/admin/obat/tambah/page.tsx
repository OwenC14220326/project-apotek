'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { obatAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function TambahObatPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        nama_obat: '',
        stok: '',
        harga: '',
        deskripsi: '',
        foto: '',
        expired: '', // ✅ tambahkan ini
    });


    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'harga' ? value : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await obatAPI.create({
                ...formData,
                harga: parseInt(formData.harga) || 0,
                expired: formData.expired
            });

            toast({ title: 'Sukses', description: 'Obat berhasil ditambahkan' });
            router.push('/admin/obat');
        } catch (error) {
            toast({
                title: 'Gagal',
                description: 'Gagal menambahkan obat',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute adminOnly>
            <div className="max-w-xl mx-auto p-5">
                <h1 className="text-xl font-bold mb-4">Tambah Obat Baru</h1>
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
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                </form>
            </div>
        </ProtectedRoute>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { obatAPI } from '@/lib/api';
import { Pill, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ObatData {
    id_obat: number;
    nama_obat: string;
    stok: string;
    harga: number;
    deskripsi: string;
    foto: string;
}

export default function EditObatPage({ params }: { params: { id: string } }) {
    const [formData, setFormData] = useState({
        nama_obat: '',
        stok: 'Tersedia',
        harga: 0,
        deskripsi: '',
        foto: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState('');

    const router = useRouter();
    const { toast } = useToast();
    const obatId = parseInt(params.id);

    useEffect(() => {
        fetchObat();
    }, [obatId]);

    const fetchObat = async () => {
        try {
            const obat = await obatAPI.getById(obatId);
            setFormData({
                nama_obat: obat.nama_obat,
                stok: obat.stok,
                harga: obat.harga,
                deskripsi: obat.deskripsi,
                foto: obat.foto || ''
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Gagal memuat data obat",
                variant: "destructive",
            });
            router.push('/admin/obat');
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await obatAPI.update(obatId, formData);

            toast({
                title: "Berhasil",
                description: "Data obat berhasil diperbarui",
            });

            router.push('/admin/obat');
        } catch (error) {
            setError('Gagal memperbarui data obat');
            toast({
                title: "Error",
                description: "Gagal memperbarui data obat",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'harga' ? parseInt(value) || 0 : value
        });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/admin/obat">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Kembali
                                </Link>
                            </Button>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Pill className="h-8 w-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-900">Edit Obat</h1>
                        </div>
                        <p className="text-gray-600 mt-2">
                            Perbarui informasi obat di bawah ini
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Obat</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_obat">Nama Obat</Label>
                                    <Input
                                        id="nama_obat"
                                        name="nama_obat"
                                        type="text"
                                        placeholder="Masukkan nama obat"
                                        value={formData.nama_obat}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stok">Status Stok</Label>
                                    <select
                                        id="stok"
                                        name="stok"
                                        value={formData.stok}
                                        onChange={handleSelectChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="Tersedia">Tersedia</option>
                                        <option value="Habis">Habis</option>
                                        <option value="Terbatas">Terbatas</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="harga">Harga (Rp)</Label>
                                    <Input
                                        id="harga"
                                        name="harga"
                                        type="number"
                                        placeholder="Masukkan harga obat"
                                        value={formData.harga}
                                        onChange={handleInputChange}
                                        required
                                        min="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deskripsi">Deskripsi</Label>
                                    <Textarea
                                        id="deskripsi"
                                        name="deskripsi"
                                        placeholder="Masukkan deskripsi obat"
                                        value={formData.deskripsi}
                                        onChange={handleInputChange}
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="foto">URL Foto</Label>
                                    <Input
                                        id="foto"
                                        name="foto"
                                        type="text"
                                        placeholder="Masukkan URL foto obat"
                                        value={formData.foto}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex space-x-4 pt-4">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/admin/obat">Batal</Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}
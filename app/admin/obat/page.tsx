'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { obatAPI } from '@/lib/api';
import { Pill, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface ObatData {
    id_obat: number;
    nama_obat: string;
    stok: string;
    harga: number;
    deskripsi: string;
    foto: string;
}

export default function ObatPage() {
    const [obat, setObat] = useState<ObatData[]>([]);
    const [filteredObat, setFilteredObat] = useState<ObatData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchObat();
    }, []);

    useEffect(() => {
        const filtered = obat.filter(item =>
            item.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredObat(filtered);
    }, [obat, searchTerm]);

    const fetchObat = async () => {
        try {
            const data = await obatAPI.getAll();
            setObat(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Gagal memuat data obat",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await obatAPI.delete(id);
            setObat(obat.filter(item => item.id_obat !== id));
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <Pill className="h-8 w-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-900">Kelola Obat</h1>
                        </div>
                        <p className="text-gray-600">
                            Manage database obat dan informasi kesehatan
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                <CardTitle>Daftar Obat ({filteredObat.length})</CardTitle>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Cari obat..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 w-full sm:w-64"
                                        />
                                    </div>
                                    <Button asChild>
                                        <Link href="/admin/obat/tambah" className="flex items-center">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Tambah Obat
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {filteredObat.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredObat.map((item) => (
                                        <Card key={item.id_obat} className="hover:shadow-lg transition-shadow">
                                            <div className="relative h-48 w-full">
                                                <Image
                                                    src={item.foto || '/placeholder-drug.jpg'}
                                                    alt={item.nama_obat}
                                                    fill
                                                    className="object-cover rounded-t-lg"
                                                />
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="flex justify-between items-start">
                                                    <span>{item.nama_obat}</span>
                                                    <span className="text-green-600">Rp {item.harga.toLocaleString()}</span>
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2">
                                                    {item.deskripsi}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex justify-between items-center">
                                                    <Badge variant={item.stok === 'Tersedia' ? 'default' : 'destructive'}>
                                                        {item.stok}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex justify-end space-x-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/obat/edit/${item.id_obat}`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Apakah Anda yakin ingin menghapus obat "{item.nama_obat}"?
                                                                Tindakan ini tidak dapat dibatalkan.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(item.id_obat)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Hapus
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        {searchTerm ? 'Obat tidak ditemukan' : 'Belum ada obat'}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {searchTerm
                                            ? 'Coba ubah kata kunci pencarian Anda.'
                                            : 'Mulai dengan menambahkan obat baru ke database.'
                                        }
                                    </p>
                                    {!searchTerm && (
                                        <Button asChild>
                                            <Link href="/admin/obat/tambah">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Tambah Obat Pertama
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}
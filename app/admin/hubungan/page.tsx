'use client';

import React from 'react'; 
import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { Plus, Trash2, Link2 } from 'lucide-react';
import { obatAPI, penyakitAPI, obatPenyakitAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function HubunganPage() {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [penyakit, obat, relasi] = await Promise.all([
                penyakitAPI.getAll(),
                obatAPI.getAll(),
                obatPenyakitAPI.getAll(),
            ]);

            const merged = relasi.map((r: any) => {
                const p = penyakit.find((x: any) => x.id === r.id_penyakit);
                const o = obat.find((x: any) => x.id === r.id_obat);
                return { ...r, penyakit: p?.nama_penyakit, obat: o?.nama_obat };
            });

            setData(merged);
        } catch (err) {
            toast({ title: 'Error', description: 'Gagal memuat data hubungan', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await obatPenyakitAPI.delete(id);
            setData((prev) => prev.filter((d) => d.id !== id));
            toast({ title: 'Berhasil', description: 'Relasi berhasil dihapus' });
        } catch {
            toast({ title: 'Error', description: 'Gagal menghapus relasi', variant: 'destructive' });
        }
    };

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                            <Link2 className="h-6 w-6 text-indigo-600" />
                            <span>Hubungan Obat & Penyakit</span>
                        </h1>
                        <Button asChild>
                            <Link href="/admin/hubungan/tambah">
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Hubungan
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Hubungan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Penyakit</TableHead>
                                        <TableHead>Obat</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.penyakit}</TableCell>
                                            <TableCell>{item.obat}</TableCell>
                                            <TableCell className="text-right">
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="text-red-600">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Hapus Hubungan</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Anda yakin ingin menghapus hubungan ini? Tindakan ini tidak dapat dibatalkan.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600">
                                                                Hapus
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {data.length === 0 && (
                                <div className="text-center text-gray-500 py-8">Belum ada hubungan yang ditambahkan.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}

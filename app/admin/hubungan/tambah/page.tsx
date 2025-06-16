'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { obatAPI, penyakitAPI, obatPenyakitAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Link2 } from 'lucide-react';
import type { Obat } from '@/lib/api';
import type { Penyakit } from '@/lib/api';



export default function TambahHubunganPage() {
    const [obatList, setObatList] = useState<Obat[]>([]);
    const [penyakitList, setPenyakitList] = useState<Penyakit[]>([]);
    const [idObat, setIdObat] = useState('');
    const [idPenyakit, setIdPenyakit] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            setObatList(await obatAPI.getAll());
            setPenyakitList(await penyakitAPI.getAll());
        })();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await obatPenyakitAPI.create({ id_obat: idObat, id_penyakit: idPenyakit });
            toast({ title: 'Berhasil', description: 'Hubungan berhasil ditambahkan' });
            router.push('/admin/hubungan');
        } catch (err) {
            toast({ title: 'Gagal', description: 'Gagal menambahkan hubungan', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-xl mx-auto">
                    <div className="mb-6">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/hubungan">
                                <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Hubungan Obat & Penyakit</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Pilih Penyakit</Label>
                                    <Select onValueChange={(val) => setIdPenyakit(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih penyakit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {penyakitList.map((p: any) => (
                                                <SelectItem key={p.id} value={p.id}>{p.nama_penyakit}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Pilih Obat</Label>
                                    <Select onValueChange={(val) => setIdObat(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih obat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {obatList.map((o: any) => (
                                                <SelectItem key={o.id} value={o.id}>{o.nama_obat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Menyimpan...' : 'Tambah Hubungan'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}

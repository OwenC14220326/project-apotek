'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { penyakitAPI, Penyakit } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function PenyakitPage() {
  const [penyakit, setPenyakit] = useState<Penyakit[]>([]);
  const [filteredPenyakit, setFilteredPenyakit] = useState<Penyakit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchPenyakit();
  }, []);

  useEffect(() => {
    const filtered = penyakit.filter((item) =>
      item.nama_penyakit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPenyakit(filtered);
  }, [penyakit, searchTerm]);

  const fetchPenyakit = async () => {
    try {
      const data = await penyakitAPI.getAll();
      setPenyakit(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data penyakit',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await penyakitAPI.delete(id);
      setPenyakit((prev) => prev.filter((p) => p.id !== id));
      toast({ title: 'Berhasil', description: 'Penyakit berhasil dihapus' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus penyakit',
        variant: 'destructive',
      });
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">Kelola Penyakit</h1>
            </div>
            <p className="text-gray-600">
              Manage database penyakit dan informasi kesehatan
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari penyakit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button asChild>
              <Link href="/admin/penyakit/tambah" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Penyakit
              </Link>
            </Button>
          </div>

          {filteredPenyakit.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Penyakit</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Jumlah Gejala</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPenyakit.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-600" />
                          <span>{item.nama_penyakit}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="line-clamp-2">{item.deskripsi}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {item.gejala?.length || 0} gejala
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/penyakit/edit/${item.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus penyakit "
                                  {item.nama_penyakit}"? Tindakan ini tidak dapat
                                  dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Penyakit tidak ditemukan' : 'Belum ada penyakit'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? 'Coba ubah kata kunci pencarian Anda.'
                  : 'Mulai dengan menambahkan penyakit baru ke database.'}
              </p>
              {!searchTerm && (
                <Button asChild>
                  <Link href="/admin/penyakit/tambah">
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Penyakit Pertama
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

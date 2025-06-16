'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { penyakitAPI } from '@/lib/api';
import { Heart, Plus, Search, Edit, Trash2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PenyakitData {
  id_penyakit: number;
  nama_penyakit: string;
  deskripsi: string;
  gejala: string[];
  pencegahan: string;
}

export default function PenyakitPage() {
  const [penyakit, setPenyakit] = useState<PenyakitData[]>([]);
  const [filteredPenyakit, setFilteredPenyakit] = useState<PenyakitData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPenyakit();
  }, []);

  useEffect(() => {
    const filtered = penyakit.filter(item =>
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
        title: "Error",
        description: "Gagal memuat data penyakit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await penyakitAPI.delete(id);
      setPenyakit(penyakit.filter(item => item.id_penyakit !== id));
      toast({
        title: "Berhasil",
        description: "Penyakit berhasil dihapus",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus penyakit",
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
              <Heart className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">Kelola Penyakit</h1>
            </div>
            <p className="text-gray-600">
              Manage database penyakit dan informasi kesehatan
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <CardTitle>Daftar Penyakit ({filteredPenyakit.length})</CardTitle>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari penyakit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Button asChild>
                    <Link href="/admin/penyakit/tambah" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Penyakit
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                        <TableRow key={item.id_penyakit}>
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
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link href={`/admin/penyakit/edit/${item.id_penyakit}`}>
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
                                      Apakah Anda yakin ingin menghapus penyakit "{item.nama_penyakit}"? 
                                      Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(item.id_penyakit)}
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
                      : 'Mulai dengan menambahkan penyakit baru ke database.'
                    }
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
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { userAPI, UserData } from '@/lib/api';
import { UserCog, ArrowLeft, Mail, User, Lock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EditPenggunaPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<{
    nama: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
  }>({
    nama: '',
    email: '',
    password: '',
    role: 'user'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();
  const { toast } = useToast();
  const userId = params.id;

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const user = await userAPI.getById(userId);
      setFormData({
        nama: user.nama,
        email: user.email,
        password: '',
        role: user.role as 'admin' | 'user',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data pengguna',
        variant: 'destructive',
      });
      router.push('/admin/pengguna');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const updateData: Partial<UserData> = {
        nama: formData.nama,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await userAPI.update(userId, updateData);

      toast({
        title: 'Berhasil',
        description: 'Data pengguna berhasil diperbarui',
      });

      router.push('/admin/pengguna');
    } catch (error) {
      setError('Gagal memperbarui data pengguna');
      toast({
        title: 'Error',
        description: 'Gagal memperbarui data pengguna',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
                <Link href="/admin/pengguna">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Link>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <UserCog className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Edit Pengguna</h1>
            </div>
            <p className="text-gray-600 mt-2">Perbarui informasi pengguna di bawah ini</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="nama"
                      name="nama"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.nama}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="contoh@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password Baru (Opsional)</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Kosongkan jika tidak ingin mengubah password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10"
                      minLength={6}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Kosongkan field ini jika tidak ingin mengubah password
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role Pengguna</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value as 'user' | 'admin' })
                    }
                  >
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Pilih role pengguna" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          User - Pengguna biasa
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Admin - Administrator sistem
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Link href="/admin/pengguna">Batal</Link>
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

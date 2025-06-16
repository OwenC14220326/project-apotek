'use client';

import { ProtectedRoute } from '@/components/layout/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { userAPI, obatAPI, penyakitAPI } from '@/lib/api';
import { 
  Users, 
  Pill, 
  Heart, 
  BarChart3, 
  TrendingUp, 
  Activity,
  Shield,
  Clock
} from 'lucide-react';

export default function AdminHomePage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalObat: 0,
    totalPenyakit: 0,
    lowStockObat: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [users, obat, penyakit] = await Promise.all([
          userAPI.getAll(),
          obatAPI.getAll(),
          penyakitAPI.getAll()
        ]);

        const lowStock = obat.filter((item: any) => item.stok < 10).length;

        setStats({
          totalUsers: users.length,
          totalObat: obat.length,
          totalPenyakit: penyakit.length,
          lowStockObat: lowStock
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

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
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Panel Admin</h1>
            </div>
            <p className="text-gray-600">
              Kelola sistem apotek digital Anda dengan mudah dan efisien
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                <Users className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-blue-100">
                  Pengguna terdaftar
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Obat</CardTitle>
                <Pill className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalObat}</div>
                <p className="text-xs text-green-100">
                  Jenis obat tersedia
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Penyakit</CardTitle>
                <Heart className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPenyakit}</div>
                <p className="text-xs text-purple-100">
                  Database penyakit
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
                <TrendingUp className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lowStockObat}</div>
                <p className="text-xs text-orange-100">
                  Obat perlu restok
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Kelola Pengguna</CardTitle>
                    <CardDescription>
                      Tambah, edit, dan hapus pengguna sistem
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button asChild size="sm">
                    <Link href="/admin/pengguna">Lihat Semua</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/pengguna/tambah">Tambah Baru</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Pill className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Kelola Obat</CardTitle>
                    <CardDescription>
                      Manage inventory obat dan stok
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button asChild size="sm">
                    <Link href="/admin/obat">Lihat Semua</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/obat/tambah">Tambah Baru</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Kelola Penyakit</CardTitle>
                    <CardDescription>
                      Database penyakit dan gejalanya
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button asChild size="sm">
                    <Link href="/admin/penyakit">Lihat Semua</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/penyakit/tambah">Tambah Baru</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle>Relasi Obat-Penyakit</CardTitle>
                    <CardDescription>
                      Atur hubungan obat dan penyakit
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm">
                  <Link href="/admin/hubungan">Kelola Relasi</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
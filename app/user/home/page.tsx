'use client';

import { ProtectedRoute } from '@/components/layout/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { obatAPI, penyakitAPI } from '@/lib/api';
import { 
  Pill, 
  Heart, 
  Search, 
  Stethoscope,
  Activity,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

export default function UserHomePage() {
  const [stats, setStats] = useState({
    totalObat: 0,
    totalPenyakit: 0,
    availableStock: 0
  });
  const [recentObat, setRecentObat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [obat, penyakit] = await Promise.all([
          obatAPI.getAll(),
          penyakitAPI.getAll()
        ]);

        const availableStock = obat.filter((item: any) => item.stok > 0).length;
        setRecentObat(obat.slice(0, 3));

        setStats({
          totalObat: obat.length,
          totalPenyakit: penyakit.length,
          availableStock
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Pengguna</h1>
            </div>
            <p className="text-gray-600">
              Temukan informasi obat dan penyakit dengan mudah dan cepat
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Obat</CardTitle>
                <Pill className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalObat}</div>
                <p className="text-xs text-blue-100">
                  Jenis obat tersedia
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stok Tersedia</CardTitle>
                <TrendingUp className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.availableStock}</div>
                <p className="text-xs text-green-100">
                  Obat ready stock
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Penyakit</CardTitle>
                <Heart className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPenyakit}</div>
                <p className="text-xs text-purple-100">
                  Informasi penyakit
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Pill className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Lihat Obat</CardTitle>
                    <CardDescription>
                      Jelajahi katalog obat lengkap dengan informasi stok dan harga
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/user/lihat-obat" className="flex items-center justify-center">
                    <Search className="h-4 w-4 mr-2" />
                    Jelajahi Obat
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Lihat Penyakit</CardTitle>
                    <CardDescription>
                      Cari informasi penyakit dan rekomendasi obat yang tepat
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/user/lihat-penyakit" className="flex items-center justify-center">
                    <Search className="h-4 w-4 mr-2" />
                    Cari Penyakit
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Medicines */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>Obat Populer</span>
                  </CardTitle>
                  <CardDescription>
                    Obat-obatan yang sering dicari
                  </CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/user/lihat-obat">Lihat Semua</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {recentObat.map((obat: any) => (
                  <Card key={obat.id_obat} className="border-2 hover:border-blue-200 transition-colors">
                    <CardContent className="p-4">
                      <img
                        src={obat.foto}
                        alt={obat.nama_obat}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-lg mb-2">{obat.nama_obat}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {obat.deskripsi}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-blue-600">
                          Rp {obat.harga.toLocaleString('id-ID')}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          obat.stok > 10 
                            ? 'bg-green-100 text-green-800' 
                            : obat.stok > 0 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          Stok: {obat.stok}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-cyan-600" />
                  <CardTitle className="text-cyan-800">Tips Kesehatan</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-cyan-700">
                  <li>• Selalu konsultasi dengan dokter sebelum mengonsumsi obat</li>
                  <li>• Perhatikan tanggal kadaluarsa obat</li>
                  <li>• Simpan obat di tempat yang sejuk dan kering</li>
                  <li>• Jangan berbagi obat dengan orang lain</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-green-800">Jam Operasional</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex justify-between">
                    <span>Senin - Jumat</span>
                    <span>08:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sabtu</span>
                    <span>08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minggu</span>
                    <span>10:00 - 16:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { obatAPI } from '@/lib/api';
import { Pill, Search, Filter, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Obat {
  id_obat: number;
  nama_obat: string;
  stok: number;
  harga: number;
  deskripsi: string;
  foto: string;
  kategori: string;
  expired: string;
}

export default function LihatObatPage() {
  const [obat, setObat] = useState<Obat[]>([]);
  const [filteredObat, setFilteredObat] = useState<Obat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchObat();
  }, []);

  useEffect(() => {
    filterObat();
  }, [obat, searchTerm, selectedCategory, stockFilter]);

  const fetchObat = async () => {
    try {
      const data = await obatAPI.getAll();
      setObat(data);
    } catch (error) {
      console.error('Error fetching obat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterObat = () => {
    let filtered = obat;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.kategori === selectedCategory);
    }

    // Filter by stock status
    if (stockFilter === 'available') {
      filtered = filtered.filter(item => item.stok > 0);
    } else if (stockFilter === 'low') {
      filtered = filtered.filter(item => item.stok > 0 && item.stok <= 10);
    } else if (stockFilter === 'empty') {
      filtered = filtered.filter(item => item.stok === 0);
    }

    setFilteredObat(filtered);
  };

  const getStockStatus = (stok: number) => {
    if (stok === 0) return { label: 'Habis', color: 'bg-red-100 text-red-800', icon: XCircle };
    if (stok <= 10) return { label: 'Stok Rendah', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    return { label: 'Tersedia', color: 'bg-green-100 text-green-800', icon: CheckCircle };
  };

  const categories = [...new Set(obat.map(item => item.kategori))];

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
              <Pill className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Katalog Obat</h1>
            </div>
            <p className="text-gray-600">
              Jelajahi koleksi obat lengkap dengan informasi stok dan harga terkini
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filter & Pencarian</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari nama obat, kategori, atau deskripsi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status Stok" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Stok</SelectItem>
                    <SelectItem value="available">Tersedia</SelectItem>
                    <SelectItem value="low">Stok Rendah</SelectItem>
                    <SelectItem value="empty">Habis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              Menampilkan {filteredObat.length} obat dari {obat.length} total obat
            </p>
          </div>

          {/* Medicine Grid */}
          {filteredObat.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredObat.map((item) => {
                const stockStatus = getStockStatus(item.stok);
                const StatusIcon = stockStatus.icon;
                
                return (
                  <Card key={item.id_obat} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <img
                        src={item.foto}
                        alt={item.nama_obat}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg leading-tight">
                            {item.nama_obat}
                          </h3>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {item.kategori}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.deskripsi}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-blue-600">
                              Rp {item.harga.toLocaleString('id-ID')}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${stockStatus.color}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span>{stockStatus.label}</span>
                            </div>
                            <span className="text-sm text-gray-600">
                              Stok: {item.stok}
                            </span>
                          </div>

                          <div className="text-xs text-gray-500">
                            Exp: {new Date(item.expired).toLocaleDateString('id-ID')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || selectedCategory !== 'all' || stockFilter !== 'all' 
                    ? 'Obat tidak ditemukan' 
                    : 'Belum ada obat'
                  }
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedCategory !== 'all' || stockFilter !== 'all'
                    ? 'Coba ubah filter pencarian Anda atau gunakan kata kunci yang berbeda.'
                    : 'Belum ada obat yang tersedia dalam sistem.'
                  }
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setStockFilter('all');
                  }}
                  variant="outline"
                >
                  Reset Filter
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
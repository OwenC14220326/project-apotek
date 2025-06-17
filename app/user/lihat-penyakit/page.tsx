'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { penyakitAPI, obatAPI, obatPenyakitAPI, Obat, Penyakit } from '@/lib/api';
import { Heart, Search, Pill, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface PenyakitWithObat extends Penyakit {
  obat: Obat[];
}

export default function LihatPenyakitPage() {
  const [penyakit, setPenyakit] = useState<PenyakitWithObat[]>([]);
  const [filteredPenyakit, setFilteredPenyakit] = useState<PenyakitWithObat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = penyakit.filter(item =>
      item.nama_penyakit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gejala?.some(gejala => gejala.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPenyakit(filtered);
  }, [penyakit, searchTerm]);

  const fetchData = async () => {
    try {
      const [penyakitData, obatData, relationsData] = await Promise.all([
        penyakitAPI.getAll(),
        obatAPI.getAll(),
        obatPenyakitAPI.getAll()
      ]);

      const penyakitWithObat = penyakitData.map((p: Penyakit) => {
        const relatedObatIds = relationsData
          .filter((rel: any) => rel.id_penyakit === p.id)
          .map((rel: any) => rel.id_obat);

        const relatedObat = obatData.filter((o: Obat) => relatedObatIds.includes(o.id))

        return {
          ...p,
          obat: relatedObat
        };
      });

      setPenyakit(penyakitWithObat);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (stok: number) => {
    if (stok === 0) return { label: 'Habis', color: 'text-red-600', icon: AlertCircle };
    if (stok <= 10) return { label: 'Stok Rendah', color: 'text-yellow-600', icon: AlertCircle };
    return { label: 'Tersedia', color: 'text-green-600', icon: CheckCircle };
  };

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">Database Penyakit</h1>
            </div>
            <p className="text-gray-600">
              Temukan informasi lengkap tentang penyakit dan rekomendasi obat yang tepat
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari penyakit berdasarkan nama, gejala, atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="mb-4">
            <p className="text-gray-600">
              Menampilkan {filteredPenyakit.length} penyakit dari {penyakit.length} total penyakit
            </p>
          </div>

          {filteredPenyakit.length > 0 ? (
            <div className="space-y-4">
              {filteredPenyakit.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-red-700 mb-2">
                          {item.nama_penyakit}
                        </CardTitle>
                        <p className="text-gray-600">{item.deskripsi}</p>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {item.obat.length} Obat
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="details">
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center space-x-2">
                            <Info className="h-4 w-4" />
                            <span>Lihat Detail & Rekomendasi Obat</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-6">
                            {/* Symptoms */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Gejala:</h4>
                              <div className="flex flex-wrap gap-2">
                                {item.gejala?.map((gejala, index) => (
                                  <Badge key={index} variant="secondary">
                                    {gejala}
                                  </Badge>
                                ))}

                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Pencegahan:</h4>
                              <p className="text-gray-600">{item.pencegahan}</p>
                            </div>

                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                <Pill className="h-4 w-4" />
                                <span>Obat yang Direkomendasikan:</span>
                              </h4>

                              {item.obat.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-4">
                                  {item.obat.map((obat) => {
                                    const stockStatus = getStockStatus(parseInt(obat.stok));
                                    const StatusIcon = stockStatus.icon;

                                    return (
                                      <Card key={obat.id} className="border-2 hover:border-blue-200 transition-colors">
                                        <CardContent className="p-4">
                                          <div className="flex space-x-3">
                                            <img
                                              src={obat.foto}
                                              alt={obat.nama_obat}
                                              className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                              <h5 className="font-semibold text-sm mb-1">
                                                {obat.nama_obat}
                                              </h5>
                                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                {obat.deskripsi}
                                              </p>
                                              <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-blue-600">
                                                  Rp {obat.harga.toLocaleString('id-ID')}
                                                </span>
                                                <div className={`flex items-center space-x-1 text-xs ${stockStatus.color}`}>
                                                  <StatusIcon className="h-3 w-3" />
                                                  <span>Stok: {obat.stok}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <Pill className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                  <p>Belum ada obat yang direkomendasikan untuk penyakit ini</p>
                                </div>
                              )}
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div className="text-sm text-yellow-800">
                                  <strong>Penting:</strong> Informasi ini hanya untuk referensi.
                                  Selalu konsultasi dengan dokter atau apoteker sebelum menggunakan obat.
                                  Penggunaan obat harus sesuai dengan resep dan petunjuk medis yang tepat.
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Penyakit tidak ditemukan' : 'Belum ada data penyakit'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm
                    ? 'Coba gunakan kata kunci yang berbeda atau lebih spesifik.'
                    : 'Belum ada data penyakit yang tersedia dalam sistem.'
                  }
                </p>
                {searchTerm && (
                  <Button onClick={() => setSearchTerm('')} variant="outline">
                    Reset Pencarian
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
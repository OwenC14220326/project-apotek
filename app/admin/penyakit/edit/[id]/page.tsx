'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { penyakitAPI } from '@/lib/api';
import { Heart, ArrowLeft, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PenyakitData {
  id_penyakit: number;
  nama_penyakit: string;
  deskripsi: string;
  gejala: string[];
  pencegahan: string;
}

export default function EditPenyakitPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    nama_penyakit: '',
    deskripsi: '',
    pencegahan: ''
  });
  const [gejala, setGejala] = useState<string[]>([]);
  const [newGejala, setNewGejala] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { toast } = useToast();
  const penyakitId = parseInt(params.id);

  useEffect(() => {
    fetchPenyakit();
  }, [penyakitId]);

  const fetchPenyakit = async () => {
    try {
      const penyakit = await penyakitAPI.getById(penyakitId);
      setFormData({
        nama_penyakit: penyakit.nama_penyakit,
        deskripsi: penyakit.deskripsi,
        pencegahan: penyakit.pencegahan
      });
      setGejala(penyakit.gejala || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data penyakit",
        variant: "destructive",
      });
      router.push('/admin/penyakit');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (gejala.length === 0) {
      setError('Minimal tambahkan satu gejala');
      setIsLoading(false);
      return;
    }

    try {
      const updateData = {
        ...formData,
        gejala
      };

      await penyakitAPI.update(penyakitId, updateData);
      
      toast({
        title: "Berhasil",
        description: "Data penyakit berhasil diperbarui",
      });
      
      router.push('/admin/penyakit');
    } catch (error) {
      setError('Gagal memperbarui data penyakit');
      toast({
        title: "Error",
        description: "Gagal memperbarui data penyakit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addGejala = () => {
    if (newGejala.trim() && !gejala.includes(newGejala.trim())) {
      setGejala([...gejala, newGejala.trim()]);
      setNewGejala('');
    }
  };

  const removeGejala = (index: number) => {
    setGejala(gejala.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGejala();
    }
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
                <Link href="/admin/penyakit">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Link>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-red-600" />
              <h1 className="text-3xl font-bold text-gray-900">Edit Penyakit</h1>
            </div>
            <p className="text-gray-600 mt-2">
              Perbarui informasi penyakit di bawah ini
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Penyakit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nama_penyakit">Nama Penyakit</Label>
                  <Input
                    id="nama_penyakit"
                    name="nama_penyakit"
                    type="text"
                    placeholder="Masukkan nama penyakit"
                    value={formData.nama_penyakit}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <Textarea
                    id="deskripsi"
                    name="deskripsi"
                    placeholder="Masukkan deskripsi penyakit"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gejala">Gejala-gejala</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="gejala"
                      type="text"
                      placeholder="Masukkan gejala dan tekan Enter"
                      value={newGejala}
                      onChange={(e) => setNewGejala(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button type="button" onClick={addGejala} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {gejala.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {gejala.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeGejala(index)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pencegahan">Pencegahan</Label>
                  <Textarea
                    id="pencegahan"
                    name="pencegahan"
                    placeholder="Masukkan cara pencegahan penyakit"
                    value={formData.pencegahan}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
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
                    <Link href="/admin/penyakit">Batal</Link>
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
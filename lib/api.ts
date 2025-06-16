// const API_BASE = 'http://localhost:5000';

// // Generic API functions
// export async function fetchData(endpoint: string) {
//   const response = await fetch(`${API_BASE}/${endpoint}`);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch ${endpoint}`);
//   }
//   return response.json();
// }

// export async function createData(endpoint: string, data: any) {
//   const response = await fetch(`${API_BASE}/${endpoint}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     throw new Error(`Failed to create ${endpoint}`);
//   }
//   return response.json();
// }

// export async function updateData(endpoint: string, id: number, data: any) {
//   const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
//   if (!response.ok) {
//     throw new Error(`Failed to update ${endpoint}`);
//   }
//   return response.json();
// }

// export async function deleteData(endpoint: string, id: number) {
//   const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
//     method: 'DELETE',
//   });
//   if (!response.ok) {
//     throw new Error(`Failed to delete ${endpoint}`);
//   }
//   return response.ok;
// }

// // Specific API functions
// export const userAPI = {
//   getAll: () => fetchData('user'),
//   getById: (id: number) => fetchData(`user/${id}`),
//   create: (data: any) => createData('user', data),
//   update: (id: number, data: any) => updateData('user', id, data),
//   delete: (id: number) => deleteData('user', id),
// };

// export const obatAPI = {
//   getAll: () => fetchData('obat'),
//   getById: (id: number) => fetchData(`obat/${id}`),
//   create: (data: any) => createData('obat', data),
//   update: (id: number, data: any) => updateData('obat', id, data),
//   delete: (id: number) => deleteData('obat', id),
// };

// export const penyakitAPI = {
//   getAll: () => fetchData('penyakit'),
//   getById: (id: number) => fetchData(`penyakit/${id}`),
//   create: (data: any) => createData('penyakit', data),
//   update: (id: number, data: any) => updateData('penyakit', id, data),
//   delete: (id: number) => deleteData('penyakit', id),
// };

// export const obatPenyakitAPI = {
//   getAll: () => fetchData('obat_penyakit'),
//   create: (data: any) => createData('obat_penyakit', data),
//   delete: (id: number) => deleteData('obat_penyakit', id),
//   getByPenyakit: async (id_penyakit: number) => {
//     const relations = await fetchData('obat_penyakit');
//     return relations.filter((rel: any) => rel.id_penyakit === id_penyakit);
//   },
//   getByObat: async (id_obat: number) => {
//     const relations = await fetchData('obat_penyakit');
//     return relations.filter((rel: any) => rel.id_obat === id_obat);
//   },
// };


import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase";


// --- TYPES (opsional, tambahkan sesuai kebutuhan)
export interface UserData {
  id?: string;
  nama: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  created_at: string;
}

export interface Obat {
  id?: string;
  nama_obat: string;
  kategori?: string; // ✅ opsional, tidak wajib diisi
  stok: string;
  harga: number;
  deskripsi: string;
  foto: string;
  expired: string;
}


export interface Penyakit {
  id: string; // ❗ ubah dari `id?: string` jika memang selalu tersedia
  nama_penyakit: string;
  deskripsi: string;
  gejala?: string[];
  pencegahan?: string;
}


export interface ObatPenyakit {
  id?: string;
  id_obat: string;
  id_penyakit: string;
}



// --- COLLECTION HELPER
const getColRef = (colName: string) => collection(db, colName);

// --- API UTAMA

export const userAPI = {
  async getAll() {
    const snapshot = await getDocs(getColRef("user"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as UserData[];
  },

  async getById(id: string) {
    const ref = doc(db, "user", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("User not found");
    return { id: snap.id, ...snap.data() } as UserData;
  },

  async create(data: Omit<UserData, "id">) {
    await addDoc(getColRef("user"), data);
  },

  async update(id: string, data: Partial<UserData>) {
    const ref = doc(db, "user", id);
    await updateDoc(ref, data);
  },

  async delete(id: string) {
    const ref = doc(db, "user", id);
    await deleteDoc(ref);
  }
};

// === Lakukan hal serupa untuk `obatAPI` dan `penyakitAPI` jika dibutuhkan ===
export const obatAPI = {
  async getAll() {
    const snapshot = await getDocs(collection(db, "obat"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Obat[];
  },

  async getById(id: string) {
    const ref = doc(db, "obat", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Obat tidak ditemukan");
    return { id: snap.id, ...snap.data() } as Obat;
  },

  async create(data: Omit<Obat, "id">) {
    await addDoc(collection(db, "obat"), data);
  },

  async update(id: string, data: Partial<Obat>) {
    const ref = doc(db, "obat", id);
    await updateDoc(ref, data);
  },

  async delete(id: string) {
    const ref = doc(db, "obat", id);
    await deleteDoc(ref);
  }
};

export const penyakitAPI = {
  async getAll() {
    const snapshot = await getDocs(collection(db, "penyakit"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Penyakit[];
  },

  async getById(id: string) {
    const ref = doc(db, "penyakit", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) throw new Error("Penyakit tidak ditemukan");
    return { id: snap.id, ...snap.data() } as Penyakit;
  },

  async create(data: Omit<Penyakit, "id">) {
    await addDoc(collection(db, "penyakit"), data);
  },

  async update(id: string, data: Partial<Penyakit>) {
    const ref = doc(db, "penyakit", id);
    await updateDoc(ref, data);
  },

  async delete(id: string) {
    const ref = doc(db, "penyakit", id);
    await deleteDoc(ref);
  }
};

export const obatPenyakitAPI = {
  async getAll() {
    const snapshot = await getDocs(collection(db, 'obat_penyakit'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ObatPenyakit[];
  },
  async create(data: Omit<ObatPenyakit, 'id'>) {
    await addDoc(collection(db, 'obat_penyakit'), data);
  },
  async delete(id: string) {
    await deleteDoc(doc(db, 'obat_penyakit', id));
  },
};

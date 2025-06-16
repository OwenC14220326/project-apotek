const API_BASE = 'http://localhost:5000';

// Generic API functions
export async function fetchData(endpoint: string) {
  const response = await fetch(`${API_BASE}/${endpoint}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  return response.json();
}

export async function createData(endpoint: string, data: any) {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to create ${endpoint}`);
  }
  return response.json();
}

export async function updateData(endpoint: string, id: number, data: any) {
  const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update ${endpoint}`);
  }
  return response.json();
}

export async function deleteData(endpoint: string, id: number) {
  const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Failed to delete ${endpoint}`);
  }
  return response.ok;
}

// Specific API functions
export const userAPI = {
  getAll: () => fetchData('user'),
  getById: (id: number) => fetchData(`user/${id}`),
  create: (data: any) => createData('user', data),
  update: (id: number, data: any) => updateData('user', id, data),
  delete: (id: number) => deleteData('user', id),
};

export const obatAPI = {
  getAll: () => fetchData('obat'),
  getById: (id: number) => fetchData(`obat/${id}`),
  create: (data: any) => createData('obat', data),
  update: (id: number, data: any) => updateData('obat', id, data),
  delete: (id: number) => deleteData('obat', id),
};

export const penyakitAPI = {
  getAll: () => fetchData('penyakit'),
  getById: (id: number) => fetchData(`penyakit/${id}`),
  create: (data: any) => createData('penyakit', data),
  update: (id: number, data: any) => updateData('penyakit', id, data),
  delete: (id: number) => deleteData('penyakit', id),
};

export const obatPenyakitAPI = {
  getAll: () => fetchData('obat_penyakit'),
  create: (data: any) => createData('obat_penyakit', data),
  delete: (id: number) => deleteData('obat_penyakit', id),
  getByPenyakit: async (id_penyakit: number) => {
    const relations = await fetchData('obat_penyakit');
    return relations.filter((rel: any) => rel.id_penyakit === id_penyakit);
  },
  getByObat: async (id_obat: number) => {
    const relations = await fetchData('obat_penyakit');
    return relations.filter((rel: any) => rel.id_obat === id_obat);
  },
};
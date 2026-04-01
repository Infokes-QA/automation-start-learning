export interface PasienData {
  noKK: string;
  nik: string;
  nama: string;
  jenis_kelamin: string;
  tanggalLahir: string;
}

export interface PasienDatas {
    nik: string;
    nama: string;
    noKK?: string;
    jenisKelamin: 'L' | 'P'; // Strict type
    tanggalLahir?: string;
}
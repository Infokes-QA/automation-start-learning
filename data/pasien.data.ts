import type { PasienData } from './interfaces/pasien.interface';
import type { PasienDatas } from './interfaces/pasien.interface';

export const PASIEN_DEFAULT: PasienData = {
        noKK: '1235324562363676',
        nik: '3278496512389074',
        nama: 'Auto Mation',
        jenis_kelamin: 'L',
        tanggalLahir: '01-01-1990',
};

export const patients: PasienDatas[] = [
    { nik: "1234567890123457", nama: "Siti Aminah", jenisKelamin: 'P' },
    { nik: "9876543210987654", nama: "Budi Santoso", jenisKelamin: 'L' }
];
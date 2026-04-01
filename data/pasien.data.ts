import type { PasienData } from './interfaces/pasien.interface';
import type { PasienDatas } from './interfaces/pasien.interface';

export const PASIEN_DEFAULT: PasienData = {
        noKK: '1235324562363676',
        nik: '3278496512389074',
        nama: 'Auto Mation',
        jenis_kelamin: 'L',
        tanggalLahir: '01-01-1970',
};

export const patients: PasienDatas[] = [
    { nik: "1111222233334444", nama: "Wati Siti", jenisKelamin: 'P' },
    { nik: "5555666677778888", nama: "Jono Joni", jenisKelamin: 'L' }
];
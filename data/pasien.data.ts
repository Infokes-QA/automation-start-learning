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
    { nik: "1111222233334444", nama: "Wati Siti", noKK : "1111222233334445", jenisKelamin: 'P',tanggalLahir: "30-11-1989" },
    { nik: "5555666677778888", nama: "Jono Joni", noKK : "5555666677778889", jenisKelamin: 'L',tanggalLahir: "30-11-1984" }
];
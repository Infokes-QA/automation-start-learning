import type { PasienData } from './interfaces/pasien.interface';

const generateUniqueId = () => {
    const randomNum = Math.floor(Math.random() * 10**15);
    return '1' + randomNum.toString().padStart(15, '0');
};

export const createPasienLakiLaki = (): PasienData => ({
    noKK: generateUniqueId(),
    nik: generateUniqueId(),
    nama: 'Herman Jumapo ' + generateUniqueId(),
    jenisKelamin: 'Laki-laki',
});

export const createPasienPerempuan = (): PasienData => ({
    noKK: generateUniqueId(),
    nik: generateUniqueId(),
    nama: 'SINTA MARIHUANI ' + generateUniqueId(),
    jenisKelamin: 'Perempuan',
});

export const PASIEN_DEFAULT = createPasienLakiLaki();


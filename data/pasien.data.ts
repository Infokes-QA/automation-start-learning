import type { PasienData } from './interfaces/pasien.interface';
import type { PasienDatas } from './interfaces/pasien.interface';
import { faker } from '@faker-js/faker';

export const PASIEN_DEFAULT: PasienData = {
        noKK: '1235324562363676',
        nik: '3278496512389074',
        nama: 'Auto Mation',
        jenis_kelamin: 'L',
        tanggalLahir: '01-01-1990',
};

export const patients: PasienDatas[] = [
    { 
        // In v7, numeric is under random
        nik: faker.random.numeric(16), 
        // In v7, names are under name, not person
        nama: faker.name.fullName(), 
        jenisKelamin: 'L' 
    },
    { 
        nik: faker.random.numeric(16), 
        nama: faker.name.fullName(), 
        jenisKelamin: 'P'
    }
];
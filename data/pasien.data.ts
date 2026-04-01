export type PatientProfile = 'laki-laki' | 'perempuan';

export interface PatientData {
    nik: string;
    nama: string;
    umurTahun: string;
    umurBulan: string;
    umurHari: string;
    nomorHp: string;
    gender: 'Laki-laki' | 'Perempuan';
}

function generateUniqueDigits(length: number): string {
    const digits = `${Date.now()}${Math.floor(Math.random() * 100000)}`;
    return digits.slice(-length).padStart(length, '0');
}

function createNik(suffix: string): string {
    const baseDigits = generateUniqueDigits(14);
    return `${baseDigits}${suffix}`.slice(0, 16);
}

function createPhoneNumber(): string {
    return `08${generateUniqueDigits(10)}`.slice(0, 12);
}

export function createPatientData(profile: PatientProfile): PatientData {
    const uniqueCode = generateUniqueDigits(6);

    if (profile === 'laki-laki') {
        return {
            nik: createNik('01'),
            nama: `test automation laki-laki ${uniqueCode}`,
            umurTahun: '21',
            umurBulan: '12',
            umurHari: '12',
            nomorHp: createPhoneNumber(),
            gender: 'Laki-laki',
        };
    }

    return {
        nik: createNik('02'),
        nama: `test automation perempuan ${uniqueCode}`,
        umurTahun: '21',
        umurBulan: '12',
        umurHari: '12',
        nomorHp: createPhoneNumber(),
        gender: 'Perempuan',
    };
}

import { faker } from '@faker-js/faker';

export type JenisKelamin = 'L' | 'P';

export interface GeneratedPasienData {
  nik: string;
  nama: string;
  tanggalLahir: string; // DD-MM-YYYY
  tempatLahir: string;
  jenisKelamin: JenisKelamin;
  phoneNumber: string;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function formatDdMmYyyy(date: Date): string {
  const dd = pad2(date.getDate());
  const mm = pad2(date.getMonth() + 1);
  const yyyy = String(date.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
}

function generateNik16(): string {
  const digits = faker.random.numeric(16);
  return digits.replace(/^0/, '1');
}

function generatePhoneNumber(): string {
  const prefix = faker.helpers.arrayElement(['081', '082', '083', '085', '087', '088']);
  const lineNumber = faker.random.numeric(7);
  return `${prefix}${lineNumber}`;
}

export function generatePasienData(overrides?: Partial<GeneratedPasienData>): GeneratedPasienData {
  const jenisKelamin: JenisKelamin = overrides?.jenisKelamin ?? (faker.helpers.arrayElement(['L', 'P']) as JenisKelamin);
  const nama = overrides?.nama ?? `Automation-${faker.word.noun()}-${faker.datatype.number({ min: 100, max: 999 })}`;
  const birth = faker.date.birthdate({ min: 1, max: 80, mode: 'age' });
  const phone = generatePhoneNumber();
  return {
    nik: overrides?.nik ?? generateNik16(),
    nama,
    tanggalLahir: overrides?.tanggalLahir ?? formatDdMmYyyy(birth),
    tempatLahir: overrides?.tempatLahir ?? faker.address.cityName(),
    jenisKelamin,
    phoneNumber: overrides?.phoneNumber ?? phone,
  };

}

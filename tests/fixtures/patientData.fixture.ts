import { faker } from "@faker-js/faker/locale/id_ID";

const PROVINCE = "JAWA BARAT";
const CITY = "BANDUNG";
const DISTRICT = "BANDUNG KULON";
const SUB_DISTRICT = "CIBIRU";

function formatDateToISO(dateObj: Date): string {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface PasienData {
  nikPasien: string;
  namaPasien: string;
  tanggalLahir: string;
  phoneNumber: string;
  province?: string;
  city?: string;
  district?: string;
  subDistrict?: string;
}

export function generatePasienDataUmum(): PasienData {
  const nikPasien = faker.string.numeric(16);
  const namaPasien = faker.person.fullName();
  const tanggalLahir = faker.date.between({
    from: new Date("1985-01-01"),
    to: new Date("1990-12-31"),
  });
  const phoneNumber = `08${faker.string.numeric(9)}`;

  return {
    nikPasien,
    namaPasien,
    tanggalLahir: formatDateToISO(tanggalLahir),
    phoneNumber,
    province: PROVINCE,
    city: CITY,
    district: DISTRICT,
    subDistrict: SUB_DISTRICT,
  };
}


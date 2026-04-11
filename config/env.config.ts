import dotenv from "dotenv";

dotenv.config({ debug: false, quiet: true });

export const env = {
  BASE_URL: process.env.BASE_URL ?? "https://dev-1.eclinic.id",

  EC_USERNAME: process.env.EC_USERNAME ?? "",
  EC_PASSWORD: process.env.EC_PASSWORD ?? "",
  EC_PASSWORD_AUTH: process.env.EC_PASSWORD_AUTH ?? "",
  EC_FASKES: process.env.EC_FASKES ?? ""

} as const;
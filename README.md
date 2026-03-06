# Automation Playwright BDD - eClinic Service

Repositori ini berisi kerangka otomatisasi pengujian untuk layanan **eClinic** menggunakan **Playwright** dengan pendekatan **BDD (Behavior-Driven Development)** dan **TypeScript**.

## Fitur Utama
- **Framework**: Playwright (Web Testing)
- **BDD Tool**: Cucumber.js
- **Language**: TypeScript
- **Context**: Pelayanan Poli Umum & Poli Gigi (HIS)

## Skenario Tes
Tugas ini mencakup alur *end-to-end* pasien dari pendaftaran hingga kepulangan:
1. **Poli Umum**: Pendaftaran pasien umum, pengisian rekam medis, dan pemberian resep obat (mendukung multiple medicines via Data Tables).
2. **Poli Gigi**: Pendaftaran pasien umum, pengisian rekam medis, permintaan pemeriksaan lab (multiple tests), hingga penginputan hasil lab.

## Prasyarat
Sebelum menjalankan tes, pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Versi 16 atau terbaru)
- Git

## Instalasi
1. Clone repositori ini:
   ```bash
   git clone [https://github.com/Infokes-QA/automation-start-learning.git](https://github.com/Infokes-QA/automation-start-learning.git)
   cd automation-start-learning
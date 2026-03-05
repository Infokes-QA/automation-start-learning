Feature: Pelayanan Medis Pasien

  Background:
    Given Petugas telah login dan pasien dalam antrean

  @poli_umum
  Scenario Outline: Dokumentasi Layanan Poli Umum
    Given Dokter pemeriksa telah ditentukan
    When Dokter melengkapi Pengkajian Awal dan Pemeriksaan Fisik wajib
    And Dokter menetapkan diagnosis "<diagnosis>"
    And Dokter menerbitkan resep "<nama_obat>"
    Then Sistem mengarsipkan data pelayanan dan memperbarui status pasien

    Examples:
      | diagnosis | nama_obat   |
      | Demam     | Paracetamol |
      | Batuk     | OBH         |

  @poli_gigi
  Scenario Outline: Dokumentasi Layanan Poli Gigi
    Given Dokter pemeriksa telah ditentukan
    When Dokter melengkapi Pengkajian Awal dan Pemeriksaan Fisik wajib
    And Dokter mencatat tindakan "<tindakan>"
    And Dokter menerbitkan permintaan lab "<jenis_lab>"
    Then Sistem mengintegrasikan data pelayanan ke unit terkait

    Examples:
      | tindakan    | jenis_lab    |
      | Cabut Gigi  | Rontgen Gigi |
      | Tambal Gigi | Tes Darah    |

  @negative
  Scenario: Validasi Kelengkapan Data Mandatory
    Given Dokter pemeriksa telah ditentukan
    When Dokter mengabaikan pengisian data mandatory
    And Dokter mencoba menyelesaikan pelayanan
    Then Sistem menolak penyimpanan dengan pesan "Data tidak lengkap"
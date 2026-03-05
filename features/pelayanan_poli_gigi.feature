Feature: Pelayanan Medis Pasien Poli Gigi

  Background:
    Given Petugas telah login ke sistem
    And Pasien telah terdaftar dalam antrean Poli Gigi

  @poli_gigi @positive
  Scenario Outline: Dokumentasi Layanan Poli Gigi dengan Tindakan dan Permintaan Lab
    Given Jadwal Pemeriksaan Dokter telah ditentukan
    And Pasien berada pada status "Menunggu Pemeriksaan"
    When Dokter mengisi Pengkajian Awal wajib
    And Dokter mengisi Pemeriksaan Fisik wajib
    And Dokter mencatat tindakan "<tindakan>"
    And Dokter menerbitkan permintaan lab  "<jenis_lab>"
    And Dokter menekan tombol simpan pelayanan
    Then Sistem mengarsipkan data pelayanan poli gigi
    And Sistem mengirimkan permintaan "<jenis_lab>" ke pelayanan Lab
    And Sistem memperbarui status pasien menjadi "Telah Diperiksa Dokter"

    Examples:
      | tindakan        | jenis_lab      |
      | Cabut Gigi      | Rontgen Gigi   |
      | Tambal Gigi     | Tes Darah      |
      | Scaling         | Rontgen Gigi   |


  @poli_gigi @negative @validation
  Scenario: Gagal Melakukan Tindakan Karena Obat Pendukung Tidak Tersedia
    Given Jadwal Pemeriksaan Dokter telah ditentukan
    And Pasien berada pada status "Menunggu Pemeriksaan"
    And Tindakan "Bedah Mulut" membutuhkan obat pendukung "Anestesi Lokal"
    And Stok obat "Anestesi Lokal" sedang kosong
    When Dokter mengisi Pengkajian Awal wajib
    And Dokter mengisi Pemeriksaan Fisik wajib
    And Dokter mencatat tindakan "Bedah Mulut"
    And Dokter menekan tombol simpan pelayanan
    Then Sistem menampilkan pesan error "Obat pendukung tidak tersedia"
    And Sistem membatalkan penyimpanan tindakan
    And Status pasien tetap "Menunggu Pemeriksaan"
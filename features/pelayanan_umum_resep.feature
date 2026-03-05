Feature: Pelayanan Medis Pasien Poli Umum Dengan resep

  Background:
    Given Petugas telah login ke sistem
    And Pasien telah terdaftar dalam antrean


  @poli_umum @positive
  Scenario Outline: Dokumentasi Layanan Poli Umum Berhasil
    Given Jadwal Pemeriksaan Dokter telah ditentukan
    And Pasien berada pada status "Menunggu Pemeriksaan"
    When Dokter mengisi Pengkajian Awal wajib
    And Dokter mengisi Pemeriksaan Fisik wajib
    And Dokter menetapkan diagnosis "<diagnosis>"
    And Dokter menerbitkan resep "<nama_obat>"
    And Dokter menekan tombol simpan pelayanan
    Then Sistem berhasil menyimpan data pelayanan
    And Sistem memperbarui status pasien menjadi "Telah Diperiksa Dokter"
    And Sistem mencatat waktu pelayanan

    Examples:
      | diagnosis        | nama_obat        |
      | Demam            | Paracetamol      |
      | Batuk            | OBH              |
      | Hipertensi       | Amlodipine       |


  @poli_umum @negative @validation
  Scenario: Gagal Menyimpan Jika Diagnosis Kosong
    Given Jadwal Pemeriksaan Dokter telah ditentukan
    And Pasien berada pada status "Menunggu Pemeriksaan"
    When Dokter mengisi Pengkajian Awal
    And Dokter mengisi Pemeriksaan Fisik
    And Dokter tidak mengisi diagnosis
    And Dokter menekan tombol simpan
    Then Sistem menampilkan pesan error "Diagnosis wajib diisi"
    And Status pasien tetap "Menunggu Pemeriksaan"
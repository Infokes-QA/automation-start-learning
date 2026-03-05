Feature: Pelayanan pasien di poli Puskesmas

Background:
    Given petugas sudah login ke sistem
    And pasien sudah terdaftar di sistem

 Scenario: Pelayanan Poli Umum dengan resep/obat
    Given pasien melakukan pendaftaran ke Poli Umum
    And petugas melakukan anamnesa
    And petugas melakukan diagnosa
    When petugas menginputkan form resep dengan "<obat>"
    And petugas menekan tombol simpan
    Then resep obat pasien harus tersimpan di sistem

    Examples:
      |obat        |
      |Paracetamol |
      |Amoxicillin |

Scenario: Pelayanan Poli Gigi dengan Lab
    Given pasien melakukan pendaftaran ke Poli Gigi
    And petugas melakukan anamnesa
    And petugas melakukan diagnosa
    When petugas menginputkan form lab dengan "<pemeriksaan lab>"
    And petugas menekan tombol simpan
    Then pemeriksaan lab pasien harus tersimpan di sistem

    Examples:
      |pemeriksaan lab  |
      |Gula Darah       |
      |TBC              |
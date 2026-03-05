Feature: Pelayanan Medis
  As a user i want to create pelayanan Medis patient
  i should be able to see that pelayanan patient has been complete

  Background: 
  Given user already create pendaftaran patient
  And  user is on Pelayanan medis page

@PoliUmum
  Scenario: User successfully create pelayanan gigi with Resep
    Given user is on Pelayanan medis page
    When user clicks Anamnesa Tab
    And user enters all mandatory field on Buat Baru Anamnesa form
    And user clicks Simpan Anamnesa Button
    Then The system displays a message: "Anamnesa berhasil disimpan"
    When user clicks Diagnosa Tab
    And user enters all mandatory field on Buat Baru Diagnosa form
    And user clicks Simpan Button 
    Then The system displays a message: "Diagnosa berhasil disimpan"
    When user clicks Resep Tab
    And the user fill Resep section with <Racikan>, <NamaObat>, <Jumlah>, <Signa>, and <AturanPakai>
    And the user clicks Tambah button
    And the user clicks Simpan button
    Then system displays a message: "Resep berhasil disimpan"
    When the user selects Status Pulang <StatusPulang>
    And the user uncheck "Uncheck jika tidak ada rencana kontrol" field
    And the user clicks Selesai button
    Then The system displays a message: "Pelayanan Pasien Selesai!"

    Examples:
      | Racikan    | NamaObat                          | Jumlah       | Signa       | AturanPakai   | StatusPulang    |
      | R1         | Kloramfenikol Salep Kulit 2%      | 1            | 1x1         | Sebelum Makan | Berobat Jalan   |


@PoliGigi
  Scenario: User successfully create pelayanan gigi with Resep
    Given user is on Pelayanan medis page
    When user clicks Anamnesa Tab
    And user enters all mandatory field on Buat Baru Anamnesa form and saved 
    And user clicks Simpan Anamnesa Button
    Then The system displays a message: "Anamnesa berhasil disimpan"
    When user clicks Diagnosa Tab
    And user enters all mandatory field on Buat Baru Diagnosa form
    And user clicks Simpan Button
    Then The system displays a message: "Diagnosa berhasil disimpan"
    When user clicks Tindakan Tab 
    And user enters tindakan <TindakanGigi>
    And user clicks Tambah button
    And user clicks Simpan button on Tindakan form
    Then Then The system displays a message: "Data berhasil disimpan"
    When user clicks Laboratorium Tab
    And user select <jenislab>
    And user click simpan 
    Then The system displays a message: "Data berhasil disimpan"
    When the user selects Status Pulang <StatusPulang>
    And the user uncheck "Uncheck jika tidak ada rencana kontrol" field
    And the user clicks Selesai button
    Then The system displays a message: "Pelayanan Pasien Selesai!" 

Examples:
      | jenislab           | StatusPulang    | TindakanGigi                            |
      | Gula Darah Puasa   | Berobat Jalan   | Cabut gigi tidak dengan injeksi per gigi|


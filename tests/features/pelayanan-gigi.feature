Feature: Pelayanan Gigi
  As a user i want to create pelayanan gigi
  so i should be able to see that pelayanan patient has been complete

  Background: 
  Given user already create pendaftaran patient Poli Gigi with Laboratorium
  And 'Gula darah puasa' Laboratorium service is available
  And user is on Pelayanan medis page

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
    When user clicks Laboratorium Tab
    And user select <jenislab>
    And user click simpan
    Then The system displays a message: "Data berhasil disimpan"
    When the user selects Status Pulang <StatusPulang>
    And the user uncheck "Uncheck jika tidak ada rencana kontrol" field
    And the user clicks Selesai button
    Then The system displays a message: "Pelayanan Pasien Selesai!" 

Examples:
      | jenislab           | StatusPulang    |
      | Gula Darah Puasa   | Berobat Jalan   |

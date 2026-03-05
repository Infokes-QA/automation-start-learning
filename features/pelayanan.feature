Feature: Pelayanan Poli

  In order to provide medical services for patients
  As a staff
  I want to complete poli services including diagnosis, optional resep, and optional laboratory

  Background:
    Given the user is logged in to the ePuskesmas system
    And the patient has been registered

  @poliUmum
  Scenario: Complete Poli Umum service without resep
    When the user registers the patient to Poli Umum
    And the user fills in anamnesa data
    And the user fills in diagnosa data
    And the user sets the patient status Pulang to "Sembuh"
    Then the Poli Umum service is successfully completed

  Scenario: Complete Poli Umum service with multiple resep
    When the user registers the patient to Poli Umum
    And the user fills in anamnesa data
    And the user fills in diagnosa data
    And the user adds 2 resep for the patient
    And the user sets the patient status pulang to "Berobat Jalan"
    Then the Poli Umum service is successfully completed
    And all resep are saved


  Scenario: Fail to set patient status to Pulang without diagnosa
    When the user registers the patient to Poli Umum
    And the user fills in anamnesa data
    And the user sets the patient status Pulang to "Batal Berobat"
    Then the system should display validation error for missing diagnosa
    And the patient visit status should not be updated to "Sudah Diperiksa"


  @poliGigi
  Scenario: Complete Poli Gigi service without laboratory
    When the user registers the patient to Poli Gigi
    And the user fills in anamnesa data
    And the user fills in diagnosa data
    And the user sets the patient status Pulang to "Berobat Jalan"
    Then the Poli Gigi service is successfully completed

  Scenario: Complete Poli Gigi service with multiple laboratory requests
    When the user registers the patient to Poli Gigi
    And the user fills in anamnesa data
    And the user fills in diagnosa data
    And the user creates 3 laboratory requests
    And the laboratory results are recorded
    And the user sets the patient status to "Meninggal"
    Then the Poli Gigi service is successfully completed
    And all laboratory records are saved

  Scenario: Cannot set patient to pulang without diagnosis
    When the user tries to set patient to pulang without diagnosis
    Then the system should show validation error
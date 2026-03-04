Feature: Pelayanan Poli Umum with resep

  In order to provide general medical service
  As a staff
  I want to complete Poli Umum service with optional resep

  Background:
    Given the user is logged in to the ePuskesmas system
    And the patient has been registered

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
Feature: Pelayanan Medis

  In order to provide medical services for patients
  As a staff
  I want to complete medical services including Anamnesa, Diagosis, and Drug recepies 

  Background:
    Given the user is logged in to the ePuskesmas 
    And the patient has been registered

  @PoliUmum
  Scenario: Complete "Pelayanan Medis" service without Drug recepies
    When the user registers the patient to Poli Umum
    And the user fills in anamnesa data
    And the user fills in diagnosa data
    And the user sets the patient status Pulang to "Berobat Jalan"
    Then the Poli Umum service is successfully completed

  Scenario: Complete Poli Umum service with Drug recepies
    When the user registers the patient to Poli Umum
    And the user fills in anamnesa data
    And the user fills in diagnosa data
    And the user add 2 Drug recepies for the patient
    And the user sets the patient status pulang to "Berobat Jalan"
    Then the Poli Umum service is successfully completed
    And all resep are saved


  Scenario: Fail to set patient status to Pulang without Anamnesa
    When the user registers the patient to Poli Umum
    And the user sets the patient status Pulang to "Batal Berobat"
    Then the system should display validation error for missing diagnosa
    And the patient visit status should not be updated 

  Scenario: Fail to set patient status to Pulang without diagnosa
    When the user registers the patient to Poli Umum
    And the user fills in anamnesa data
    And the user sets the patient status Pulang to "Batal Berobat"
    Then the system should display validation error for missing diagnosa
    And the patient visit status should not be updated 


  @PoliGigi
  Scenario: Complete Poli Gigi service 
    When the user registers the patient to Poli Gigi
    And the user fills in anamnesa data
    And the user fills in diagnosa data
    And the user fills in odotogram data
    And the user sets the patient status Pulang to "Berobat Jalan"
    Then the Poli Gigi service is successfully completed

  Scenario: Complete Poli Gigi service with laboratory inspection
    When the user registers the patient to Poli Gigi
    And the user fills in anamnesa data
    And the user fills in odotogram data
    And the user fills in diagnosa data
    And the user creates 3 laboratory inspection
    And the laboratory results are recorded
    And the user sets the patient status to "Berobat Jalan"
    Then the Poli Gigi service is successfully completed
    And all laboratory records are saved

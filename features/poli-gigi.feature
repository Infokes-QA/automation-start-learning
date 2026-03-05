Feature: Pelayanan Poli Gigi with Laboratorium

  In order to provide dental medical service with laboratory support
  As a staff
  I want to complete Poli Gigi service with optional laboratory requests

  Background:
    Given the user is logged in to the ePuskesmas system
    And the patient has been registered

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

Feature: Clinical Outpatient Services
  As a medical staff at the Clinic
  I want to manage patient journey from registration to discharge
  To provide medical services in various polyclinics including General and Dental units

  Background: Login and Patient Selection
    Given User has already logged in eClinic
    And general patient "Wildan Adzani" is available in the system
    
  @PoliUmum @Resep
  Scenario: Medical service in General Polyclinic with prescription
    Given User registers patient "Wildan Adzani" to "Poli Umum"
    Then The patient should be successfully queued in "Poli Umum"
    When User opens the medical record for patient "Wildan Adzani"
    And User enters valid anamnesis data
    And User enters valid diagnosis data
    And User adds the following medicines:
      | medicine_name | qty | signa |
      | Paracetamol   | 11  | 3x1   |
      | Ambroxol      | 12  | 2x1   |
      | Vitamin D     | 7   | 1x1   |
    And User saves the medical record
    Then The anamnesis is successfully saved
    And The diagnosis is successfully saved
    And The prescriptions are successfully saved
    When User finalize the visit with "Berobat Jalan" status
    Then The patient journey should be marked as "Completed"

  @PoliGigi @Laboratorium
  Scenario: Medical service in Dental Polyclinic with laboratory test
    Given User registers patient "Wildan Adzani" to "Poli Gigi"
    Then The patient should be successfully queued in "Poli Gigi"
    When User opens the medical record for patient "Wildan Adzani"
    And User enters valid anamnesis data
    And User enters valid diagnosis data
    And User requests the following laboratory examinations:
      | test_name            |
      | Gula Darah Puasa     |
      | Gula Darah Sewaktu   |
    And User saves the medical record
    Then The anamnesis is successfully saved
    And The diagnosis is successfully saved
    And The laboratory requests are successfully saved
    When User processes all laboratory examinations for "Wildan Adzani"
    Then the laboratory results should be integrated into the "Wildan Adzani" patient record
    When User finalize the visit with "Berobat Jalan" status
    Then The patient journey should be marked as "Completed"
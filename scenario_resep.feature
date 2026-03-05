Feature: Resep Obat

  Background:
    Given a patient visits the Poli Umum
    And the doctor is ready to provide service

  Scenario: Succesfully create a Resep for a patient at Poli Umum
    Given user has saved anamnesa and diagnosa for a patient
    And user is on the Resep page
    When user creates a Resep with required medication details
    And user saves the prescription
    Then system should display a success message
    And the saved Resep should appear in the Data Resep table
    When user opens the Data Resep page
    And user selects the created Data Resep
    And user starts the Resep process
    And user completes the Resep process
    Then the system should show a success message
    And the prescription status should be "Obat Sudah Diberikan"

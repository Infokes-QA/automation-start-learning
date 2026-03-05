Feature: Laboratorium

  Background:
    Given a patient visits the Poli Gigi
    And the doctor is ready to provide service

  Scenario: Succesfully create a laboratory examination for a patient at Poli Gigi
    Given user has saved the anamnesa and diagnosa for a patient
    And user is on the Laboratorium page
    When user selects type of Laboratorium examination
    And user saves the laboratory request
    Then laboratory request should be successfully saved
    When user fills the laboratory result
    And user saves laboratory result
    Then the laboratory status should be "Selesai"
@doctor
Feature: Dental clinic visit with laboratory examination as support

  Scenario: Successfully records patient's diagnosis
    Given the doctor's already on a patient's dental clinic visit page
    And anamnesis is already filled
    When the doctor enters the diagnosis
    And the doctor saves patient's visit data
    Then the diagnosis is saved

  Scenario: Successfully add laboratory examination type
    Given the doctor's already on a patient's dental clinic visit page
    And anamnesis is already filled
    And patient's diagnosis is already filled
    When the doctor choose laboratory examination type
    And the doctor saves patient's visit data
    Then the laboratory examination type is added to patient's visit data
    And system shows success message

  Scenario: Successfully do laboratory examination for patient's visit
    Given the laboratory examination type is already added to patient's visit data
    And the doctor's already on a patient's dental clinic laboratory page
    And laboratory result is already available
    When the doctor input laboratory result in laboratory page
    And the doctor saves patient's laboratory data
    Then the patient's laboratory data is saved
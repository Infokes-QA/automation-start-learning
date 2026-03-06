@doctor
Feature: General clinic visit with medicine prescription

  Scenario: Successfully records patient's diagnosis
    Given the doctor's already on a patient's general clinic visit page
    And anamnesis is already filled
    When the doctor enters the diagnosis
    And the doctor saves patient's visit data
    Then the diagnosis is saved

  Scenario: Successfully prescribes medicines
    Given the doctor's already on a patient's general clinic visit page
    And anamnesis is already filled
    And patient's diagnosis is already filled
    When the doctor prescribes medicines
    And the doctor saves patient's visit data
    Then the medicine prescription is saved

  Scenario: Successfully save patient's visit data without prescription
    Given the doctor's already on a patient's general clinic visit page
    And anamnesis is already filled
    And patient's diagnosis is already filled
    When the doctor prescribes medicines
    And the doctor saves patient's visit data
    Then the medicine prescription is saved

  Scenario: Diagnosis cannot be empty
    Given the doctor's already on a patient's general clinic visit page
    And anamnesis is already filled
    When the doctor tries to save without diagnosis
    Then the system shows a validation message
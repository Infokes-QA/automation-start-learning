Feature: Patient Service at the Clinic
  As a doctor
  I want to process patient services based on the clinic department
  So that patients can receive prescriptions or laboratory examinations

  Scenario Outline: General clinic service with prescription
    Given patient "<nama_pasien>" with "<nik>" is already registered in the system
    And the patient registers at the general clinic
    When the doctor performs an examination
    And the doctor records anamnesis data and "<diagnosa>"
    And the doctor prescribes "<resep>"
    Then the doctor completes the service
    And the service record is saved in the system

    Examples:
      | nama_pasien | nik              | diagnosa | resep        |
      | Xavier      | 1234567890123456 | z00      | Amoxicillin  |
      | Vale        | 1234567890123457 | a01      | Paracetamol  |
      | Argus       | 1234567890123458 | a02      | Diazepam     |

  Scenario Outline: Dental clinic service with laboratory test
    Given patient "<nama_pasien>" with "<nik>" is already registered in the system
    And the patient registers at the dental clinic
    When the doctor performs an examination
    And the doctor records anamnesis data and "<diagnosa>"
    And the doctor requests a laboratory test "<lab>"
    Then the doctor completes the service
    And the service record is saved in the system

    Examples:
      | nama_pasien | nik              | diagnosa | lab                 |
      | Xavier      | 1234567890123456 | a03      | Leukosit  |
      | Vale        | 1234567890123457 | a07      | Eritrosit |
      | Argus       | 1234567890123458 | z00      | Hemoglobin. |
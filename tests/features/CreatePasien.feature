Feature: Create Data Pasien

    Background:
        Given the User is logged in
        And the User is on the Create Pasien page

    @task
    Scenario Outline: create a new patient based on gender
        When the User fills in patient profile with random data for '<gender>'
        And the User saves the patient data
        Then user should see the patient listed in the patient index

        Examples:
            | gender     |
            | LAKI-LAKI  |
            | PEREMPUAN  |
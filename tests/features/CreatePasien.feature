Feature: Create Data Pasien

    Background:
        Given the user is logged in to eClinic
        And the user is on the create patient page

    @task
    Scenario Outline: create a new patient based on gender
        When the user fills in patient form with random data for '<gender>'
        And the user saves the patient data
        Then the user should verify that the patient's data are displayed correctly in the index

        Examples:
            | gender     |
            | LAKI-LAKI  |
            | PEREMPUAN  |
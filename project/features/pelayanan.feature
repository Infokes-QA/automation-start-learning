Feature: User can input services data to Pelayanan Medis
    In Order to do various of medical examination
    As a User
    I want to input services data to Pelayanan Medis

    Background:
    Given a patient data is exist
    And User has already registered patient to Pelayanan Medis Poli <poli>
    And User has already input Anamnesa data
    And User has already input Diagnosa data
    And User is on the <services> submenu

    @positive
    Scenario: User succesfully do medical service with additional services
    When User provides a valid <services> data
    And User click Simpan
    And User finished the medical service
    Then Data should be saved to database
    And User got a success message

    Examples:
    |poli|services|
    |Umum|Resep|
    |Gigi|Laboratorium|

    @negative
    Scenario: User failed to do medical service while the services data is inactive
    When the <services> is inactive
    And User click Simpan   
    Then Data should not be saved to database
    And the page should show an error message
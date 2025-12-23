Feature: Login

Scenario: User can login with valid credentials
    Given user navigates to login page
    When user enters 'valid' username and password
    And user clicks login button
    Then user will be directed to the select puskesmas page
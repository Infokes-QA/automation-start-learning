Feature: Login

Scenario: User can login with valid credentials
    Given user navigates to login page
    When user selects "klinik" as facility
    And user enters "test" as username
    And user enters "env" as password
    Then user clicks the login button
    And user should be redirected to the dashboard page
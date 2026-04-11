Feature: Login

Scenario: User can login with valid credentials
    Given user navigates to login page
    When user selects "nama klinik" as facility
    And user enters "username" as username
    And user enters "password" as password
    And user clicks the login button
    Then user should be redirected to the dashboard page
Feature: Login

@Login @SmokeTest 
Scenario: User can login with valid credentials
    Given User navigates to Login page
    When User logs in with valid credentials
    Then User will be directed to the home page
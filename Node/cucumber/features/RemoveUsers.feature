Feature: Remove Users
  Admin needs to be able to remove users

  Scenario: User exists and selected
    Given user exists
    And I am admin
    And user is selected
    When I click remove
    Then the user should be removed from the database

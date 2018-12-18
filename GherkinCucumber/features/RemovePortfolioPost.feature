Feature: Remove portfolio Post
  Admin needs to be able to remove a portfolio post

  Scenario: Item selected
    Given post is selected
    And I am admin
    When I click remove
    Then the portfolio post should be removed from database
    Then the portfolio post should be removed from pages

Feature: Edit portfolio Post
  Admin needs to be able to edit a portfolio post

  Scenario: Item selected
    Given post is selected
    And I am admin
    When I click get data
    Then the portfolio post should be added to input fields

    Scenario: Input fields filled
      Given all data exists
      And I am admin
      When I click submit
      Then the portfolio post should be updated on all pages
      Then the portfolio post should be updated on database

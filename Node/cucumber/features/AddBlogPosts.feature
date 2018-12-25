Feature: Add Blog Post
  Admin needs to be able to create a blog post

  Scenario: Data is submitted
    Given all data is input
    And I am admin
    When I click submit
    Then the blog post should be added

  Scenario: Data is cleared
    Given input fields exist
    And I am admin
    When I click clear
    Then the input fields should be cleared

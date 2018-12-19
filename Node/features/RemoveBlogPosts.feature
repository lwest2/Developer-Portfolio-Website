Feature: Remove Blog Post
  Admin needs to be able to remove a blog post

  Scenario: Item selected
    Given post is selected
    And I am admin
    When I click remove
    Then the blog post should be removed from database
    Then the blog post should be removed from pages

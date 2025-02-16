Feature: User Post Creation

  Scenario: User uploads a post successfully
  Given I am on the post creation page
  When I select "image" as the post type
  And I enter "Test Caption" as the caption
  And I enter "#selenium #test" as the hashtags
  And I upload a file "test_image.jpg"
  And I click the upload button
  Then I should see a success message


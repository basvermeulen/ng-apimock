Feature: Change responses

  Developers must be able to:

  - Select scenario's
  - Add or update variables
  - Record responses
  - Delay responses
  - Echo requests

  in order to run the application against mocks.

  Background:
    Given a mock with name list has no scenario marked as default
    And a mock with name update has marked successful as its default scenario

  # Verify without selecting any scenario

  Scenario: Get the list
    Given I open the test page
    Then the passThrough response should be returned for mock with name list
    And the status code should be undefined for mock with name list


  ### Scenario's ###

  # Verify after selecting scenario's

  Scenario: Select another scenario and get the list
    Given I open the test page
    When I switch to mocking interface
    And I select groceries for mock with name list
    And I switch to test page
    And I refresh
    Then the groceries response should be returned for mock with name list

  # Verify after resetting the scenario's to default

  Scenario: Reset scenario's to default
    Given I open the test page
    When I switch to mocking interface
    And I reset the scenario's to defaults
    And I switch to test page
    And I refresh
    Then the passThrough response should be returned for mock with name list

   # Verify after resetting the scenario's to passThrough

  Scenario: Reset scenario's to passThroughs
    Given I open the test page
    When I switch to mocking interface
    And I reset the scenario's to passThroughs
    And I switch to test page
    And I refresh
    Then the passThrough response should be returned for mock with name list

  ### Delaying ###

  Scenario: Delay the response
    Given I open the test page
    And I switch to mocking interface
    And I select groceries for mock with name list
    When I delay the response for mock with name list for 2000 milliseconds
    And I switch to test page
    And I refresh
    Then the loading warning is visible
    When I wait a 2000 milliseconds
    Then the loading message is visible

  ### use the scenario delay

  Scenario: Delay the response from the mock
    Given I open the test page
    And I switch to mocking interface
    And I select other for mock with name list
    When I delay the response for mock with name list for 2000 milliseconds
    And I switch to test page
    And I refresh
    Then the loading warning is visible
    When I wait a 4000 milliseconds
    Then the loading message is visible
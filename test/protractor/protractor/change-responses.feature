@add
Feature: Change responses

  Developers must be able to:

  - Select scenario's
  - Add or update variables
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
    When I select groceries for mock with name list
    And I refresh
    Then the groceries response should be returned for mock with name list

    # Verify after resetting the scenario's to default

  Scenario: Reset scenario's to default
    Given I open the test page
    And I reset the scenario's to defaults
    And I refresh
    Then the passThrough response should be returned for mock with name list
    And the status code should be undefined for mock with name list

    # Verify after resetting the scenario's to passThrough

  Scenario: Reset scenario's to passThroughs
    Given I open the test page
    And I reset the scenario's to passThroughs
    And I refresh
    Then the passThrough response should be returned for mock with name list

    ### Variables ###

    # Verify after adding a variable

  Scenario: Add a global variable
    Given I open the test page

    # Select a scenario that has a value that can be interpolated
    And I select groceries for mock with name list
    And I add variable numberOfApples with value 5
    And I add variable who with value Bertie
    And I refresh
    Then the groceries response should be returned with interpolated value 5 for key numberOfApples for mock with name list
    Then the groceries response should be returned with interpolated value Bertie for key who for mock with name list

    # Verify after updating a variable

  Scenario: Update a global variable
    Given I open the test page

    # Select a scenario that has a value that can be interpolated
    And I select groceries for mock with name list
    And I update variable numberOfApples with value 6
    And I update variable who with value Yvonne
    And I refresh
    Then the groceries response should be returned with interpolated value 6 for key numberOfApples for mock with name list
    Then the groceries response should be returned with interpolated value Yvonne for key who for mock with name list

    # Verify after deleting a variable

  Scenario: Delete a global variable
    Given I open the test page

    # Select a scenario that has a value that can be interpolated
    And I select groceries for mock with name list
    And I delete variable numberOfApples
    And I delete variable who
    And I refresh
    Then the groceries response should be returned for mock with name list

    # Verify after adding a variable

  Scenario: Add a global variables
    Given I open the test page

    # Select a scenario that has a value that can be interpolated
    And I select groceries for mock with name list
    And I add variables
      | variable       | value  |
      | numberOfApples | 5      |
      | who            | Bertie |
    And I refresh
    Then the groceries response should be returned with interpolated value 5 for key numberOfApples for mock with name list
    Then the groceries response should be returned with interpolated value Bertie for key who for mock with name list

    # Verify after updating variables

  Scenario: Update a global variable
    Given I open the test page

    # Select a scenario that has a value that can be interpolated
    And I select groceries for mock with name list
    And I update variable numberOfApples with value 6
    And I update variables
      | variable       | value  |
      | numberOfApples | 6      |
      | who            | Yvonne |
    And I refresh
    Then the groceries response should be returned with interpolated value 6 for key numberOfApples for mock with name list
    Then the groceries response should be returned with interpolated value Yvonne for key who for mock with name list

    ### Delaying ###

  Scenario: Delay the response
    Given I open the test page
    And I select groceries for mock with name list
    When I delay the response for mock with name list for 2000 milliseconds
    And I refresh
    Then the loading warning is visible
    When I wait a 2000 milliseconds
    Then the loading message is visible

    # use the scenario delay
  Scenario: Delay the response from the mock
    Given I open the test page
    And I select other for mock with name list
    When I delay the response for mock with name list for 2000 milliseconds
    And I refresh
    Then the loading warning is visible
    When I wait a 4000 milliseconds
    Then the loading message is visible
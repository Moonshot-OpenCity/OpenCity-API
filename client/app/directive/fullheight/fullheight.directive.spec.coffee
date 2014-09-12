'use strict'

describe 'Directive: fullheight', ->

  # load the directive's module
  beforeEach module 'openCityApp'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<fullheight></fullheight>'
    element = $compile(element) scope
    expect(element.text()).toBe 'this is the fullheight directive'

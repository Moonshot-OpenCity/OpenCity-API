'use strict'

describe 'Service: postits', ->

  # load the service's module
  beforeEach module 'openCityApp'

  # instantiate service
  postits = undefined
  beforeEach inject (_postits_) ->
    postits = _postits_

  it 'should do something', ->
    expect(!!postits).toBe true

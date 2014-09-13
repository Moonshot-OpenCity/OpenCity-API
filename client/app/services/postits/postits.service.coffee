'use strict'

angular.module 'openCityApp'
.service 'postits', (Restangular) ->

  @search = (lat, lon, limit = 50) -> Restangular.all("postits").all("searchByLocation").getList({lat, lon, limit})

  @get = (id) -> Restangular.one("postits", id).get()

  @create = (options) -> Restangular.all("postits").post(options)

  @vote = (postit, type) -> postit.post "vote", {type}

  return @

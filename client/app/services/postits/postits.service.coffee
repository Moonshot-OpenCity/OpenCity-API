'use strict'

angular.module 'openCityApp'
.service 'postits', (Restangular) ->
  @search = (lat, lon, limit = 50) -> Restangular.all("postits").all("searchByLocation").getList({lat, lon, limit})

  @create = (options) -> Restangular.all("postits").post(options)

  return @

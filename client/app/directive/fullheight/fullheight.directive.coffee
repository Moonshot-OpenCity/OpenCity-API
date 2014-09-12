'use strict'

angular.module 'openCityApp'
.directive 'fullheight', ->
  restrict: 'EA'
  link: (scope, element, attrs) ->
    onResize = -> element.height(window.innerHeight + "px")
    $(window).on "resize", onResize
    onResize()
